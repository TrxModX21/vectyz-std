import { Router } from "express";
import { Webhooks } from "@polar-sh/express";
import { config } from "../utils/app.config";
import { handlePolarWebhookEventService } from "../services/polar-webhooks.service";
import { midtransWebhookController } from "../controllers/midtrans-webhook.controller";

const webhooksRoutes = Router();

webhooksRoutes.post(
  "/polar",
  Webhooks({
    webhookSecret: config.POLAR_WEBHOOK_SECRET as string,
    onPayload: async (payload) => {
      await handlePolarWebhookEventService(payload);
    },
  }),
);

webhooksRoutes.post("/midtrans", midtransWebhookController);

export default webhooksRoutes;
