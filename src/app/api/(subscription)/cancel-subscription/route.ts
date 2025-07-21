import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import dbConnect from "@/app/lib/dbConnect";
import { stripe } from "@/app/lib/strip";
import Subscription from "@/app/models/subscription";
import User from "@/app/models/user";
import { verifyToken } from "@/app/utils/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  
  const userDetails = await verifyToken(request);
  const user = await User.findOne({ email: userDetails.email });
  if (!user) throw new ApiError('User not found', 404);

  const subId = user.subscription?.subscriptionId;
  if (!subId) throw new ApiError('No active subscription found', 400);

  const subscription = await Subscription.findById(subId);
  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new ApiError('Subscription record not found', 400);
  }

  await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    { cancel_at_period_end: true }
  );

  await Subscription.findByIdAndUpdate(subscription._id, {
    cancelReason: 'user_cancelled',
    cancelAtPeriodEnd: true,
    canceledAt: null,
  });

  user.subscription.cancelAtPeriodEnd = true;
  user.markModified('subscription');
  await user.save();

  return successResponse(
    { message: 'Subscription will cancel at end of billing period' },
    'Cancellation scheduled',
    200
  );
}
