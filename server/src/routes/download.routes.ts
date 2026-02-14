import { Router } from "express";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import {
  downloadStockController,
  checkAccessController,
} from "../controllers/download.controller";

const downloadRoutes = Router();

// Check Access (Optional Auth)
downloadRoutes.get("/:stockId/access", optionalAuth, checkAccessController);

// Download Stock (Protected)
downloadRoutes.post("/:stockId", requireAuth, downloadStockController);

export default downloadRoutes;
