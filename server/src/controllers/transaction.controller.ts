import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { verifyPaymentNotification } from "../lib/midtrans";
import { HTTPSTATUS } from "../utils/http.config";
import { AppError } from "../utils/app-error";
import {
  createDirectPurchaseTransaction,
  createDonationTransactionGateway,
  createSubscriptionTransaction,
  createTopupTransaction,
  findAllTransactions,
  findOneTransaction,
  findUserTransactions,
  handlePaymentNotification,
  processDirectPurchaseWithCredit,
  processDonationWithCredit,
  getEarningsOverviewService,
  getEarningsHistoryService,
  requestPayoutService,
  createPolarDonationCheckout,
} from "../services/transaction.service";
import {
  getEarningsHistorySchema,
  requestPayoutSchema,
} from "../validation/transaction.validation";

export const createTopupController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { creditAmount, gateway } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!creditAmount) {
      throw new AppError("Credit Amount is required", HTTPSTATUS.BAD_REQUEST);
    }

    const result = await createTopupTransaction(userId, Number(creditAmount), gateway);

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
    const { planId, billingCycle, billingAddress, phone, gateway, currency } =
      req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!planId) {
      throw new AppError("Plan ID is required", HTTPSTATUS.BAD_REQUEST);
    }

    if (
      billingCycle &&
      !["MONTHLY", "YEARLY", "ONE_TIME"].includes(billingCycle)
    ) {
      throw new AppError(
        "Invalid billing cycle. Must be MONTHLY, YEARLY or ONE_TIME",
        HTTPSTATUS.BAD_REQUEST,
      );
    }

    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    const result = await createSubscriptionTransaction(
      userId,
      planId,
      billingCycle || "MONTHLY",
      ipAddress,
      billingAddress,
      phone,
      gateway,
      currency,
    );

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

export const createDonationGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { targetUserId, amount, stockId, currency } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!targetUserId) {
      throw new AppError("Target user ID is required", HTTPSTATUS.BAD_REQUEST);
    }

    if (!stockId) {
      throw new AppError("Stock ID is required", HTTPSTATUS.UNAUTHORIZED);
    }

    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    const isUSD = currency === "USD";
    let result;

    if (isUSD) {
      if (!amount || Number(amount) < 1) {
        throw new AppError(
          "Minimum donation amount is $1.00 USD",
          HTTPSTATUS.BAD_REQUEST,
        );
      }

      result = await createPolarDonationCheckout(
        userId,
        stockId,
        targetUserId,
        Number(amount),
        ipAddress,
      );
    } else {
      if (!amount || Number(amount) < 11000) {
        throw new AppError(
          "Minimum donation amount is Rp 11.000",
          HTTPSTATUS.BAD_REQUEST,
        );
      }

      result = await createDonationTransactionGateway(
        userId,
        stockId,
        targetUserId,
        Number(amount),
      );
    }

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Donation transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const createDonationCreditController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { targetUserId, amount, stockId } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!targetUserId) {
      throw new AppError("Target user ID is required", HTTPSTATUS.BAD_REQUEST);
    }

    if (!stockId) {
      throw new AppError("Stock ID is required", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!amount || Number(amount) < 11000) {
      throw new AppError(
        "Minimum donation amount is Rp 11.000",
        HTTPSTATUS.BAD_REQUEST,
      );
    }

    const result = await processDonationWithCredit(
      userId,
      stockId,
      targetUserId,
      Number(amount),
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Donation transaction via credit created",
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

export const getEarningsOverviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // Dynamic import to avoid missing schema issue at top if not imported
    const result = await getEarningsOverviewService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Earnings overview retrieved successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getEarningsHistoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const query = getEarningsHistorySchema.parse(req.query);

    const result = await getEarningsHistoryService(userId, query);
    return res.status(HTTPSTATUS.OK).json({
      message: "Earnings history retrieved successfully",
      timestamp: new Date().toISOString(),
      ...result,
    });
  },
);

export const requestPayoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const data = requestPayoutSchema.parse(req.body);

    const result = await requestPayoutService(userId, data);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Payout requested successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
