import { NextRequest } from 'next/server';
import { successResponse } from '@/app/lib/commonHandlers';
import { stripe } from '@/app/lib/strip';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import { ApiError } from '@/app/lib/commonError';

type PlanType = {
  name: string;
  priceId: string;
};

type RequestBody = {
  plan: PlanType;
  successUrl: string;
  cancelUrl: string;
  email: string;
};

export async function POST(request: NextRequest) {
  await dbConnect();

  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    throw new ApiError('Invalid JSON body', 400);
  }


  const xUser = request.headers.get('x-user');
  const userDetails = JSON.parse(xUser!);
  const email = userDetails.email

  const { plan, successUrl, cancelUrl } = body;

  if (!plan || !plan.priceId || !successUrl || !cancelUrl) {
    throw new ApiError('Invalid plan details or email', 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError('User not found', 404);
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
    metadata: {
      userId: user._id.toString(),
      planName: plan.name,
      planData: JSON.stringify(plan),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    // customer_email: email,
  });

  return successResponse(
    { id: session.id, url: session.url },
    'Stripe session created',
    200
  );
};
