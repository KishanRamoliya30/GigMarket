import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { ApiError } from "@/app/lib/commonError";
import { verifyToken } from "@/app/utils/jwt";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  const userId = String(userDetails.userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) { 
    throw new ApiError("Invalid user ID");
  }

  const stripeDetails = {
    stripeConnectAccountId: user.stripeConnectAccountId,
    stripeConnectAccountStatus: user.stripeConnectAccountStatus,
  }
  return successResponse(
    stripeDetails,
    "Stripe connect details fetched successfully",
    200
  );
});
