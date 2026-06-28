import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  getNotificationsHandler,
  getUnreadCountHandler,
  markAllAsReadHandler,
  markAsReadHandler,
} from "../controllers/notification.controller";

const notificationRoutes = Router();

// Semua rute notifikasi butuh login
notificationRoutes.use(requireAuth);

notificationRoutes.get("/", getNotificationsHandler);
notificationRoutes.get("/unread-count", getUnreadCountHandler);
notificationRoutes.patch("/read-all", markAllAsReadHandler);
notificationRoutes.patch("/:id/read", markAsReadHandler);

export default notificationRoutes;
