import { NextRequest } from "next/server";
import { successResponse } from "@/app/lib/commonHandlers";
import { NotificationService } from "@/services/notification.service";
import { verifyToken } from "@/app/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const result = await NotificationService.getNotifications(req);

    return successResponse(
      {
        notifications: result.notifications,
        unreadCount: result.unreadCount,
      },
      "Notifications fetched successfully",
      200,
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }
    );
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not authenticated") {
      return successResponse([], "User not authenticated", 401);
    }
    console.error("Error fetching notifications:", err);
    return successResponse([], "Failed to fetch notifications", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new Error("User not authenticated");
    }

    const body = await req.json();
    const notification =
      await NotificationService.createNotificationWithAuth(body);

    const unreadCount = await NotificationService.getUnreadCount(
      body.receiverId
    );

    return successResponse(
      { notification, unreadCount },
      "Notification created successfully",
      201
    );
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not authenticated") {
      return successResponse([], "User not authenticated", 401);
    }
    if (err.message === "Title and message are required") {
      return successResponse([], "Title and message are required", 400);
    }
    console.error("Error creating notification:", error);
    return successResponse([], "Failed to create notification", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const markAll = searchParams.get("markAll");
    const notificationId = searchParams.get("id");

    // Handle mark all as read
    if (markAll === "true") {
      const result = await NotificationService.markAllAsRead(req);
      return successResponse(
        { modifiedCount: result.modifiedCount },
        `${result.modifiedCount} notifications marked as read`,
        200
      );
    }

    // Handle mark single notification as read
    if (!notificationId) {
      return successResponse([], "Notification ID is required", 400);
    }

    const result = await NotificationService.markAsRead(req, notificationId);
    return successResponse(
      result.notification,
      "Notification updated successfully",
      200
    );
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not authenticated") {
      return successResponse([], "User not authenticated", 401);
    }
    if (err.message === "Notification ID is required") {
      return successResponse([], "Notification ID is required", 400);
    }
    if (err.message === "Notification not found or unauthorized") {
      return successResponse([], "Notification not found or unauthorized", 404);
    }
    console.error("Error updating notification:", err);
    return successResponse([], "Failed to update notification", 500);
  }
}
