import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  getBlogPostCategoryService,
  getBlogPostDetailService,
  getBlogPostsService,
  getBlogPostSettingsService,
} from "../services/blog.service";

export const getBlogPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const categorySlug = (req.query.category as string) || "";

    const result = await getBlogPostsService(page, limit, search, categorySlug);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog posts fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getBlogPostDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const result = await getBlogPostDetailService(slug as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog post detail fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getBlogPostCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getBlogPostCategoryService();

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog posts category fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getBlogPostSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getBlogPostSettingsService();

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog post global settings fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
