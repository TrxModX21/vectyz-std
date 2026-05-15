import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getMyStockController } from "../controllers/user-stock.controller";

const userStocksRoutes = Router();

userStocksRoutes.get("/", requireAuth, getMyStockController);

export default userStocksRoutes;
