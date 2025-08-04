import { stripe } from "@/app/lib/strip";
import { successResponse, errorResponse } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import { NextRequest } from "next/server";
import User from "@/app/models/user";

export async function POST(req: NextRequest) {
  try {
    const { amount, gigId, userId,refId } = await req.json();
    const userDetails = await verifyToken(req);
    console.log("User Details:", userDetails);

    const user = await User.findById(userDetails?.userId);
    console.log("User Found:", user?.stripeCustomerId);
    const paymentIntent = await stripe.paymentIntents.create({
      amount:amount*100, 
      currency: "USD",
      customer: user?.stripeCustomerId || undefined,
      payment_method_types: ["card"],
      metadata: { gigId, userId,refId },
      setup_future_usage: "off_session",
    });
    return successResponse(
      { clientSecret: paymentIntent.client_secret },
      "Payment intent created successfully",
      200
    );
  } catch (error: unknown) {
    return errorResponse(error, 500);
  }
}
