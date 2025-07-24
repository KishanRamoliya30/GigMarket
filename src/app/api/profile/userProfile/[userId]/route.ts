import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Profile from "@/app/models/profile";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  await dbConnect();

  const userId = (await params).userId;
  if (!userId) {
    throw new ApiError("Missing or invalid userId in query.", 400);
  }

  const profile = await Profile.findOne({
    userId: new mongoose.Types.ObjectId(userId.toString()),
  });

  if (!profile) {
    throw new ApiError("Profile not found", 404);
  }
  return successResponse(profile, "Profile retrieved successfully");
}
