import { Router } from "express";
import {
  allCategoriesController,
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
  updateCategoryStatusController,
} from "../controllers/category.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const categoryRoutes = Router();

categoryRoutes.get("/", allCategoriesController);
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
