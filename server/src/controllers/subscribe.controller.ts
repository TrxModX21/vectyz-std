import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { subscriptionSchema } from "../validation/subscribe.validation";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";
import {
  subscribeMidtransGatewayService,
  subscribePolarGatewayService,
} from "../services/subscribe.service";

export const subscribePolarGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = res.locals.user?.id;
    const input = subscriptionSchema.parse(req.body);

    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    const result = await subscribePolarGatewayService(
      currentUserId,
      input,
      ipAddress,
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Subscribe transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const subscribeMidtransGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = res.locals.user?.id;
    const input = subscriptionSchema.parse(req.body);

    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const result = await subscribeMidtransGatewayService(currentUserId, input);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Subscribe transaction created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
