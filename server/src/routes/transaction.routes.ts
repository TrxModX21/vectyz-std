import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import {
  getAllTransactionsController,
  getUserTransactionsController,
  getTransactionDetailController,
  getEarningsOverviewController,
  getEarningsHistoryController,
  requestPayoutController,
} from "../controllers/transaction.controller";

const transactionRoutes = Router();

// Earnings & Payouts (Must be before /:id)
transactionRoutes.get(
  "/earnings/overview",
  requireAuth,
  getEarningsOverviewController,
);
transactionRoutes.get(
  "/earnings/history",
  requireAuth,
  getEarningsHistoryController,
);
transactionRoutes.post(
  "/payouts/request",
  requireAuth,
  requestPayoutController,
);

// History & Detail
transactionRoutes.get(
  "/",
  requireAuth,
  requireRole(["admin"]),
  getAllTransactionsController,
); // Admin
transactionRoutes.get("/me", requireAuth, getUserTransactionsController); // User
transactionRoutes.get("/:id", requireAuth, getTransactionDetailController); // Detail

export default transactionRoutes;
