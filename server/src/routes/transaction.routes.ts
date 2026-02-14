
import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import {
  createTopupController,
  createSubscriptionController,
  buyAssetDirectController,
  buyAssetWithCreditController,
  paymentNotificationController,
  getAllTransactionsController,
  getUserTransactionsController,
  getTransactionDetailController,
} from "../controllers/transaction.controller";


const transactionRoutes = Router();

// Transactions
transactionRoutes.post("/topup", requireAuth, createTopupController);
transactionRoutes.post("/subscribe", requireAuth, createSubscriptionController);
transactionRoutes.post("/buy-asset/gateway", requireAuth, buyAssetDirectController);
transactionRoutes.post("/buy-asset/credit", requireAuth, buyAssetWithCreditController);

// Webhook (Public, Midtrans will call this)
transactionRoutes.post("/notification", paymentNotificationController);

// History & Detail
transactionRoutes.get("/", requireAuth, requireRole(["admin"]), getAllTransactionsController); // Admin
transactionRoutes.get("/me", requireAuth, getUserTransactionsController); // User
transactionRoutes.get("/:id", requireAuth, getTransactionDetailController); // Detail

export default transactionRoutes;
