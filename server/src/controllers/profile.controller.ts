import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  updateProfileBannerService,
  updateProfileBioService,
  updateProfileImageService,
  checkUsernameAvailabilityService,
  updateNewsletterService,
} from "../services/profile.service";
import {
  updateAvatarAndBannerSchema,
  updateProfileBioSchema,
  updateNewsletterSchema,
} from "../validation/profile.validation";

export const updateProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateAvatarAndBannerSchema.parse(req.body);

    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    await updateProfileImageService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile image updated successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const updateProfileBannerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateAvatarAndBannerSchema.parse(req.body);

    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    await updateProfileBannerService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile banner updated successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const updateProfileBioController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateProfileBioSchema.parse(req.body);

    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    await updateProfileBioService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile bio updated successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const checkUsernameAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    const username = req.query.username as string;
    if (!username) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Username query parameter is required",
        timestamp: new Date().toISOString(),
      });
    }

    const result = await checkUsernameAvailabilityService(userId, username);

    return res.status(HTTPSTATUS.OK).json(result);
  },
);

export const updateNewsletterController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateNewsletterSchema.parse(req.body);

    const userId = res.locals.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    await updateNewsletterService(userId, body.newsletter);

    return res.status(HTTPSTATUS.OK).json({
      message: "Newsletter preference updated successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
