import { Router } from "express";
import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware";
import {
  planDetailController,
  allPlanController,
  createPlanController,
  updatePlanController,
  deletePlanController,
} from "../controllers/plan.controller";

const router = Router();

router.get("/", optionalAuth, allPlanController);
router.get("/:id", optionalAuth, planDetailController);
router.post("/", requireAuth, requireRole(["admin"]), createPlanController);
router.put("/:id", requireAuth, requireRole(["admin"]), updatePlanController);
router.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  deletePlanController,
);

export default router;
