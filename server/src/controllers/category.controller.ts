import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import { allCategoryService, createCategoryService, deleteCategoryService, updateCategoryService, updateStatusCategoryService } from "../services/category.service";
import { createCategorySchema, updateCategorySchema, updateStatusCategorySchema } from "../validation/category.validation";

export const allCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { categories, totalCount } = await allCategoryService();

    return res.status(HTTPSTATUS.OK).json({
      message: "All category retrieved successfully",
      timestamp: new Date().toISOString(),
      categories,
      totalCount,
    });
  },
);

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createCategorySchema.parse(req.body); // Validate with Zod

    const category = await createCategoryService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Category created successfully",
      timestamp: new Date().toISOString(),
      category,
    });
  },
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateCategorySchema.parse(req.body);

    const category = await updateCategoryService(id as string, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Category updated successfully",
      timestamp: new Date().toISOString(),
      category,
    });
  },
);

export const updateCategoryStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateStatusCategorySchema.parse(req.body);

    const category = await updateStatusCategoryService(id as string, body.status);

    return res.status(HTTPSTATUS.OK).json({
      message: "Category status updated successfully",
      timestamp: new Date().toISOString(),
      category,
    });
  },
);

export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await deleteCategoryService(id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Category deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
