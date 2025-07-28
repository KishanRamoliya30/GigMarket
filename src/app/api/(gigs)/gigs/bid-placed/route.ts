import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Bid from "@/app/models/bid";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  if (!userDetails?.userId) {
    throw new ApiError("Unauthorized", 401);
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const User = (await import("@/app/models/user")).default;

  // Step 1: Get all bids by the user
  const userBids = await Bid.find({ createdBy: userDetails.userId }).lean();

  if (userBids.length === 0) {
    return successResponse([], "No gigs found for placed bids");
  }

  // Step 2: Extract unique gig IDs
  const gigIds = [...new Set(userBids.map(bid => bid.gigId.toString()))];

  // Step 3: Get total count before paginating
  const totalCount = await Gig.countDocuments({ _id: { $in: gigIds } });

  // Step 4: Apply pagination
  const gigs = await Gig.find({ _id: { $in: gigIds } })
    .skip(skip)
    .limit(limit)
    .lean();

  // Step 5: Enrich with provider names
  const enrichedGigs = await Promise.all(
    gigs.map(async (gig) => {
      const provider: { firstName: string; lastName: string } | null = await User.findById(gig.createdBy);
      return {
        ...gig,
        providerName: provider ? `${provider.firstName} ${provider.lastName}` : "",
      };
    })
  );

  return successResponse(
    {
      gigs: enrichedGigs,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    },
    "Gigs with placed bids fetched successfully"
  );
});
