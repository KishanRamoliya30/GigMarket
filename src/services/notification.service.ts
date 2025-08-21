import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import NotificationModel, { INotification } from "@/app/models/notification";
import { FilterQuery } from "mongoose";
import { verifyToken } from "@/app/utils/jwt";

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  link?: string;
  receiverId: string;
  senderId: string;
}

export interface NotificationResponse {
  notifications: INotification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateResult {
  modifiedCount: number;
  notification?: INotification;
}

export class NotificationService {
  static async getNotifications(
    req: NextRequest
  ): Promise<NotificationResponse> {
    await dbConnect();

    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new Error("User not authenticated");
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isRead = searchParams.get("isRead");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const query: FilterQuery<INotification> = {};
    query.receiverId = userDetails.userId;

    if (isRead !== null && isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      createdAt: { createdAt: sortOrder === "desc" ? -1 : 1 },
      updatedAt: { updatedAt: sortOrder === "desc" ? -1 : 1 },
      title: { title: sortOrder === "desc" ? -1 : 1 },
      isRead: { isRead: sortOrder === "desc" ? -1 : 1 },
    };

    const sortOption = sortOptions[sortBy] || { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean<INotification[]>(),
      NotificationModel.countDocuments(query),
      NotificationModel.countDocuments({
        receiverId: userDetails.userId,
        isRead: false,
      }),
    ]);

    return {
      notifications: notifications as INotification[],
      unreadCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async createNotificationWithAuth(
    body: CreateNotificationData
  ): Promise<INotification> {
    await dbConnect();

    const { title, message, link, receiverId, senderId } = body;

    if (!title || !message) {
      throw new Error("Title and message are required");
    }

    const notification = await NotificationModel.create({
      receiverId: receiverId,
      senderId: senderId,
      title: title,
      message: message,
      link: link,
      isRead: false,
    });

    return notification
  }

  static async markAllAsRead(req: NextRequest): Promise<UpdateResult> {
    await dbConnect();

    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new Error("User not authenticated");
    }

    const result = await NotificationModel.updateMany(
      { receiverId: userDetails.userId, isRead: false },
      { isRead: true }
    );

    return { modifiedCount: result.modifiedCount };
  }

  static async markAsRead(
    req: NextRequest,
    notificationId: string
  ): Promise<UpdateResult> {
    await dbConnect();

    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new Error("User not authenticated");
    }

    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, receiverId: userDetails.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error("Notification not found or unauthorized");
    }

    return { notification, modifiedCount: 1 };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await dbConnect();

    return NotificationModel.countDocuments({
      receiverId: userId,
      isRead: false,
    });
  }

  static async getNotificationById(
    req: NextRequest,
    notificationId: string
  ): Promise<INotification | null> {
    await dbConnect();

    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new Error("User not authenticated");
    }

    return NotificationModel.findOne({
      _id: notificationId,
      receiverId: userDetails.userId,
    }).lean<INotification | null>();
  }

  static async deleteNotification(
    req: NextRequest,
    notificationId: string
  ): Promise<boolean> {
    await dbConnect();

    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new Error("User not authenticated");
    }

    const result = await NotificationModel.deleteOne({
      _id: notificationId,
      receiverId: userDetails.userId,
    });

    return result.deletedCount > 0;
  }

  static async createBulkNotifications(
    notifications: CreateNotificationData[]
  ): Promise<INotification[]> {
    await dbConnect();

    if (!notifications || notifications.length === 0) {
      throw new Error("Notifications array is required");
    }

    const validNotifications = notifications.filter(
      (n) => n.title && n.message && n.receiverId
    );

    if (validNotifications.length === 0) {
      throw new Error("At least one valid notification is required");
    }

    return NotificationModel.insertMany(
      validNotifications.map((n) => ({
        ...n,
        isRead: false,
      }))
    );
  }

  static async getUserNotifications(
    userId: string,
    filters: NotificationFilters = {}
  ): Promise<NotificationResponse> {
    await dbConnect();

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";

    const query: FilterQuery<INotification> = { receiverId: userId };

    if (filters.isRead !== undefined) {
      query.isRead = filters.isRead;
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      createdAt: { createdAt: sortOrder === "desc" ? -1 : 1 },
      updatedAt: { updatedAt: sortOrder === "desc" ? -1 : 1 },
      title: { title: sortOrder === "desc" ? -1 : 1 },
      isRead: { isRead: sortOrder === "desc" ? -1 : 1 },
    };

    const sortOption = sortOptions[sortBy] || { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean<INotification[]>(),
      NotificationModel.countDocuments(query),
      NotificationModel.countDocuments({
        receiverId: userId,
        isRead: false,
      }),
    ]);

    return {
      notifications: notifications as INotification[],
      unreadCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

// Export instance methods for convenience
export const notificationService = {
  getNotifications: NotificationService.getNotifications,
  createNotificationWithAuth: NotificationService.createNotificationWithAuth,
  markAllAsRead: NotificationService.markAllAsRead,
  markAsRead: NotificationService.markAsRead,
  getUnreadCount: NotificationService.getUnreadCount,
  getNotificationById: NotificationService.getNotificationById,
  deleteNotification: NotificationService.deleteNotification,
  createBulkNotifications: NotificationService.createBulkNotifications,
  getUserNotifications: NotificationService.getUserNotifications,
};

export default NotificationService;
