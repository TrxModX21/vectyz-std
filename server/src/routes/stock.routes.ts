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
  getStockByUserController,
  getStocksSitemapController,
} from "../controllers/stock.controller";

const stockRoutes = Router();

stockRoutes.get("/", optionalAuth, getAllStocksController);
stockRoutes.get("/trending", optionalAuth, getTrendingStocksController);
stockRoutes.get(
  "/popular-free-vector",
  optionalAuth,
  getPopularFreeVectorStocksController,
);
stockRoutes.get("/:id/related", optionalAuth, getRelatedStocksController);
stockRoutes.get("/sitemap/all", getStocksSitemapController);
stockRoutes.get("/:slug", optionalAuth, getStockByIdController);
stockRoutes.get("/from-user/:userId", optionalAuth, getStockByUserController);
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
