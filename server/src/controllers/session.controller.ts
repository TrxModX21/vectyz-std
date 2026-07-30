import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";
import { getMySessionService } from "../services/session.service";

export const getMySessionController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;

    // 2. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const result = await getMySessionService(currentUserId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Session retrieved successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
