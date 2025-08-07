import { ApiError } from "@/app/lib/commonError";
import dbConnect from "@/app/lib/dbConnect";
import Chat from "@/app/models/chat";
import Message from "@/app/models/message";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const gigId = searchParams.get("gigId");
    const user1Id = searchParams.get("user1");
    const user2Id = searchParams.get("user2");

    if (!gigId || !user1Id || !user2Id) {
      throw new ApiError("Missing required parameters", 400);
    }

    // Find or create chat
    let chat = await Chat.findOne({
      gigId,
      participants: { $all: [user1Id, user2Id] },
    })
      .populate("participants", "fullName email profilePicture")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "fullName email profilePicture",
        },
      });

    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = await Chat.create({
        gigId,
        participants: [user1Id, user2Id],
      });
    }

    const messages = await Message.find({ chatId: chat._id })
      .populate("senderId", "fullName email profilePicture")
      .sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: {
        chat,
        messages,
      },
    });
  } catch (error) {
    console.error("Error in fetch chat", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
};
