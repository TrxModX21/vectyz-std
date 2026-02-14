import { Router } from "express";
import {
  getAllUsersController,
  banUserController,
  getUserByIdController,
  createUserController,
  getMeController,
  updateMeController,
  deleteMeController,
} from "../controllers/user.controller";
import {
  followUserController,
  unfollowUserController,
  checkFollowStatusController,
  getUserFollowersController,
  getUserFollowingController,
} from "../controllers/follow.controller";
import {
  requireAuth,
  requireRole,
  optionalAuth,
} from "../middlewares/auth.middleware";

const userRoutes = Router();

// Follow System Routes (Public/User Access)
userRoutes.post("/:id/follow", requireAuth, followUserController);
userRoutes.delete("/:id/follow", requireAuth, unfollowUserController);
userRoutes.get("/:id/follow-status", optionalAuth, checkFollowStatusController);
userRoutes.get("/:id/followers", optionalAuth, getUserFollowersController);
userRoutes.get("/:id/following", optionalAuth, getUserFollowingController);

// Authenticated User Routes (Must be before /:id)
userRoutes.get("/me", requireAuth, getMeController);
userRoutes.patch("/me", requireAuth, updateMeController);
userRoutes.delete("/me", requireAuth, deleteMeController);

userRoutes.get("/", optionalAuth, getAllUsersController);
userRoutes.get("/:id", optionalAuth, getUserByIdController);

// Admin User Management Routes
userRoutes.post("/", requireAuth, requireRole(["admin"]), createUserController);
userRoutes.post(
  "/:id/ban",
  requireAuth,
  requireRole(["admin"]),
  banUserController,
);

export default userRoutes;
