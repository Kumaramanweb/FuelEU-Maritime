import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in development (important for hot reload)
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // useful for debugging
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}