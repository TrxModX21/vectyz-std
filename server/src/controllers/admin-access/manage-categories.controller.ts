import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../../utils/http.config";
import {
  changeCategoryVisibilityService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  bulkDeleteCategoryService,
  getCategoriesListService,
} from "../../services/admin-access/manage-categories.service";
import {
  createCategorySchema,
  updateCategorySchema,
  updateStatusCategorySchema,
  bulkDeleteCategorySchema,
} from "../../validation/category.validation";

export const getCategoriesListController = asyncHandler(
  async (req: Request, res: Response) => {
    const pageParam = parseInt(req.query.page as string, 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    const result = await getCategoriesListService({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Category lists fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = createCategorySchema.parse(req.body);

    const result = await createCategoryService(parsedPayload);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Category created successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedPayload = updateCategorySchema.parse(req.body);

    const result = await updateCategoryService(id as string, parsedPayload);

    return res.status(HTTPSTATUS.OK).json({
      message: "Category updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const changeCategoryVisibilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = updateStatusCategorySchema.parse(req.body);

    const result = await changeCategoryVisibilityService(id as string, status);

    return res.status(HTTPSTATUS.OK).json({
      message: "Category visibility changed successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await deleteCategoryService(id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Category deleted successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const bulkDeleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = bulkDeleteCategorySchema.parse(req.body);

    const result = await bulkDeleteCategoryService(ids);

    return res.status(HTTPSTATUS.OK).json({
      message: `${ids.length} categories deleted successfully`,
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
