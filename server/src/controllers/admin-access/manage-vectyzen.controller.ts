import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../../utils/http.config";
import {
  banVectyzenSchema,
  bulkDeleteVectyzenSchema,
  promoteVectyzenSchema,
} from "../../validation/manage-vectyzen.validation";
import {
  banVectyzenService,
  bulkDeleteVectyzenService,
  deleteVectyzenService,
  getVectyzenListService,
  getVectyzenStatsService,
  promoteVectyzenService,
} from "../../services/admin-access/manage-vectyzen.service";

export const getVectyzenStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getVectyzenStatsService();

    return res.status(HTTPSTATUS.OK).json({
      message: "Vectyzen stats fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getVectyzenListController = asyncHandler(
  async (req: Request, res: Response) => {
    const pageParam = parseInt(req.query.page as string, 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
    const filterAnon = (req.query.filterAnon as string) || "all";
    const filterBanned = (req.query.filterBanned as string) || "all";

    const result = await getVectyzenListService({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterAnon,
      filterBanned,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Vectyzen lists fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const promoteVectyzenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = promoteVectyzenSchema.parse(req.body);

    const result = await promoteVectyzenService(id as string, payload);

    return res.status(HTTPSTATUS.OK).json({
      message: "Vectyzen official status updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const banVectyzenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = banVectyzenSchema.parse(req.body);

    const result = await banVectyzenService(id as string, payload);

    return res.status(HTTPSTATUS.OK).json({
      message: payload.banned
        ? "Vectyzen banned successfully"
        : "Vectyzen unbanned successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const deleteVectyzenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await deleteVectyzenService(id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Vectyzen deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const bulkDeleteVectyzenController = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = bulkDeleteVectyzenSchema.parse(req.body);

    await bulkDeleteVectyzenService(payload);

    return res.status(HTTPSTATUS.OK).json({
      message: `${payload.ids.length} vectyzen deleted successfully`,
      timestamp: new Date().toISOString(),
    });
  },
);
