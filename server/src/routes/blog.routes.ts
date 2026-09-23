import { Router } from "express";
import { optionalAuth } from "../middlewares/auth.middleware";
import {
  getBlogPostCategoryController,
  getBlogPostDetailController,
  getBlogPostSettingsController,
  getBlogPostsController,
} from "../controllers/blog.controller";

const blogRoutes = Router();

blogRoutes.get("/posts", optionalAuth, getBlogPostsController);
blogRoutes.get("/posts/:slug", optionalAuth, getBlogPostDetailController);
blogRoutes.get("/categories", optionalAuth, getBlogPostCategoryController);
blogRoutes.get("/settings", optionalAuth, getBlogPostSettingsController);

export default blogRoutes;
