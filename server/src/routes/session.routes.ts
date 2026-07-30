import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getMySessionController } from "../controllers/session.controller";

const sessionRoutes = Router();

sessionRoutes.get("/me", requireAuth, getMySessionController);

export default sessionRoutes;
