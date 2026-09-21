import { Router } from "express";
import { requireAuth, requireRole } from "../../../middlewares/auth.middleware";
import {
  createBlogPostController,
  deleteBlogPostController,
  getBlogPostByIdController,
  getBlogPostsController,
  updateBlogPostController,
} from "../../../controllers/admin-access/manage-blog/posts.controller";

const manageBlogPostsRoutes = Router();
// Terapkan perlindungan Auth
manageBlogPostsRoutes.use(requireAuth, requireRole(["admin"]));

manageBlogPostsRoutes.get("/posts", getBlogPostsController);
manageBlogPostsRoutes.get("/posts/:id", getBlogPostByIdController);
manageBlogPostsRoutes.post("/posts", createBlogPostController);
manageBlogPostsRoutes.patch("/posts/:id", updateBlogPostController);
manageBlogPostsRoutes.delete("/posts/:id", deleteBlogPostController);

export default manageBlogPostsRoutes;
