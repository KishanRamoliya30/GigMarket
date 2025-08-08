import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import dbConnect from "@/app/lib/dbConnect";
import Chat from "@/app/models/chat";
import Message from "@/app/models/message";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    await dbConnect();

    const body = await req.json();
    const { chatId, sender, message } = body;

    if (!chatId || !sender || !message?.trim()) {
        throw new ApiError("Missing required fields", 400);
    }

    // Create new message
    const newMessage = await Message.create({
        chatId,
        sender,
        message: message.trim(),
    });

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, {
        lastMessage: newMessage._id,
    });

    // Populate sender details before sending back to client
    // const populatedMessage = await Message.findById(newMessage._id).populate(
    //     "sender",
    //     "fullName email profilePicture"
    // );

    const populatedMessage = await Message.findById(newMessage._id)
        .populate({
            path: "sender",
            select: "email",
            populate: {
                path: "profile",
                model: "profiles",
                select: "fullName profilePicture"
            }
        });

    return successResponse(populatedMessage, "Chat updated successfully", 200);

};
