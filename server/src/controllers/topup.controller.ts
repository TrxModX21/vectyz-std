import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { topUpGatewaySchema } from "../validation/topup.validation";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";
import {
  topUpMidtransGatewayService,
  topUpPolarGatewayService,
} from "../services/topup.service";
import { config } from "../utils/app.config";

export const topUpMidtransGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = res.locals.user?.id;
    const input = topUpGatewaySchema.parse(req.body);

    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const result = await topUpMidtransGatewayService(currentUserId, input);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Topup transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const topUpPolarGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = res.locals.user?.id;
    const input = topUpGatewaySchema.parse(req.body);

    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    if (!config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID) {
      throw new Error(
        "POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID is not configured",
      );
    }

    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    const result = await topUpPolarGatewayService(
      currentUserId,
      input,
      ipAddress,
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Topup transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
