import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import { AppError } from "../utils/app-error";
import {
  findAllTransactions,
  findOneTransaction,
  findUserTransactions,
  getEarningsOverviewService,
  getEarningsHistoryService,
  requestPayoutService,
} from "../services/transaction.service";
import {
  getEarningsHistorySchema,
  requestPayoutSchema,
} from "../validation/transaction.validation";

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
