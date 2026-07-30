import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import {
  changeFiletypeVisibilityService,
  createFiletypeService,
  deleteFiletypeService,
  getFiletypeListService,
  updateFiletypeService,
  bulkDeleteFiletypeService,
} from "../../services/admin-access/manage-filetypes.service";
import { HTTPSTATUS } from "../../utils/http.config";
import {
  createFileTypeSchema,
  updateFileTypeSchema,
} from "../../validation/file-type.validation";

export const getFiletypeListController = asyncHandler(
  async (req: Request, res: Response) => {
    const pageParam = parseInt(req.query.page as string, 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    const result = await getFiletypeListService({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Filetype lists fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const createFiletypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = createFileTypeSchema.parse(req.body);

    const result = await createFiletypeService(parsedPayload);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Filetype created successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const updateFiletypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedPayload = updateFileTypeSchema.parse(req.body);

    const result = await updateFiletypeService(id as string, parsedPayload);

    return res.status(HTTPSTATUS.OK).json({
      message: "Filetype updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const changeVisibilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    await changeFiletypeVisibilityService(id as string, status);
    return res.status(HTTPSTATUS.OK).json({
      message: "Filetype visibility changed successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const deleteFiletypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteFiletypeService(id as string);
    return res.status(HTTPSTATUS.OK).json({
      message: "Filetype deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const bulkDeleteFiletypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    await bulkDeleteFiletypeService(ids);
    return res.status(HTTPSTATUS.OK).json({
      message: "Filetypes deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
