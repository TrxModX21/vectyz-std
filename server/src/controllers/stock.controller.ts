import { Request, Response } from "express";
import { HTTPSTATUS } from "../utils/http.config";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  createStockSchema,
  getAllStocksSchema,
  getStockByUserSchema,
  updateStockSchema,
} from "../validation/stock.validation";
import {
  createStock,
  getAllStocks,
  deleteStock,
  updateStockStatus,
  getStockById,
  updateStock,
  getPopularFreeVectorStocks,
  getTrendingStocks,
  getRelatedStocks,
  toggleLike,
  incrementView,
  getStockFromUser,
  getStocksForSitemap,
} from "../services/stock.service";
import { BadRequestException } from "../utils/app-error";

export const getAllStocksController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getAllStocksSchema.parse(req.query);
    const viewer = res.locals.user;

    const { stocks, totalCount, totalPages, currentPage } = await getAllStocks(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
        categoryId: query.categoryId,
        fileTypeId: query.fileTypeId,
        status: query.status,
        isPremium: query.isPremium,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
      viewer?.id,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Stocks fetched successfully",
      timestamp: new Date().toISOString(),
      totalCount,
      totalPages,
      currentPage,
      stocks,
    });
  },
);

export const getStockByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const user = res.locals.user;

    const stock = await getStockById(slug, user?.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock fetched successfully",
      timestamp: new Date().toISOString(),
      stock,
    });
  },
);

export const getStockByUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const viewer = res.locals.user;
    const query = getStockByUserSchema.parse(req.query);

    const { stocks, totalCount, totalPages, currentPage } =
      await getStockFromUser(
        userId,
        {
          ...query,
        },
        viewer?.id,
      );

    return res.status(HTTPSTATUS.OK).json({
      message: "Stocks fetched successfully",
      timestamp: new Date().toISOString(),
      totalCount,
      totalPages,
      currentPage,
      stocks,
    });
  },
);

export const createStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createStockSchema.parse(req.body);

    const user = res.locals.user;

    const stock = await createStock({
      ...body,
      userId: user.id,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Stock uploaded successfully",
      timestamp: new Date().toISOString(),
      stock,
    });
  },
);

export const updateStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const body = updateStockSchema.parse(req.body);
    const user = res.locals.user;

    const result = await updateStock(id, user.id, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const updateStockStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, rejectionReason } = req.body;

    if (!status) {
      throw new BadRequestException("Status required");
    }

    const stock = await updateStockStatus(id, status, rejectionReason);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock status updated successfully",
      timestamp: new Date().toISOString(),
      stock,
    });
  },
);

export const deleteStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = res.locals.user;

    await deleteStock(id, user.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const getPopularFreeVectorStocksController = asyncHandler(
  async (req: Request, res: Response) => {
    const viewer = res.locals.user;

    const stocks = await getPopularFreeVectorStocks(viewer?.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Popular stocks fetched successfully",
      timestamp: new Date().toISOString(),
      stocks,
    });
  },
);

export const getTrendingStocksController = asyncHandler(
  async (req: Request, res: Response) => {
    const viewer = res.locals.user;
    const fileType = req.query.fileType as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    console.log("limit " + limit);

    const stocks = await getTrendingStocks(viewer?.id, fileType, limit);

    return res.status(HTTPSTATUS.OK).json({
      message: "Trending stocks fetched successfully",
      timestamp: new Date().toISOString(),
      stocks,
    });
  },
);

export const getRelatedStocksController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const viewer = res.locals.user;

    const stocks = await getRelatedStocks(id, limit, viewer?.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Related stocks fetched successfully",
      timestamp: new Date().toISOString(),
      stocks,
    });
  },
);

export const toggleLikeController = asyncHandler(
  async (req: Request, res: Response) => {
    const stockId = req.params.stockId as string;
    const user = res.locals.user;

    const result = await toggleLike(user.id, stockId);

    return res.status(HTTPSTATUS.OK).json({
      message: result.liked ? "Stock liked" : "Stock unliked",
      timestamp: new Date().toISOString(),
      ...result,
    });
  },
);

export const incrementViewController = asyncHandler(
  async (req: Request, res: Response) => {
    const stockId = req.params.id as string;

    // Get IP Address
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";

    // Get User ID if logged in (optional)
    const user = res.locals.user;

    const result = await incrementView(stockId, ipAddress, user?.id);

    return res.status(HTTPSTATUS.OK).json({
      message: result.viewed ? "View counted" : "View processing skipped",
      ...result,
    });
  },
);

export const getStocksSitemapController = asyncHandler(
  async (req: Request, res: Response) => {
    const stocks = await getStocksForSitemap();
    return res.status(HTTPSTATUS.OK).json({
      message: "Sitemap data fetched successfully",
      stocks,
    });
  },
);
