import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import { getAnalyticsService } from "../services/dashboard.service";
import { AppError } from "../utils/app-error";

export const getAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const data = await getAnalyticsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Analytics fetched successfully",
      timestamp: new Date().toISOString(),
      data,
    });
  },
);
