import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig, { statusList } from "@/app/models/gig";
import Bid from "@/app/models/bid";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import { Types } from "mongoose";
import Rating from "@/app/models/ratings";

type GigType = typeof Gig extends import("mongoose").Model<infer T> ? T : never;

type EnrichedGig = Omit<GigType, "createdBy"> & {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  providerName: string;
};

type StatusType = typeof statusList[number];

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  if (!userDetails?.userId) throw new ApiError("Unauthorized", 401);

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  const filterStatus = searchParams.get("status");
  const role = userDetails.role as "User" | "Provider";

  const User = (await import("@/app/models/user")).default;

  let gigs: GigType[] = [];
  let totalCount = 0;
  let baseQuery: Record<string, unknown> = {};

  if (role === "Provider") {
    const userBids = await Bid.find({ createdBy: userDetails.userId }).lean();
    const gigIds = [...new Set(userBids.map((bid) => bid.gigId.toString()))];

    if (gigIds.length === 0) {
      return successResponse(
        {
          gigs: [],
          page,
          limit,
          totalPages: 0,
          totalCount: 0,
          statusCounts: Object.fromEntries(statusList.map((s) => [s, 0])) as Record<StatusType, number>,
        },
        "No gigs found for placed bids"
      );
    }

    baseQuery = {
      _id: { $in: gigIds.map((id) => new Types.ObjectId(id as string)) },
    };
  } else if (role === "User") {
    baseQuery = {
      createdBy: new Types.ObjectId(userDetails.userId as string),
    };
  } else {
    throw new ApiError("Invalid user", 400);
  }

  const query = { ...baseQuery };
  if (filterStatus) query.status = filterStatus;

  totalCount = await Gig.countDocuments(query);
  gigs = await Gig.find(query).populate('assignedToBid').skip(skip).limit(limit).lean();

  const statusCounts: Record<StatusType, number> = Object.fromEntries(
    await Promise.all(
      statusList.map(async (status) => {
        const count = await Gig.countDocuments({ ...baseQuery, status });
        return [status, count];
      })
    )
  ) as Record<StatusType, number>;

  const enrichedGigs: EnrichedGig[] = await Promise.all(
    gigs.map(async (gig) => {
      if(gig.assignedToBid?.createdBy){
        const provider = await User.findById(gig.assignedToBid?.createdBy);
        const ratings = await Rating.find({ gigId: gig._id });
        const totalRatings = ratings.length;
        const averageRating =
          totalRatings > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            : 0;
        return {
          ...gig,
          providerName: provider ? `${provider.firstName} ${provider.lastName}` : "",
          rating: parseFloat(averageRating.toFixed(1)),
          reviews: totalRatings,
          
        };
      }
      else{
        return {
          ...gig,
          providerName: "",
          rating: 0,
          reviews: 0,
        }
      }
      
    })
  );

  return successResponse(
    {
      gigs: enrichedGigs,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      statusCounts,
    },
    "Gigs fetched successfully"
  );
});
