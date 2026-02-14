import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  getAllUsersService,
  banUserService,
  getUserByIdService,
  createUserService,
  getMeService,
  updateMeService,
  deleteMeService,
} from "../services/user.service";
import { z } from "zod";
import { updateProfileSchema } from "../validation/user.validation";

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const { users, totalCount, totalPages } = await getAllUsersService({
      page,
      limit,
      search,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Users retrieved successfully",
      users,
      totalCount,
      totalPages,
      page,
      limit,
    });
  },
);

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = await getUserByIdService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User retrieved successfully",
      user,
    });
  },
);

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const bodySpec = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.email("Invalid email"),
      role: z.enum(["user", "admin"]),
    });

    const body = bodySpec.parse(req.body);

    const newUser = await createUserService({
      name: body.name,
      email: body.email,
      role: body.role,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      user: newUser,
    });
  },
);

export const banUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const adminId = res.locals.user?.id;
    const bodySpec = z.object({
      reason: z.string().optional(),
    });
    const { reason } = bodySpec.parse(req.body);

    if (!adminId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const { isBanning } = await banUserService(userId, adminId, reason);

    return res.status(HTTPSTATUS.OK).json({
      message: isBanning
        ? "User banned successfully"
        : "User unbanned successfully",
    });
  },
);

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    const user = await getMeService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile retrieved successfully",
      timestamp: new Date().toISOString(),
      user,
    });
  },
);

export const updateMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    const body = updateProfileSchema.parse(req.body);

    const updatedUser = await updateMeService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile updated successfully",
      timestamp: new Date().toISOString(),
      user: updatedUser,
    });
  },
);

export const deleteMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    await deleteMeService(userId);

    // Clear session cookie if set
    res.clearCookie("better-auth.session_token");

    return res.status(HTTPSTATUS.OK).json({
      message: "Account deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
