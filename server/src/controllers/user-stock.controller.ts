import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { getMyStocksSchema } from "../validation/user-stock.validation";
import { HTTPSTATUS } from "../utils/http.config";
import { getMyStockListService } from "../services/user-stock.service";

export const getMyStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getMyStocksSchema.parse(req.query);
    const userId: string = res.locals.user.id;

    const { stocks, totalCount, totalPages, currentPage } =
      await getMyStockListService(userId, { ...query });

    return res.status(HTTPSTATUS.OK).json({
      message: "Stocks list fetched successfully",
      timestamp: new Date().toISOString(),
      totalCount,
      totalPages,
      currentPage,
      stocks,
    });
  },
);
