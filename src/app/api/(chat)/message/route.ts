import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import dbConnect from "@/app/lib/dbConnect";
import Chat from "@/app/models/chat";
import Message, { MediaFile } from "@/app/models/message";
import { uploadToCloudinary } from "@/lib/cloudinaryFileUpload";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    await dbConnect();

    const formData = await req.formData();

    const chatId = formData.get("chatId")?.toString();
    const sender = formData.get("sender")?.toString();
    const message = formData.get("message")?.toString() || "";
    const files = formData.getAll("files") as File[];

    const amount = formData.get("amount") ? Number(formData.get("amount")) : undefined;
    const description = formData.get("description")?.toString();
    const amountType = formData.get("amountType")?.toString();
    const gigId = formData.get("gigId")?.toString();

    if (!chatId || !sender || (!message.trim() && files.length === 0)) {
        throw new ApiError("Missing required fields", 400);
    }

    let paymentRequest;
    if (amount !== undefined || amountType || gigId) {
        if (!amount || amount <= 0) {
            throw new ApiError("Payment amount must be greater than 0", 400);
        }
        if (!amountType) {
            throw new ApiError("Amount type is required", 400);
        }
        if (!gigId) {
            throw new ApiError("Gig ID is required for payment requests", 400);
        }

        paymentRequest = {
            amount,
            description,
            amountType,
            status: "Pending" as const,
            gigId,
        };
    }

    let mediaFiles: MediaFile[] = [];

    if (files && files.length > 0) {
        mediaFiles = await Promise.all(
            files.map(async (file) => {
                const url = await uploadToCloudinary(file, { folder: "chat_media" });
                return {
                    url,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                };
            })
        );
    }

    const newMessage = await Message.create({
        chatId,
        sender,
        message: message.trim(),
        mediaFiles,
        paymentRequest,
    });

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, {
        lastMessage: newMessage._id,
    });

    // Populate sender details
    const populatedMessage = await Message.findById(newMessage._id).populate({
        path: "sender",
        select: "email",
        populate: {
            path: "profile",
            model: "profiles",
            select: "fullName profilePicture",
        },
    });

    return successResponse(populatedMessage, "Chat updated successfully", 200);

};

export const PATCH = async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();
  const { messageId, ...updateData } = body;

  if (!messageId) {
    throw new ApiError("Message ID is required", 400);
  }

  const existingMessage = await Message.findById(messageId);
  if (!existingMessage) {
    throw new ApiError("Message not found", 404);
  }

  // If paymentRequest exists and is being updated, validate its fields
  if (updateData.paymentRequest) {
    const { status, amount } = updateData.paymentRequest;

    if (status && !["Pending", "Approved", "Rejected"].includes(status)) {
      throw new ApiError("Invalid status value for payment request", 400);
    }

    if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
      throw new ApiError("Payment amount must be greater than 0", 400);
    }
  }

  // Update only provided fields
  Object.entries(updateData).forEach(([key, value]) => {
    (existingMessage)[key] = value;
  });

  await existingMessage.save();

  // Populate sender details
  const populatedMessage = await Message.findById(messageId).populate({
    path: "sender",
    select: "email",
    populate: {
      path: "profile",
      model: "profiles",
      select: "fullName profilePicture",
    },
  });

  return successResponse(populatedMessage, "Message updated successfully", 200);
};

