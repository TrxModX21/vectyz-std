import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../../../utils/http.config";
import {
  createBlogPostService,
  deleteBlogPostService,
  getBlogPostByIdService,
  getBlogPostsService,
  updateBlogPostService,
  bulkDeleteBlogPostService,
} from "../../../services/admin-access/manage-blog/posts.service";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
} from "../../../validation/manage-blog-validation";

export const getBlogPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = req.query.status as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;

    const result = await getBlogPostsService(
      page,
      limit,
      search,
      status,
      categoryId,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog posts fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getBlogPostByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getBlogPostByIdService(req.params.id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog post fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const createBlogPostController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = createBlogPostSchema.parse(req.body);

    // Menggunakan ID admin yang sedang memanggil request ini:
    const authorId = res.locals.user?.id;
    const result = await createBlogPostService(authorId, parsedPayload);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Blog post created successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const updateBlogPostController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = updateBlogPostSchema.parse(req.body);

    const result = await updateBlogPostService(
      req.params.id as string,
      parsedPayload,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog post updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const deleteBlogPostController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteBlogPostService(req.params.id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog post deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const bulkDeleteBlogPostController = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    await bulkDeleteBlogPostService(ids);
    
    return res.status(HTTPSTATUS.OK).json({
      message: "Blog posts deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);