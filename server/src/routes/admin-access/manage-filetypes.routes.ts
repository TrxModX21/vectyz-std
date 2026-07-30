import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import {
  bulkDeleteFiletypeController,
  changeVisibilityController,
  createFiletypeController,
  deleteFiletypeController,
  getFiletypeListController,
  updateFiletypeController,
} from "../../controllers/admin-access/manage-filetypes.controller";

const manageFiletypesRoutes = Router();

manageFiletypesRoutes.get(
  "/lists",
  requireAuth,
  requireRole(["admin"]),
  getFiletypeListController,
);

manageFiletypesRoutes.post(
  "/create",
  requireAuth,
  requireRole(["admin"]),
  createFiletypeController,
);

manageFiletypesRoutes.patch(
  "/update/:id",
  requireAuth,
  requireRole(["admin"]),
  updateFiletypeController,
);

manageFiletypesRoutes.patch(
  "/change-visibility/:id",
  requireAuth,
  requireRole(["admin"]),
  changeVisibilityController,
);

manageFiletypesRoutes.delete(
  "/delete/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteFiletypeController,
);

manageFiletypesRoutes.post(
  "/bulk-delete",
  requireAuth,
  requireRole(["admin"]),
  bulkDeleteFiletypeController,
);

export default manageFiletypesRoutes;
