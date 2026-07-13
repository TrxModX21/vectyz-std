import { Router } from "express";
import {
  donateCreditGatewayController,
  donateMidtransGatewayController,
  donatePolarGatewayController,
} from "../controllers/donate.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const donateRoutes = Router();

donateRoutes.post(
  "/gateway/credit",
  requireAuth,
  donateCreditGatewayController,
);

donateRoutes.post("/gateway/polar", requireAuth, donatePolarGatewayController);

donateRoutes.post(
  "/gateway/midtrans",
  requireAuth,
  donateMidtransGatewayController,
);

export default donateRoutes;
