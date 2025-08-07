import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import User from "@/app/models/user";
import { stripe } from "@/app/lib/strip";
import { ApiError } from "@/app/lib/commonError";

export const POST = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  if (!userDetails) {
    throw new ApiError("Unauthorized request", 401);
  }

  const user = await User.findById(userDetails.userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (!user.stripeConnectAccountId) {
    throw new ApiError("Stripe Connect account not found. Please onboard first.", 400);
  }


  const loginLink = await stripe.accounts.createLoginLink(user.stripeConnectAccountId);

  return successResponse(
    { url: loginLink.url },
    "Stripe Connect dashboard login link created successfully",
    200
  );
});
