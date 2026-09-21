import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/async-handler.middleware";
import {
  getBlogSettingsService,
  updateBlogSettingsService,
} from "../../../services/admin-access/manage-blog/settings.service";
import { HTTPSTATUS } from "../../../utils/http.config";
import { updateBlogSettingSchema } from "../../../validation/manage-blog-validation";

export const getBlogSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await getBlogSettingsService();

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog configuration fetched successfully",
      timestamp: new Date().toISOString(),
      data: settings,
    });
  },
);

export const updateBlogSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedPayload = updateBlogSettingSchema.parse(req.body);

    const result = await updateBlogSettingsService(parsedPayload);

    return res.status(HTTPSTATUS.OK).json({
      message: "Blog configuration updated successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
