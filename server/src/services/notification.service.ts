import { getIO } from "../socket";
import { sendEmail } from "../mailers/mailer";
import { notificationTemplate } from "../mailers/templates/template";
import { NotificationType } from "../generated/prisma/client";
import prisma from "../lib/prisma";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  sourceUserId?: string;
  stockId?: string;
  recipientEmail?: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
  const { userId, type, title, message, sourceUserId, stockId, recipientEmail } = params;

  // 1. Save to database
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      sourceUserId,
      stockId,
    },
    include: {
      sourceUser: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        },
      },
    },
  });

  // 2. Emit Realtime Event to User's room
  try {
    const io = getIO();
    io.to(userId).emit("new-notification", notification);
  } catch (error) {
    console.error("Socket emit failed:", error);
  }

  // 3. Send Email
  if (recipientEmail) {
    const emailData = notificationTemplate(title, message);
    sendEmail({
      to: recipientEmail,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    }).catch((err) => console.error("Email notification failed:", err));
  }

  return notification;
};

export const getUnreadCount = async (userId: string) => {
  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
  return count;
};

export const getUserNotifications = async (userId: string, limit = 10, cursor?: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    take: limit + 1,
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sourceUser: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
    },
  });

  let nextCursor: string | undefined = undefined;
  if (notifications.length > limit) {
    const nextItem = notifications.pop();
    nextCursor = nextItem!.id;
  }

  return {
    notifications,
    nextCursor,
  };
};

export const markAsRead = async (userId: string, notificationId: string) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};
