import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/async-handler.middleware";
import {
  createBlogCategoryService,
  createBlogTagService,
  deleteBlogCategoryService,
  deleteBlogTagService,
  getBlogCategoriesService,
  getBlogTagsService,
  updateBlogCategoryService,
  updateBlogTagService,
} from "../../../services/admin-access/manage-blog/taxonomy.service";
import { HTTPSTATUS } from "../../../utils/http.config";
import {
  createBlogCategorySchema,
  createBlogTagSchema,
  updateBlogCategorySchema,
  updateBlogTagSchema,
} from "../../../validation/manage-blog-validation";

// ==========================================
// CATEGORY CONTROLLER
// ==========================================
export const getBlogCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getBlogCategoriesService();

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog category list fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const createBlogCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = createBlogCategorySchema.parse(req.body);
    const result = await createBlogCategoryService(parsedPayload);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Blog category created successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const updateBlogCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = updateBlogCategorySchema.parse(req.body);
    const result = await updateBlogCategoryService(
      req.params.id as string,
      parsedPayload,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog category updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const deleteBlogCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteBlogCategoryService(req.params.id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog category deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

// ==========================================
// TAGS CONTROLLER
// ==========================================
export const getBlogTagsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getBlogTagsService();
    return res.status(HTTPSTATUS.OK).json({
      message: "Blog tags list fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
export const createBlogTagController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = createBlogTagSchema.parse(req.body);
    const result = await createBlogTagService(parsedPayload);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Blog tag created successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
export const updateBlogTagController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = updateBlogTagSchema.parse(req.body);
    const result = await updateBlogTagService(
      req.params.id as string,
      parsedPayload,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog tag updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
export const deleteBlogTagController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteBlogTagService(req.params.id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog tag deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
