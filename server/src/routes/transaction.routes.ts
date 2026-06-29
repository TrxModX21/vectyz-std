import { Router } from "express";
import { Webhooks } from "@polar-sh/express";
import { config } from "../utils/app.config";
import { handlePolarWebhookEvent } from "../services/transaction.service";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import {
  createTopupController,
  createSubscriptionController,
  buyAssetDirectController,
  buyAssetWithCreditController,
  createDonationGatewayController,
  createDonationCreditController,
  paymentNotificationController,
  getAllTransactionsController,
  getUserTransactionsController,
  getTransactionDetailController,
  getEarningsOverviewController,
  getEarningsHistoryController,
  requestPayoutController,
} from "../controllers/transaction.controller";


const transactionRoutes = Router();

// Transactions
transactionRoutes.post("/topup", requireAuth, createTopupController);
transactionRoutes.post("/subscribe", requireAuth, createSubscriptionController);
transactionRoutes.post("/buy-asset/gateway", requireAuth, buyAssetDirectController);
transactionRoutes.post("/buy-asset/credit", requireAuth, buyAssetWithCreditController);
transactionRoutes.post("/donate/gateway", requireAuth, createDonationGatewayController);
transactionRoutes.post("/donate/credit", requireAuth, createDonationCreditController);

// Earnings & Payouts (Must be before /:id)
transactionRoutes.get("/earnings/overview", requireAuth, getEarningsOverviewController);
transactionRoutes.get("/earnings/history", requireAuth, getEarningsHistoryController);
transactionRoutes.post("/payouts/request", requireAuth, requestPayoutController);

// Webhook (Public, Midtrans will call this)
transactionRoutes.post("/notification", paymentNotificationController);

// Polar Webhook (Public)
transactionRoutes.post(
  "/polar/notification",
  Webhooks({
    webhookSecret: config.POLAR_WEBHOOK_SECRET as string,
    onPayload: async (payload) => {
      await handlePolarWebhookEvent(payload);
    },
  })
);

// History & Detail
transactionRoutes.get("/", requireAuth, requireRole(["admin"]), getAllTransactionsController); // Admin
transactionRoutes.get("/me", requireAuth, getUserTransactionsController); // User
transactionRoutes.get("/:id", requireAuth, getTransactionDetailController); // Detail

export default transactionRoutes;
