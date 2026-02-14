import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  followUserService,
  unfollowUserService,
  checkFollowStatusService,
  getUserFollowersService,
  getUserFollowingService,
} from "../services/follow.service";

export const followUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const followingId = req.params.id as string;
    const followerId = res.locals.user?.id;

    if (!followerId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "You must be logged in to follow users",
        timestamp: new Date().toISOString(),
      });
    }

    await followUserService(followerId, followingId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully followed user",
      timestamp: new Date().toISOString(),
    });
  },
);

export const unfollowUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const followingId = req.params.id as string;
    const followerId = res.locals.user?.id;

    if (!followerId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "You must be logged in to unfollow users",
        timestamp: new Date().toISOString(),
      });
    }

    await unfollowUserService(followerId, followingId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully unfollowed user",
      timestamp: new Date().toISOString(),
    });
  },
);

export const checkFollowStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const followingId = req.params.id as string;
    const followerId = res.locals.user?.id;

    if (!followerId) {
      // If not logged in, they are definitely not following
      return res.status(HTTPSTATUS.OK).json({
        isFollowing: false,
      });
    }

    const status = await checkFollowStatusService(followerId, followingId);

    return res.status(HTTPSTATUS.OK).json(status);
  },
);

export const getUserFollowersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getUserFollowersService(userId, page, limit);

    return res.status(HTTPSTATUS.OK).json({
      message: "Followers retrieved successfully",
      timestamp: new Date().toISOString(),

      ...result,
    });
  },
);

export const getUserFollowingController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getUserFollowingService(userId, page, limit);

    return res.status(HTTPSTATUS.OK).json({
      message: "Following list retrieved successfully",
      timestamp: new Date().toISOString(),

      ...result,
    });
  },
);
