import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Bid from "@/app/models/bid";
import Gig from "@/app/models/gig";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";

export async function PUT(
  req: NextRequest,
  { params }: { params: { gigId:string, bidId: string } }
): Promise<NextResponse> {
  await dbConnect();

  const userDetails = await verifyToken(req);
  if (!userDetails?.userId) {
    throw new ApiError("Unauthorized", 401);
  }

  const { status } = await req.json();
  const { bidId,gigId } = params;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError("Invalid status", 400);
  }

  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new ApiError("Gig not found", 404);
  } 

  try{
    gig.status = "In-Progress";
    await gig.save();
  }
  catch (error) {
    return successResponse(error);

  }
  

  if (gig.createdBy.toString() !== userDetails.userId) {
    throw new ApiError("You are not authorized to update this gig", 403);
  }    

  const bid = await Bid.findById(bidId);
  if (!bid) {
    throw new ApiError("Bid not found", 404);
  }
  bid.status = status;
  await bid.save();

  if(status === "approved") {
    await Bid.updateMany(
      { gigId: bid.gigId, _id: { $ne: bid._id } },
      { status: "rejected" }
    );
    
    gig.status = "In-Progress";
    await gig.save();

  }
  return successResponse(bid, `Bid ${status} successfully`);
}
