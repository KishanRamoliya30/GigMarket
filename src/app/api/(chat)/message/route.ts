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

    if (!chatId || !sender || ((!message.trim() && files.length === 0) && files.length <= 0)) {
        throw new ApiError("Missing required fields", 400);
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
