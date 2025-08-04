import { stripe } from "@/app/lib/strip";
import { successResponse, errorResponse } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import { NextRequest } from "next/server";
import User from "@/app/models/user";

export async function POST(req: NextRequest) {
  try {
    const userDetails = await verifyToken(req);

    const user = await User.findById(userDetails?.userId);
    
    const paymentMethods = await stripe.paymentMethods.list({
        customer: user?.stripeCustomerId || undefined,
        type: "card",
      });
      
    return successResponse(
      { paymentMethods: paymentMethods.data },
      "Payment intent created successfully",
      200
    );
  } catch (error: unknown) {
    return errorResponse(error, 500);
  }
}
