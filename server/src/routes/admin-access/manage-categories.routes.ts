import { Router } from "express";
import {
  changeCategoryVisibilityController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  bulkDeleteCategoryController,
  getCategoriesListController,
} from "../../controllers/admin-access/manage-categories.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const manageCategoriesRoutes = Router();

manageCategoriesRoutes.get(
  "/lists",
  requireAuth,
  requireRole(["admin"]),
  getCategoriesListController,
);

manageCategoriesRoutes.post(
  "/create",
  requireAuth,
  requireRole(["admin"]),
  createCategoryController,
);

manageCategoriesRoutes.patch(
  "/update/:id",
  requireAuth,
  requireRole(["admin"]),
  updateCategoryController,
);

manageCategoriesRoutes.patch(
  "/change-visibility/:id",
  requireAuth,
  requireRole(["admin"]),
  changeCategoryVisibilityController,
);

manageCategoriesRoutes.delete(
  "/delete/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteCategoryController,
);

manageCategoriesRoutes.post(
  "/bulk-delete",
  requireAuth,
  requireRole(["admin"]),
  bulkDeleteCategoryController,
);

export default manageCategoriesRoutes;
