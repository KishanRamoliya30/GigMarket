import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Rating from "@/app/models/ratings";
import Bid from "@/app/models/bid";
import { verifyToken } from "@/app/utils/jwt";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { Types } from "mongoose";

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  if (!userDetails?.userId) throw new ApiError("Unauthorized", 401);

  const role = userDetails.role as "User" | "Provider";

  // Parse pagination parameters
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  let gigIds: Types.ObjectId[] = [];

  if (role === "Provider") {
    const userBids = await Bid.find({ createdBy: userDetails.userId }).lean();
    gigIds = [...new Set(userBids.map((bid) => bid.gigId))].map(id => new Types.ObjectId(id));
  } else if (role === "User") {
    const userGigs = await Gig.find({ createdBy: userDetails.userId }).lean();
    gigIds = userGigs.map((gig) => gig._id as Types.ObjectId);
  } else {
    throw new ApiError("Invalid user role", 400);
  }

  const ratings = await Rating.find({ gigId: { $in: gigIds } }).lean();

  const ratingMap: Record<string, number[]> = {};
  ratings.forEach(rating => {
    const gid = rating.gigId.toString();
    if (!ratingMap[gid]) ratingMap[gid] = [];
    ratingMap[gid].push(rating.rating);
  });

  const disputedGigIds = Object.entries(ratingMap)
    .filter(([_, ratings]) => {
      const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      return avg < 3;
    })
    .map(([id]) => new Types.ObjectId(id));

  if (disputedGigIds.length === 0) {
    return successResponse({ gigs: [], page, limit, total: 0 }, "No disputed gigs found");
  }

  const total = disputedGigIds.length;

  const gigs = await Gig.find({ _id: { $in: disputedGigIds } })
    .skip(skip)
    .limit(limit)
    .lean();

  const User = (await import("@/app/models/user")).default;

  const enrichedGigs = await Promise.all(
    gigs.map(async (gig) => {
      const ratings = await Rating.find({ gigId: gig._id }).lean();
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

      const user = await User.findById(gig.createdBy);
      return {
        ...gig,
        userId: user?._id,
        userName: user ? `${user.firstName} ${user.lastName}` : "",
        rating: parseFloat(averageRating.toFixed(1)),
        reviews: totalRatings,
        ratings,
      };
    })
  );

  return successResponse(
    {
      gigs: enrichedGigs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    "Disputed gigs fetched successfully"
  );
});
