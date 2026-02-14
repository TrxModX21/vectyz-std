import { Router } from "express";
import {
  allColorsController,
  createColorController,
  deleteColorController,
  updateColorController,
} from "../controllers/color.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const colorRoutes = Router();

colorRoutes.get("/", allColorsController);
colorRoutes.post("/", requireAuth, requireRole(["admin"]), createColorController);
colorRoutes.put("/:id", requireAuth, requireRole(["admin"]), updateColorController);
colorRoutes.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteColorController
);

export default colorRoutes;
