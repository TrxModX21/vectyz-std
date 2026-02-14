import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { verifyPaymentNotification } from "../lib/midtrans";
import { HTTPSTATUS } from "../utils/http.config";
import { AppError } from "../utils/app-error";
import {
  createDirectPurchaseTransaction,
  createSubscriptionTransaction,
  createTopupTransaction,
  findAllTransactions,
  findOneTransaction,
  findUserTransactions,
  handlePaymentNotification,
  processDirectPurchaseWithCredit,
} from "../services/transaction.service";

export const createTopupController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { amount } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!amount) {
      throw new AppError("Amount is required", HTTPSTATUS.BAD_REQUEST);
    }

    const result = await createTopupTransaction(userId, Number(amount));

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Topup transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const createSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { planId } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!planId) {
      throw new AppError("Plan ID is required", HTTPSTATUS.BAD_REQUEST);
    }

    const result = await createSubscriptionTransaction(userId, planId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Subscription transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const buyAssetDirectController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { stockId } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!stockId) {
      throw new AppError("Stock ID is required", HTTPSTATUS.BAD_REQUEST);
    }

    const result = await createDirectPurchaseTransaction(userId, stockId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Purchase transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const buyAssetWithCreditController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { stockId } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!stockId) {
      throw new AppError("Stock ID is required", HTTPSTATUS.BAD_REQUEST);
    }

    const transaction = await processDirectPurchaseWithCredit(userId, stockId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Asset purchased successfully",
      timestamp: new Date().toISOString(),
      data: transaction,
    });
  },
);

export const paymentNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationBody = req.body;
    await verifyPaymentNotification(notificationBody);
    const result = await handlePaymentNotification(notificationBody);
    return res.status(HTTPSTATUS.OK).json(result);
  },
);

export const getAllTransactionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await findAllTransactions(req.query);
    return res.status(HTTPSTATUS.OK).json({
      message: "Transactions retrieved successfully",
      timestamp: new Date().toISOString(),
      ...result,
    });
  },
);

export const getUserTransactionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId)
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);

    const result = await findUserTransactions(userId, req.query);
    return res.status(HTTPSTATUS.OK).json({
      message: "My transactions retrieved successfully",
      timestamp: new Date().toISOString(),
      ...result,
    });
  },
);

export const getTransactionDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = res.locals.user?.id;
    const role = res.locals.user?.role;

    if (!userId)
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);

    const transaction = await findOneTransaction(id as string);

    // Authorization Check: Admin can see all, User can only see their own
    if (role !== "admin" && transaction.userId !== userId) {
      throw new AppError(
        "You are not authorized to view this transaction",
        HTTPSTATUS.FORBIDDEN,
      );
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "Transaction detail retrieved successfully",
      timestamp: new Date().toISOString(),
      data: transaction,
    });
  },
);
