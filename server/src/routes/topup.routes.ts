import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { topUpMidtransGatewayController, topUpPolarGatewayController } from "../controllers/topup.controller";

const topUpRoutes = Router();

topUpRoutes.post(
  "/gateway/midtrans",
  requireAuth,
  topUpMidtransGatewayController,
);

topUpRoutes.post(
  "/gateway/polar",
  requireAuth,
  topUpPolarGatewayController,
);

export default topUpRoutes;
