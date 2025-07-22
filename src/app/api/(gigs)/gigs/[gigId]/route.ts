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
  const gigId = (await params).gigId;
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

  const bids = await Bid.countDocuments({
    gigId: gig._id,
  });
  const userHeader = req.headers.get("x-user");
  let userBids = null;
  if (userHeader) {
    const userDetails = JSON.parse(userHeader);
    //find Bid for this gig by thi user
    userBids = await Bid.findOne({
      gigId: gig._id,
      createdBy: userDetails._id,
    }).select("bidAmount description status createdAt");
  }
  return successResponse(
    {
      gig: {
        ...gig.toObject(),
        bids,
        bid: userBids ? userBids.toObject() : null,
        createdBy: profile.toObject(),
      },
    },
    "Gig retrieved successfully"
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
): Promise<NextResponse> {
  await dbConnect();

  const user = await verifyToken(req);
  if (!user?.userId)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const gigId = (await params).gigId;
  if (!gigId) {
    throw new ApiError("Gig ID is required", 400);
  }
  console.log("###52", user);

  const gig = await Gig.findById(gigId).populate({
    path: "createdBy",
    model: "users",
    select: "email",
  });

  if (!gig) {
    throw new ApiError("Gig not found", 404);
  }

  if (user.role !== "Admin") {
    if (gig.createdBy._id.toString() !== user.userId.toString()) {
      return NextResponse.json(
        { error: "This User is not authorized to delete gig" },
        { status: 401 }
      );
    }
  }
  await Gig.deleteOne({ _id: gigId });

  return successResponse(null, "Gig deleted successfully");
}
