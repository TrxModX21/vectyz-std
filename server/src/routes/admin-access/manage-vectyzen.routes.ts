import { Router } from "express";
import {
  banVectyzenController,
  bulkDeleteVectyzenController,
  deleteVectyzenController,
  getVectyzenListController,
  getVectyzenStatsController,
  promoteVectyzenController,
} from "../../controllers/admin-access/manage-vectyzen.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const manageVectyzenRoutes = Router();

manageVectyzenRoutes.get(
  "/stats",
  requireAuth,
  requireRole(["admin"]),
  getVectyzenStatsController,
);

manageVectyzenRoutes.get(
  "/list",
  requireAuth,
  requireRole(["admin"]),
  getVectyzenListController,
);

manageVectyzenRoutes.patch(
  "/toggle-official/:id",
  requireAuth,
  requireRole(["admin"]),
  promoteVectyzenController,
);

manageVectyzenRoutes.patch(
  "/ban/:id",
  requireAuth,
  requireRole(["admin"]),
  banVectyzenController,
);

manageVectyzenRoutes.delete(
  "/delete/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteVectyzenController,
);

manageVectyzenRoutes.post(
  "/bulk-delete",
  requireAuth,
  requireRole(["admin"]),
  bulkDeleteVectyzenController,
);

export default manageVectyzenRoutes;
