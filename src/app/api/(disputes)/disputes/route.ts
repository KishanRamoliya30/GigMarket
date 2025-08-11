import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Rating from "@/app/models/ratings";
import mongoose from "mongoose";
import Gig from "@/app/models/gig";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Missing userId in query" },
      { status: 400 }
    );
  }

  try {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const disputedRatings = await Rating.find({
      createdBy: objectUserId,
      complaint: { $ne: null },
    })
      .populate({
        path: "gigId",
        model: Gig,
        select: "title description price category images", 
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Dispute records for the user fetched successfully",
      data: disputedRatings,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch user disputes",
      },
      { status: 500 }
    );
  }
}
