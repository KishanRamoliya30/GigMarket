import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { successResponse ,withApiHandler} from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import User from "@/app/models/user";
import { stripe } from "@/app/lib/strip";
import { ApiError } from "@/app/lib/commonError";

export const POST = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {

  await dbConnect();
    const userDetails = await verifyToken(req);
    if (!userDetails) {
      throw new ApiError('Unauthorized request', 401);
    }
    const user= await User.findById(userDetails?.userId);
    if (!user) {
        throw new ApiError("User not found", 404);
    }
    let accountId = user.stripeConnectAccountId;
    if (!accountId) {
        const account = await stripe.accounts.create({
          type: "express",
          email: user.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });
        user.stripeConnectAccountId = account.id;
        user.stripeConnectAccountStatus = 'PENDING';
        accountId = account.id;
        try {
          await user.save();
          console.log("User saved");
        } catch (err) {
          console.error("Failed to save user:", err);
        }
    }    
  
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/myProfile/stripe-connect-success`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/myProfile/stripe-connect-success`,
      type: "account_onboarding",
    });

    return successResponse(
      { url: accountLink.url, accountId: accountId },
      "Stripe Connect profile created successfully",
      201
    );
})
