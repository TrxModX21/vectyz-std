import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import {
  approveStockService,
  deleteStockService,
  getStockListService,
  rejectStockService,
  saveMetadataService,
} from "../../services/admin-access/manage-stock.service";
import { HTTPSTATUS } from "../../utils/http.config";
import { updateStockMetadataSchema } from "../../validation/manage-stock.validation";

export const getStockListController = asyncHandler(
  async (req: Request, res: Response) => {
    const pageParam = parseInt(req.query.page as string, 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
    const filterStatus = (req.query.filterStatus as string) || "all";

    const result = await getStockListService({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterStatus,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock list fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const saveMetadataController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = updateStockMetadataSchema.parse(req.body);

    const updatedStock = await saveMetadataService(id as string, validatedData);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock metadata saved successfully",
      timestamp: new Date().toISOString(),
      data: updatedStock,
    });
  },
);

export const approveStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const reviewerId = res.locals.user?.id;

    await approveStockService(id as string, reviewerId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock approve successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const rejectStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const reviewerId = res.locals.user?.id;
    const { rejectionReason } = req.body;

    await rejectStockService(id as string, reviewerId, rejectionReason);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock rejected successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const deleteStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await deleteStockService(id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
