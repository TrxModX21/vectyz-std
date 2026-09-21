import { Router } from "express";
import { requireAuth, requireRole } from "../../../middlewares/auth.middleware";
import {
  createBlogCategoryController,
  createBlogTagController,
  deleteBlogCategoryController,
  deleteBlogTagController,
  getBlogCategoriesController,
  getBlogTagsController,
  updateBlogCategoryController,
  updateBlogTagController,
} from "../../../controllers/admin-access/manage-blog/taxonomy.controller";

const manageBlogTaxonomyRoutes = Router();
// Terapkan perlindungan Auth
manageBlogTaxonomyRoutes.use(requireAuth, requireRole(["admin"]));

// --- CATEGORY ROUTES ---
manageBlogTaxonomyRoutes.get("/categories", getBlogCategoriesController);
manageBlogTaxonomyRoutes.post("/categories", createBlogCategoryController);
manageBlogTaxonomyRoutes.patch("/categories/:id", updateBlogCategoryController);
manageBlogTaxonomyRoutes.delete(
  "/categories/:id",
  deleteBlogCategoryController,
);

// --- TAG ROUTES ---
manageBlogTaxonomyRoutes.get("/tags", getBlogTagsController);
manageBlogTaxonomyRoutes.post("/tags", createBlogTagController);
manageBlogTaxonomyRoutes.patch("/tags/:id", updateBlogTagController);
manageBlogTaxonomyRoutes.delete("/tags/:id", deleteBlogTagController);

export default manageBlogTaxonomyRoutes;
