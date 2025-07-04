import { headers } from 'next/headers';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { stripe } from '@/app/lib/strip';
import User from '@/app/models/user';
import Subscription from '@/app/models/subscription';
import Invoice from '@/app/models/invoice';
import plans from '@/app/models/plans';

export async function POST(req: NextRequest) {
  await dbConnect();

  const rawBody = await req.text();
  const sig = (await headers()).get('Stripe-Signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: unknown) {
    return new NextResponse(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      { status: 400 }
    );
  }

  const data = event.data.object;
  const session = data as Stripe.Checkout.Session;
  const planData = session.metadata?.planData
    ? JSON.parse(session.metadata.planData)
    : null;

  switch (event.type) {
    case 'checkout.session.completed': {
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      console.log("#####40", session)

      const user = await User.findOne({ stripeCustomerId: customerId });
      if (!user) break;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const startDate = new Date(sub.start_date * 1000);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const currentSubscription = await Subscription.findOne({ _id: user.subscription?.subscriptionId });
      if (currentSubscription && currentSubscription.stripeSubscriptionId !== sub.id) {
        // Mark this subscription as being cancelled due to switching
        await Subscription.findByIdAndUpdate(currentSubscription._id, {
          cancelReason: 'switching',
        });

        await stripe.subscriptions.cancel(currentSubscription.stripeSubscriptionId);
        await Subscription.findByIdAndUpdate(currentSubscription._id, {
          status: 'cancelled',
          endDate: new Date(),
        });
      }

      console.log("#####41", planData);

      // const newSubscription = await Subscription.findOneAndUpdate(
      //   { stripeSubscriptionId: sub.id },
      //   {
      //     user: user._id,
      //     stripeSubscriptionId: sub.id,
      //     stripeCustomerId: customerId,
      //     planId: planData._id,
      //     stripePriceId: sub.items?.data?.[0]?.price?.id || '',
      //     planName: planData.name,
      //     status: sub.status,
      //     startDate,
      //     endDate,
      //     cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      //     canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
      //     cancelReason: null, // Reset
      //   },
      //   { upsert: true, new: true }
      // );

      // console.log("#####42", newSubscription);

      // user.subscription = {
      //   status: sub.status,
      //   subscriptionId: newSubscription._id,
      //   planId: planData._id,
      //   planName: planData.name,
      //   planType: planData.type,
      // };
      // user.subscriptionCompleted = true;
      // await user.save();

      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = data as Stripe.Subscription;
      const customerId = sub.customer as string;
      const user = await User.findOne({ stripeCustomerId: customerId });

      if (!user) break;
      const startDate = sub.start_date ? new Date(sub.start_date * 1000) : null;
      const endDate = startDate && new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

      const newSub = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          user: user._id,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: customerId,
          planId: planData._id,
          stripePriceId: sub.items.data[0]?.price.id || '',
          planName: planData.name,
          status: sub.status,
          startDate,
          endDate,
          cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
          canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
          cancelReason: null,
        },
        { upsert: true, new: true }
      );

      user.subscription = {
        status: sub.status,
        subscriptionId: newSub._id,
        planId: planData._id,
        planName: planData.name,
        planType: planData.type,
      };

      user.subscriptionCompleted = true;
      await user.save();
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = data as Stripe.Subscription;
      const customerId = sub.customer as string;

      console.log("#####6", sub)
      console.log("#####61", customerId)
      const user = await User.findOne({ stripeCustomerId: customerId });
      console.log("#####62", user);
      if (!user) break;

      const updatedSub = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          status: 'cancelled',
          endDate: new Date(),
          canceledAt: new Date(),
        },
        { new: true }
      );
      console.log("#####63", updatedSub);

      if (updatedSub?.cancelReason === 'switching') {
        break;
      }

      const freePlan = await plans.findOne({ type: 1, price: 0 });
      console.log("#####64", freePlan);

      if (freePlan) {
        user.subscription = {
          status: 'active',
          subscriptionId: null,
          planId: freePlan._id,
          planName: freePlan.name,
          planType: freePlan.type,
        };
        user.subscriptionCompleted = true;
      } else {
        user.subscription = {
          status: 'cancelled',
          subscriptionId: null,
          planId: null,
          planName: null,
          planType: null,
        };
        user.subscriptionCompleted = false;
      }

      await user.save();
      console.log("#####65", user);
      break;
    }

    case 'invoice.paid':
    case 'invoice.payment_failed': {
      const invoice = data as Stripe.Invoice;
      const user = await User.findOne({ stripeCustomerId: invoice.customer });
      if (!user) break;

      const subscriptionId = (await Subscription.findOne({ stripeSubscriptionId: invoice.parent?.subscription_details?.subscription }))?._id;

      await Invoice.findOneAndUpdate(
        { invoiceId: invoice.id },
        {
          user: user._id,
          subscriptionId,
          invoiceId: invoice.id,
          invoiceNumber: invoice.number,
          amount: invoice.amount_due / 100,
          currency: invoice.currency.toUpperCase(),
          status: invoice.status,
          invoicePdf: invoice.invoice_pdf,
          hoistedInvoiceUrl: invoice.hosted_invoice_url,
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          paidAt: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : undefined,
          createdAtStripe: new Date(invoice.created * 1000),
        },
        { upsert: true }
      );

      break;
    }
  }

  return new NextResponse('Subscription has been done successfully', { status: 200 });
}
