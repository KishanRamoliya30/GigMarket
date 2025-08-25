import { NextRequest } from 'next/server';
import { successResponse } from '@/app/lib/commonHandlers';
import { stripe } from '@/app/lib/strip';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import { ApiError } from '@/app/lib/commonError';
import Subscription from '@/app/models/subscription';
import { jwtVerify } from 'jose';
export const runtime = 'nodejs';

type PlanType = {
  name: string;
  priceId: string;
  _id: string;
  price: number;
  type?: string;
};

type RequestBody = {
  plan: PlanType;
  successUrl: string;
  cancelUrl: string;
  email: string;
};

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: NextRequest) {
  await dbConnect();

  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    throw new ApiError('Invalid JSON body', 400);
  }

  const { payload } = await jwtVerify(
    request.cookies.get("token")?.value ?? "",
    getSecret()
  );

  const user = await User.findOne({ email: payload.email });
  const email = user.email;

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const { plan, successUrl, cancelUrl } = body;

  if (!email || !plan || typeof plan.price !== 'number' || !successUrl || !cancelUrl) {
    throw new ApiError('Invalid plan details or email', 400);
  }

  if (plan.price > 0 && !plan.priceId) {
    throw new ApiError('Missing Stripe priceId for paid plan', 400);
  }

  if (plan.price <= 0) {
    // Cancel existing Stripe subscription if any
    if (user.subscription?.subscriptionId) {
      const existingSub = await Subscription.findById(user.subscription.subscriptionId);

      if (existingSub && existingSub.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(existingSub.stripeSubscriptionId);

        await Subscription.findByIdAndUpdate(existingSub._id, {
          status: 'cancelled',
          endDate: new Date(),
          canceledAt: new Date(),
        });
      }
    }

    // Update user with free plan
    user.subscription = {
      status: 'active',
      subscriptionId: null,
      planId: plan._id,
      planName: plan.name,
      planType: plan.type,
      cancelAtPeriodEnd: false,
    };
    user.subscriptionCompleted = true;
    await user.save();

    return successResponse(
      { message: 'Free subscription activated' },
      'Subscription completed without payment',
      200
    );
  }


  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email });
    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        userId: user._id.toString(),
        planName: plan.name,
        planId: plan._id,
        planType: plan.type || '',
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return successResponse(
    { id: session.id, url: session.url },
    'Stripe session created',
    200
  );
}
