import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";
import { purchaseStockSchema } from "../validation/purchase-stock.validation";
import {
  purchaseStockCreditGatewayService,
  purchaseStockMidtransGatewayService,
  purchaseStockPolarGatewayService,
} from "../services/purchase-stock.service";

export const purchaseStockCreditGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;

    // 2. Validasi input request body menggunakan Zod schema
    const input = purchaseStockSchema.parse(req.body);

    // 3. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    const result = await purchaseStockCreditGatewayService(
      currentUserId,
      input,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock purchased successfully via credit gateway",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const purchaseStockMidtransGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;

    // 2. Validasi input request body menggunakan Zod schema
    const input = purchaseStockSchema.parse(req.body);

    // 3. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // 4. Proses pembelian melalui service Midtrans
    const result = await purchaseStockMidtransGatewayService(
      currentUserId,
      input,
    );

    // 5. Kembalikan response sukses beserta data transaksi
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Purchase transaction created via Midtrans",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const purchaseStockPolarGatewayController = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Dapatkan ID user yang sedang login dari token
    const currentUserId = res.locals.user?.id;
    
    // 2. Validasi input request body menggunakan Zod schema
    const input = purchaseStockSchema.parse(req.body);

    // 3. Pastikan user sudah login
    if (!currentUserId) {
      throw new AppError("User not authenticated", HTTPSTATUS.UNAUTHORIZED);
    }

    // 4. Ambil IP Address untuk diteruskan ke Polar Checkout
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    // 5. Proses pembelian melalui service Polar
    const result = await purchaseStockPolarGatewayService(
      currentUserId,
      input,
      ipAddress,
    );

    // 6. Kembalikan response sukses beserta URL checkout Polar
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Purchase transaction created via Polar",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
