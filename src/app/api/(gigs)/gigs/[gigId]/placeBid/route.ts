import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Bid from "@/app/models/bid";
import Gig from "@/app/models/gig";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { placeBidSchema } from "@/utils/beValidationSchema";
import User from "@/app/models/user";

export const POST = withApiHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ gigId: string }> }
  ): Promise<NextResponse> => {
    await dbConnect();

    const gigId = (await params).gigId;
    if (!gigId) {
      throw new ApiError("Gig ID is required", 400);
    }

    const userHeader = req.headers.get("x-user");
    if (!userHeader) throw new ApiError("Unauthorized request", 401);

    const userDetails = JSON.parse(userHeader);
    // if (!userDetails?._id || !userDetails?.role) {
    //   throw new ApiError("Invalid user data", 401);
    // }

    const user = await User.findById(userDetails._id);
    if (!user) throw new ApiError("User not found", 404);
    const plan = user.subscription?.planName || "Free";
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (plan === "Free") {
      throw new ApiError("Free plan users are not allowed to place bid", 403);
    }

    if (plan === "Basic") {
      const currentMonthBidCount = await Bid.countDocuments({
        createdBy: user._id,
        createdAt: { $gte: startOfMonth },
      });

      if (currentMonthBidCount >= 5) {
        throw new ApiError("Basic plan allows only 5 gig bids per month", 403);
      }
    }

    const gig = await Gig.findById(gigId);
    if (!gig) throw new ApiError("Gig not found", 404);
    if (gig.createdBy.toString() === user._id.toString()) {
      throw new ApiError("You cannot bid on your own gig", 403);
    }

    if (!["Open", "Requested"].includes(gig.status)) {
      throw new ApiError("Bidding is closed for this gig", 403);
    }

    const { bidAmount, description, bidAmountType } = await req.json();

    if (!bidAmount || !description || isNaN(bidAmount)) {
      throw new ApiError("Missing or invalid required fields", 400);
    }

    const data = {
      gigId: gigId,
      createdBy: user._id,
      bidAmount: Number(bidAmount),
      description: description.trim(),
      status: "Requested",
      bidAmountType: bidAmountType,
    };

    placeBidSchema.parse(data);
    const bid = await Bid.create(data);

    if (gig.status === "Open") {
      gig.status = "Requested";
      await gig.save();
    }
    return successResponse(bid, "Bid placed successfully", 201);
  }
);
