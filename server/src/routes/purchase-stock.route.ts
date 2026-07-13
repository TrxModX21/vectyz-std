import { Router } from "express";
import {
  purchaseStockCreditGatewayController,
  purchaseStockMidtransGatewayController,
  purchaseStockPolarGatewayController,
} from "../controllers/purchase-stock.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const purchaseStockRoutes = Router();

purchaseStockRoutes.post(
  "/gateway/credit",
  requireAuth,
  purchaseStockCreditGatewayController,
);

purchaseStockRoutes.post(
  "/gateway/midtrans",
  requireAuth,
  purchaseStockMidtransGatewayController,
);

purchaseStockRoutes.post(
  "/gateway/polar",
  requireAuth,
  purchaseStockPolarGatewayController,
);

export default purchaseStockRoutes;
