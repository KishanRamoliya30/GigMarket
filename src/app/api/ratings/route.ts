import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Rating from "@/app/models/ratings";
import Bid from "@/app/models/bid";;
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import { Types } from "mongoose";

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  const role = userDetails.role as "User" | "Provider";
  const userId = userDetails.userId;

  if (!userId) throw new ApiError("Unauthorized", 401);

  let ratings = [];

  if (role === "User") {
    ratings = await Rating.find({
      createdBy: new Types.ObjectId(userId),
      complaint: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .lean();
  } else if (role === "Provider") {
    // Get all gigIds where provider has placed bids
    const providerBids = await Bid.find({ createdBy: new Types.ObjectId(userId) }, { gigId: 1 }).lean();
    const gigIds = [...new Set(providerBids.map((bid) => bid.gigId.toString()))];

    if (gigIds.length === 0) {
      return successResponse(
        {
          disputes: [],
        },
        "No disputes found"
      );
    }

    // Get ratings with complaints for gigs where ratings < 3
    ratings = await Rating.find({
      gigId: { $in: gigIds.map((id) => new Types.ObjectId(id)) },
      complaint: { $ne: null },
      rating: { $lt: 3 },
    })
      .sort({ createdAt: -1 })
      .lean();
  } else {
    throw new ApiError("Invalid role", 400);
  }

  return successResponse(
    {
      disputes: ratings,
    },
    "Disputes fetched successfully"
  );
});
