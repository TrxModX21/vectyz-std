import { Router } from "express";
import {
  allCategoriesController,
  createCategoryController,
  deleteCategoryController,
  getCategoryFromFileTypeController,
  updateCategoryController,
  updateCategoryStatusController,
} from "../controllers/category.controller";
import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware";

const categoryRoutes = Router();

categoryRoutes.get("/", optionalAuth, allCategoriesController);
categoryRoutes.get("/:slug", optionalAuth, getCategoryFromFileTypeController);
categoryRoutes.post(
  "/",
  requireAuth,
  requireRole(["admin"]),
  createCategoryController,
);
categoryRoutes.put(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  updateCategoryController,
);
categoryRoutes.patch(
  "/:id/status",
  requireAuth,
  requireRole(["admin"]),
  updateCategoryStatusController,
);
categoryRoutes.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteCategoryController,
);

export default categoryRoutes;
