import { Router } from "express";
import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware";
import {
  createCollectionController,
  fetchCollectionListController,
  getMyCollectionsController,
  getCollectionDetailController,
  updateCollectionController,
  deleteCollectionController,
  addItemToCollectionController,
  removeItemFromCollectionController,
  toggleCollectionStatusController,
  toggleCollectionFeaturedController,
  getCollectionBySlugController,
  getCollectionItemsBySlugController,
  getSavedCollectionsForStockController,
} from "../controllers/collection.controller";

const collectionRoutes = Router();

collectionRoutes.get("/", optionalAuth, fetchCollectionListController);
collectionRoutes.get("/me", requireAuth, getMyCollectionsController);
collectionRoutes.get("/slug/:slug", optionalAuth, getCollectionBySlugController);
collectionRoutes.get("/slug/:slug/items", optionalAuth, getCollectionItemsBySlugController);
collectionRoutes.get("/:id", optionalAuth, getCollectionDetailController);

collectionRoutes.use(requireAuth);

collectionRoutes.get("/check-stock/:stockId", getSavedCollectionsForStockController);
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
