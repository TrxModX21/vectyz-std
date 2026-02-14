import { Router } from "express";
import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware";
import {
  createCollectionController,
  fetchCollectionListController,
  getCollectionDetailController,
  updateCollectionController,
  deleteCollectionController,
  addItemToCollectionController,
  removeItemFromCollectionController,
  toggleCollectionStatusController,
  toggleCollectionFeaturedController,
} from "../controllers/collection.controller";

const collectionRoutes = Router();

collectionRoutes.get("/", optionalAuth, fetchCollectionListController);
collectionRoutes.get("/:id", optionalAuth, getCollectionDetailController);

collectionRoutes.use(requireAuth);

collectionRoutes.post("/", createCollectionController);
collectionRoutes.put("/:id", updateCollectionController);
collectionRoutes.patch(
  "/:id/toogle-status",
  requireRole(["admin"]),
  toggleCollectionStatusController,
);
collectionRoutes.patch(
  "/:id/toogle-featured",
  requireRole(["admin"]),
  toggleCollectionFeaturedController,
);
collectionRoutes.delete("/:id", deleteCollectionController);
collectionRoutes.post("/:id/items", addItemToCollectionController);
collectionRoutes.delete(
  "/:id/items/:stockId",
  removeItemFromCollectionController,
);

export default collectionRoutes;
