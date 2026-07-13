import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  subscribeMidtransGatewayController,
  subscribePolarGatewayController,
} from "../controllers/subscribe.controller";

const subscribeRoutes = Router();

subscribeRoutes.post(
  "/gateway/polar",
  requireAuth,
  subscribePolarGatewayController,
);

subscribeRoutes.post(
  "/gateway/midtrans",
  requireAuth,
  subscribeMidtransGatewayController,
);

export default subscribeRoutes;
