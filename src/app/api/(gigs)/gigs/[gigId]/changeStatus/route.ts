import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Bid from "@/app/models/bid";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";

const gigCreaterAllowedStatus = ["Open", "Assigned", "Not-Assigned", "Approved", "Rejected"]
const bidCreaterAllowedStatus = ["Requested", "In-Progress", "Completed"]

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
    const gigCreaterId = gig.createdBy.toString();

    if (!gig) throw new ApiError("Gig not found", 404);

    const { status, bidId } = await req.json();

    if (!bidId) {
      throw new ApiError("bidId is required to accept or start a gig", 400);
    }

    const bid = await Bid.findById(bidId);

    if (!bid || bid.gigId.toString() !== gigId) {
      throw new ApiError("Bid not found or doesn't belong to this gig", 404);
    }

    const bidCreaterId = bid.createdBy.toString();

    if ((gigCreaterId === userId && !gigCreaterAllowedStatus.includes(status) || (bidCreaterId === userId && !bidCreaterAllowedStatus.includes(status)))) {
      throw new ApiError("You are not authorized to change this gig status", 403);
    }

    if ((gigCreaterId === userId || role === "Admin")) {
      if (status === "Assigned") {
        if (gig.status !== "Requested" && bid.status !== "Requested") {
          throw new ApiError("Only requested bids can be Assigned", 400);
        }

        bid.status = status;
        await bid.save();

        // Reject other bids
        await Bid.updateMany(
          { gigId: bid.gigId, _id: { $ne: bid._id } },
          { status: "Rejected" }
        );

        gig.assignedToBid = bid._id;
        // gig.status = status;
        // await gig.save();

        // return successResponse({ gig, bid }, `Gig marked as ${status}`);
      }

      if (status === "Not-Assigned") {
        if (gig.status !== "Requested" && bid.status !== "Requested") {
          throw new ApiError("Only requested bids can be Assigned", 400);
        }

        bid.status = status;
        await bid.save();

        return successResponse({ gig, bid }, `Bid status updated to ${status}`);
      }

      if (["Approved", "Rejected"].includes(status)) {
        if (!["Completed", "Rejected"].includes(gig.status)) {
          throw new ApiError("Only completed bids can be Assigned", 400);
        }
      }
    }

    if ((bidCreaterId === userId || role === "Admin")) {
      if (status === "In-Progress") {
        if (gig.status !== "Assigned") {
          throw new ApiError("Only assigned bids can be Assigned", 400);
        }
      }

      if (status === "Completed") {
        if (gig.status !== "In-Progress") {
          throw new ApiError("Only in-progress bids can be Assigned", 400);
        }
      }
    }

    gig.status = status;
    await gig.save();

    return successResponse({ gig, bid }, `Gig status updated to ${status}`);
  }
);
