import { ApiError } from "@/app/lib/commonError";
import dbConnect from "@/app/lib/dbConnect";
import Chat from "@/app/models/chat";
import Message from "@/app/models/message";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();
    const { chatId, sender, message } = body;

    if (!chatId || !sender || !message?.trim()) {
      throw new ApiError("Missing required fields", 400);
    }

    // Create new message
    const newMessage = await Message.create({
      chatId,
      senderId: sender,
      message: message.trim(),
    });

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id,
    });

    // Populate sender details before sending back to client
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "fullName email profilePicture"
    );

    return NextResponse.json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
