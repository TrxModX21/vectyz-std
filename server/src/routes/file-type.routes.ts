import { Router } from "express";
import {
  allFileTypesController,
  createFileTypeController,
  deleteFileTypeController,
  updateFileTypeController,
} from "../controllers/file-type.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const fileTypeRoutes = Router();

fileTypeRoutes.get("/", allFileTypesController);
fileTypeRoutes.post(
  "/",
  requireAuth,
  requireRole(["admin"]),
  createFileTypeController
);
fileTypeRoutes.put(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  updateFileTypeController
);
fileTypeRoutes.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteFileTypeController
);

export default fileTypeRoutes;
