import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import {
  approveStockController,
  deleteStockController,
  getStockListController,
  rejectStockController,
  saveMetadataController,
} from "../../controllers/admin-access/manage-stock.controller";

const manageStocksRoutes = Router();

manageStocksRoutes.get(
  "/lists",
  requireAuth,
  requireRole(["admin"]),
  getStockListController,
);

manageStocksRoutes.patch(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  saveMetadataController,
);

manageStocksRoutes.patch(
  "/approve/:id",
  requireAuth,
  requireRole(["admin"]),
  approveStockController,
);

manageStocksRoutes.patch(
  "/reject/:id",
  requireAuth,
  requireRole(["admin"]),
  rejectStockController,
);

manageStocksRoutes.delete(
  "/delete/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteStockController,
);

export default manageStocksRoutes;
