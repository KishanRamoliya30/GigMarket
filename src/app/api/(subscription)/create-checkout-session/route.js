import { successResponse, withApiHandler } from '@/utils/commonHandlers';
import { ApiError } from '@/utils/commonError';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import { stripe } from '@/lib/strip';

export const POST = withApiHandler(async request => {
  await connectMongoDB();

  const { plan, successUrl, cancelUrl, email } = await request.json();

  if (!plan || !email) {
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
      }
    ],
    metadata: {
      userId: user._id.toString(),
      planName: plan.name,
      planData: JSON.stringify(plan),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
  });

  return successResponse({ id: session.id, url: session.url }, 'Stripe session created', 200);
});
