import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Bid from "@/app/models/bid";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";

export const PATCH = withApiHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ bidId: string }> }
  ): Promise<NextResponse> => {
    await dbConnect();

    const { bidId } = await params;
    const userDetails = await verifyToken(req);
    if (!userDetails?.userId) {
      throw new ApiError("Unauthorized", 401);
    }

    const { status } = await req.json();
    if (!["Accepted", "Rejected"].includes(status)) {
      throw new ApiError("Invalid status", 400);
    }

    const bid = await Bid.findById(bidId);
    if (!bid) throw new ApiError("Bid not found", 404);

    // Only the gig creator or admin can update bid status
    if (
      userDetails.role !== "Admin" &&
      bid.createdBy.toString() === userDetails.userId.toString()
    ) {
      throw new ApiError("You cannot update your own bid status", 403);
    }

    // Optional: fetch gig if you want to confirm ownership
    // const gig = await Gig.findById(bid.gigId);

    bid.status = status;
    await bid.save();

    return successResponse(bid, "Bid status updated", 200);
  }
);
