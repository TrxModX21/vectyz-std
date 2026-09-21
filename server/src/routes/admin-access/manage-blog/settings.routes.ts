import { Router } from "express";
import {
  getBlogSettingsController,
  updateBlogSettingsController,
} from "../../../controllers/admin-access/manage-blog/settings.controller";
import { requireAuth, requireRole } from "../../../middlewares/auth.middleware";

const manageBlogSettingsRoutes = Router();

manageBlogSettingsRoutes.get(
  "/settings",
  requireAuth,
  requireRole(["admin"]),
  getBlogSettingsController,
);

manageBlogSettingsRoutes.patch(
  "/settings",
  requireAuth,
  requireRole(["admin"]),
  updateBlogSettingsController,
);

export default manageBlogSettingsRoutes;
