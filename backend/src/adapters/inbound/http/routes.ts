import express from "express";
import { routeRepo, bankRepo } from "../../outbound/postgress/prismaRepos";
import { computeCB } from "../../../core/application/computeCB";
import { canBank, applyBank } from "../../../core/application/banking";
import { createPool } from "../../../core/application/pooling";

const router = express.Router();

const TARGET = 89.3368;

// ROUTES
router.get("/routes", async (req, res) => {
  res.json(await routeRepo.getRoutes());
});

router.post("/routes/:id/baseline", async (req, res) => {
  await routeRepo.setBaseline(req.params.id);
  res.json({ message: "Baseline updated" });
});

// COMPARISON
router.get("/routes/comparison", async (req, res) => {
  const year = Number(req.query.year);
  const routes = await routeRepo.getRoutesByYear(year);

  const baseline = routes.find((r: any) => r.isBaseline);
  if (!baseline) return res.status(400).json({ error: "No baseline" });

  const result = routes.map((r: any) => ({
    ...r,
    percentDiff: (((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100).toFixed(2),
    compliant: r.ghgIntensity <= TARGET
  }));

  res.json(result);
});

// CB
router.get("/compliance/cb", async (req, res) => {
  const year = Number(req.query.year);
  const shipId = req.query.shipId as string;

  const routes = await routeRepo.getRoutesByYear(year);
  const route = routes.find((r: any) => r.routeId === shipId);

  if (!route) return res.status(404).json({ error: "Not found" });

  const cb = computeCB(route.ghgIntensity, route.fuelConsumption);

  res.json({ shipId, year, cb });
});

// BANKING
router.get("/banking/records", async (req, res) => {
  const { shipId, year } = req.query as any;
  const bank = await bankRepo.getBank(shipId, Number(year));
  res.json({ bank });
});

router.post("/banking/bank", async (req, res) => {
  const { shipId, year, cb } = req.body;

  if (!canBank(cb)) {
    return res.status(400).json({ error: "Cannot bank negative CB" });
  }

  await bankRepo.addBank(shipId, year, cb);

  res.json({ message: "Banked successfully" });
});

router.post("/banking/apply", async (req, res) => {
  const { shipId, year, deficit } = req.body;

  const bank = await bankRepo.getBank(shipId, year);

  const result = applyBank(bank, deficit);

  await bankRepo.applyBank(shipId, year, result.applied);

  res.json(result);
});

// POOLING
router.post("/pools", (req, res) => {
  try {
    const result = createPool(req.body.members);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;