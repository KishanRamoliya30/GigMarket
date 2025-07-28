import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Bid from "@/app/models/bid";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";

const validGigStatuses = [
  "Open",
  "Requested",
  "Accepted",
  "In-Progress",
  "Completed",
  "Approved",
  "Rejected",
] as const;

export const PATCH = withApiHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ gigId: string }> }
  ): Promise<NextResponse> => {
    await dbConnect();

    const { gigId } = await params;
    const { userId, role } = await verifyToken(req) || {};
    if (!userId || !role) throw new ApiError("Unauthorized", 401);

    const gig = await Gig.findById(gigId);
    if (!gig) throw new ApiError("Gig not found", 404);

    if (gig.createdBy.toString() !== userId && role !== "Admin") {
      throw new ApiError("Not authorized to update this gig", 403);
    }

    const { status, bidId } = await req.json();

    const gigCreaterId = gig.createdBy;
    console.log("######41", gigCreaterId);

    if (!validGigStatuses.includes(status)) {
      throw new ApiError("Invalid gig status", 400);
    }

    if (status === "Accepted" || status === "In-Progress") {
      if (!bidId) {
        throw new ApiError("bidId is required to accept or start a gig", 400);
      }

      const bid = await Bid.findById(bidId);
      if (!bid || bid.gigId.toString() !== gigId) {
        throw new ApiError("Bid not found or doesn't belong to this gig", 404);
      }

      if (bid.status !== "Requested") {
        throw new ApiError("Only Requested bids can be accepted", 400);
      }

      bid.status = "Accepted";
      await bid.save();

      // Reject other bids
      await Bid.updateMany(
        { gigId: bid.gigId, _id: { $ne: bid._id } },
        { status: "Rejected" }
      );

      gig.status = status;
      gig.assignedToBid = bid._id;
      await gig.save();

      return successResponse({ gig, bid }, `Gig marked as ${status}`);
    }

    gig.status = status;
    await gig.save();

    return successResponse(gig, `Gig status updated to ${status}`);
  }
);
