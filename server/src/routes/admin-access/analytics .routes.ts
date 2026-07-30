import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { getOverviewStatsController, getRecentSalesController, getTopAssetsAnalyticsController, getTopVectyzenAnalyticsController, getTrafficAnalyticsController, getGeoAnalyticsController } from "../../controllers/admin-access/dashboard-analytics.controller";

const analyticsRoutes = Router();

analyticsRoutes.get(
  "/dashboard/overview-stats",
  requireAuth,
  requireRole(["admin"]),
  getOverviewStatsController,
);

analyticsRoutes.get(
  "/dashboard/recent-sales",
  requireAuth,
  requireRole(["admin"]),
  getRecentSalesController,
);

analyticsRoutes.get(
  "/dashboard/top-assets",
  requireAuth,
  requireRole(["admin"]),
  getTopAssetsAnalyticsController,
);

analyticsRoutes.get(
  "/dashboard/top-vectyzen",
  requireAuth,
  requireRole(["admin"]),
  getTopVectyzenAnalyticsController,
);

analyticsRoutes.get(
  "/dashboard/traffic",
  requireAuth,
  requireRole(["admin"]),
  getTrafficAnalyticsController,
);

analyticsRoutes.get(
  "/dashboard/geo",
  requireAuth,
  requireRole(["admin"]),
  getGeoAnalyticsController,
);

export default analyticsRoutes;
