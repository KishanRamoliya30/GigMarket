import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Profile from "@/app/models/profile";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";

export async function GET(
  req: NextRequest,
 { params }: { params: Promise<{ gigId: string }> }
): Promise<NextResponse> {
  await dbConnect();
  const gigId = (await params).gigId
  if (!gigId) {
    throw new ApiError("Gig ID is required", 400);
  }
  const gig = await Gig.findById(gigId).populate({
    path: "createdBy",
    model: "users",
    select: "email",
  });
  if (!gig) {
    throw new ApiError("Gig not found", 404);
  }

  const profile = await Profile.findOne({
    userId: gig.createdBy._id.toString(),
  }).select("fullName pastEducation profilePicture userId");

  return successResponse(
    {
        gig : {
            ...gig.toObject(),
            createdBy: profile.toObject(),
          }
    },
    "Gig retrieved successfully"
  );
}
