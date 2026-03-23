import { prisma } from "../../../infrastructure/db";

export const routeRepo = {
  async getRoutes() {
    return prisma.route.findMany();
  },

  async getRoutesByYear(year: number) {
    return prisma.route.findMany({ where: { year } });
  },

  async setBaseline(id: string) {
    const route = await prisma.route.findUnique({
      where: { routeId: id }
    });

    if (!route) throw new Error("Route not found");

    await prisma.route.updateMany({
      where: { year: route.year },
      data: { isBaseline: false }
    });

    await prisma.route.update({
      where: { routeId: id },
      data: { isBaseline: true }
    });
  }
};

export const bankRepo = {
  async getBank(shipId: string, year: number) {
    const records = await prisma.bankEntry.findMany({
      where: { shipId, year }
    });

    return records.reduce((sum, r) => sum + r.amount, 0);
  },

  async addBank(shipId: string, year: number, amount: number) {
    return prisma.bankEntry.create({
      data: { shipId, year, amount }
    });
  },

  async applyBank(shipId: string, year: number, amount: number) {
    return prisma.bankEntry.create({
      data: { shipId, year, amount: -amount }
    });
  }
};  