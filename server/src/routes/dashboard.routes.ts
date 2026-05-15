import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getAnalyticsController } from "../controllers/dashboard.controller";

const dashboardRoutes = Router();

dashboardRoutes.get("/vectyzen-analytics", requireAuth, getAnalyticsController);

export default dashboardRoutes;
