import { Router } from "express";
import testRoutes from "./test.routes";
import categoryRoutes from "./category.routes";
import colorRoutes from "./color.routes";
import fileTypeRoutes from "./file-type.routes";
import uploadRoutes from "./upload.routes";
import userRoutes from "./user.routes";
import stockRoutes from "./stock.routes";
import collectionRoutes from "./collection.routes";
import planRoutes from "./plan.routes";
import downloadRoutes from "./download.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

router.use("/categories", categoryRoutes);
router.use("/colors", colorRoutes);
router.use("/file-types", fileTypeRoutes);
router.use("/uploads", uploadRoutes);
router.use("/stocks", stockRoutes);
router.use("/users", userRoutes);
router.use("/collections", collectionRoutes);
router.use("/plans", planRoutes);
router.use("/downloads", downloadRoutes);
router.use("/transactions", transactionRoutes);
router.use("/test", testRoutes);

export default router;
