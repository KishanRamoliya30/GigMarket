import { ApiError } from "@/app/lib/commonError";
import dbConnect from "@/app/lib/dbConnect";
import Chat from "@/app/models/chat";
import Message from "@/app/models/message";
import "@/app/models/gig";
import "@/app/models/user";
import "@/app/models/profile";
import "@/app/models/message";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/app/lib/commonHandlers";

export const GET = async (req: NextRequest) => {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);

        const gigId = searchParams.get("gigId");
        const user1Id = searchParams.get("user1");
        const user2Id = searchParams.get("user2");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        if (!gigId || !user1Id || !user2Id) {
            throw new ApiError("Missing required parameters", 400);
        }

        // Find or create chat
        let chat = await Chat.findOne({
            gigId,
            participants: { $all: [user1Id, user2Id] },
        })
            .populate({
                path: "gigId",
                model: "gigs",
                select: "title description createdBy"
            })
            .populate({
                path: "participants",
                populate: {
                    path: "profile",
                    model: "profiles",
                    select: "fullName profilePicture",
                },
                select: "email"
            })
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    populate: {
                        path: "profile",
                        select: "fullName profilePicture",
                    },
                    select: "email"
                },
            });

        // If no chat, create it
        if (!chat) {
            chat = await Chat.create({
                gigId,
                participants: [user1Id, user2Id],
            });
        }

        const [messages, total] = await Promise.all([
            Message.find({ chatId: chat._id })
                .populate({
                    path: "sender",
                    populate: {
                        path: "profile",
                        select: "fullName profilePicture",
                    },
                    select: "email"
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Message.countDocuments({ chatId: chat._id }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return successResponse(
            {
                chat,
                messages,
            },
            "Chat fetched successfully",
            200,
            {
                total,
                page,
                limit,
                totalPages,
            });
    } catch (error) {
        return errorResponse(error, 500);
    }
};
