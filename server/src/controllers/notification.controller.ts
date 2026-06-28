import { Request, Response } from "express";

import * as notificationService from "../services/notification.service";
import { HTTPSTATUS } from "../utils/http.config";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export const getNotificationsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const cursor = req.query.cursor as string | undefined;

    const result = await notificationService.getUserNotifications(
      user.id,
      limit,
      cursor,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Notifications fetched successfully",
      timestamp: new Date().toISOString(),
      ...result,
    });
  },
);

export const getUnreadCountHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    const count = await notificationService.getUnreadCount(user.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Unread count fetched",
      timestamp: new Date().toISOString(),
      count,
    });
  },
);

export const markAsReadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    const { id } = req.params;

    await notificationService.markAsRead(user.id, id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Notification marked as read",
    });
  },
);

export const markAllAsReadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    await notificationService.markAllAsRead(user.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "All notifications marked as read",
      timestamp: new Date().toISOString(),
    });
  },
);
