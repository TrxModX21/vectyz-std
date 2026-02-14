import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import * as DownloadService from "../services/download.service";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";

export const downloadStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const stockId = req.params.stockId as string;

    if (!userId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // 1. Validate Access
    const access = await DownloadService.validateDownloadAccess(
      userId,
      stockId,
    );

    // 2. Record History & Quota Deduction
    await DownloadService.recordDownloadHistory(userId, stockId, access.reason);

    // 3. Generate ZIP Stream
    const result = await DownloadService.createStockZipStream(stockId);

    // 4. Pipe Response
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`,
    );

    result.stream.pipe(res);

    result.stream.on("error", (err: any) => {
      console.error("Stream error", err);
      // If headers not sent, send error. If sent, too late, stream will just end.
      if (!res.headersSent) {
        res.status(500).send("Download failed");
      }
    });

    // Handle close/finish if needed, usually pipe handles it.
  },
);

export const checkAccessController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    const { stockId } = req.params;

    // Public/Guest -> No Access
    if (!userId) {
      return res
        .status(HTTPSTATUS.OK)
        .json({ allowed: false, reason: "Guest" });
    }

    const result = await DownloadService.checkStockAccess(
      userId,
      stockId as string,
    );

    return res.status(HTTPSTATUS.OK).json(result);
  },
);
