import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Notification, { INotification } from "@/app/models/notification";
import { successResponse } from "@/app/lib/commonHandlers";
import { FilterQuery } from "mongoose";
import { verifyToken } from "@/app/utils/jwt";
import { Server as IOServer } from "socket.io";

// Extend global to include io
declare global {
  var io: IOServer | undefined;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const userDetails = await verifyToken(req);

  if (!userDetails?.userId) {
    return successResponse([], "User not authenticated", 401);
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const isRead = searchParams.get("isRead");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const query: FilterQuery<INotification> = {};

  query.userId = userDetails.userId;

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
    Notification.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId: userDetails.userId, isRead: false }),
  ]);

  return successResponse(
    {
      notifications,
      unreadCount,
    },
    "Notifications fetched successfully",
    200,
    {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const userDetails = await verifyToken(req);

  if (!userDetails?.userId) {
    return successResponse([], "User not authenticated", 401);
  }

  try {
    const body = await req.json();
    const { title, message, link, userId } = body;

    if (!title || !message) {
      return successResponse([], "Title and message are required", 400);
    }

    const notification = await Notification.create({
      userId: userId,
      title,
      message,
      link,
      isRead: false,
    });

    // Emit socket event for real-time notification
    if (global.io) {
      global.io.to(userId).emit("new-notification", notification);
    }

    return successResponse(
      notification,
      "Notification created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return successResponse([], "Failed to create notification", 500);
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  const userDetails = await verifyToken(req);

  if (!userDetails?.userId) {
    return successResponse([], "User not authenticated", 401);
  }

  try {
    const { searchParams } = new URL(req.url);
    const markAll = searchParams.get("markAll");
    const notificationId = searchParams.get("id");

    // Handle mark all as read
    if (markAll === "true") {
      const result = await Notification.updateMany(
        { userId: userDetails.userId, isRead: false },
        { isRead: true }
      );

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

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userDetails.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return successResponse([], "Notification not found or unauthorized", 404);
    }

    return successResponse(notification, "Notification updated successfully", 200);
  } catch (error) {
    console.error("Error updating notification:", error);
    return successResponse([], "Failed to update notification", 500);
  }
}

