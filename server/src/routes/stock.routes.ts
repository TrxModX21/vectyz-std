import { Router } from "express";
import {
  requireAuth,
  requireRole,
  optionalAuth,
} from "../middlewares/auth.middleware";
import {
  createStockController,
  getAllStocksController,
  deleteStockController,
  updateStockStatusController,
  getStockByIdController,
  updateStockController,
  getPopularFreeVectorStocksController,
  getTrendingStocksController,
  getRelatedStocksController,
  toggleLikeController,
  incrementViewController,
} from "../controllers/stock.controller";

const stockRoutes = Router();

stockRoutes.get("/", getAllStocksController);
stockRoutes.get("/trending", getTrendingStocksController);
stockRoutes.get("/popular-free-vector", getPopularFreeVectorStocksController);
stockRoutes.get("/:id/related", getRelatedStocksController);
stockRoutes.get("/:id", optionalAuth, getStockByIdController);
stockRoutes.post("/:id/view", optionalAuth, incrementViewController);
stockRoutes.post("/:stockId/like", requireAuth, toggleLikeController);
stockRoutes.post("/", requireAuth, createStockController);
stockRoutes.put("/:id", requireAuth, updateStockController);
stockRoutes.patch(
  "/:id/status",
  requireAuth,
  requireRole(["admin", "reviewer"]),
  updateStockStatusController,
);
stockRoutes.delete("/:id", requireAuth, deleteStockController);

export default stockRoutes;
