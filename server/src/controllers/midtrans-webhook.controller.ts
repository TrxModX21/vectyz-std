import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { verifyPaymentNotification } from "../lib/midtrans";
import { midtransWebhookService } from "../services/midtrans-webhook.service";
import { HTTPSTATUS } from "../utils/http.config";

export const midtransWebhookController = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationBody = req.body;
    await verifyPaymentNotification(notificationBody);
    const result = await midtransWebhookService(notificationBody);
    return res.status(HTTPSTATUS.OK).json(result);
  },
);
