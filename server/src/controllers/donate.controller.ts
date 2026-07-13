import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";
import { donateCreditGatewaySchema } from "../validation/donate.validation";
import {
  donateCreditGatewayService,
  donateMidtransGatewayService,
  donatePolarGatewayService,
} from "../services/donate.service";

export const donateCreditGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;

    // 2. Validasi input request body menggunakan Zod schema
    const input = donateCreditGatewaySchema.parse(req.body);

    // 3. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // 4. Proses donasi melalui service
    const result = await donateCreditGatewayService(currentUserId, input);

    // 5. Kembalikan response sukses beserta data transaksi
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Donation transaction via credit success",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const donatePolarGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;

    // 2. Validasi input request body menggunakan Zod schema
    const input = donateCreditGatewaySchema.parse(req.body);

    // 3. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // 4. Dapatkan IP Address
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    // 5. Proses donasi melalui service
    const result = await donatePolarGatewayService(
      currentUserId,
      input,
      ipAddress,
    );

    // 6. Kembalikan response sukses beserta data transaksi
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Donation transaction via polar gateway created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const donateMidtransGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;

    // 2. Validasi input request body menggunakan Zod schema
    const input = donateCreditGatewaySchema.parse(req.body);

    // 3. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // 4. Proses donasi melalui service Midtrans
    const result = await donateMidtransGatewayService(currentUserId, input);

    // 5. Kembalikan response sukses beserta data transaksi
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Donation transaction via midtrans gateway created",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
