import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Bid from "@/app/models/bid";
import Profile from "@/app/models/profile";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
): Promise<NextResponse> {
  await dbConnect();
  const userDetails = await verifyToken(req);

  if (!userDetails?.userId || !userDetails?.role) {
    throw new ApiError('Unauthorized request', 401);
  }
  const gigId = (await params).gigId;
  if (!gigId) {
    throw new ApiError("Gig ID is required", 400);
  }
  const gig = await Gig.findOne({
    _id: gigId,
    createdBy: userDetails.userId,
  }).populate({
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

  const bids = await Bid.countDocuments({
    gigId: gig._id,
  });
  return successResponse(
    {
      ...gig.toObject(),
      bids,
      createdBy: profile.toObject(),
    },
    "Gig retrieved successfully"
  );
}
