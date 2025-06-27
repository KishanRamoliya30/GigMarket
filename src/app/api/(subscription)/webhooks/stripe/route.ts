import { headers } from 'next/headers';
import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { stripe } from '@/app/lib/strip';
import User from '@/app/models/user';
import Subscription from '@/app/models/subscription';
import Invoice from '@/app/models/invoice';

export async function POST(req: NextRequest) {
  await dbConnect();

  const rawBody = await req.text();
  const sig = (await headers()).get('Stripe-Signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
    // console.log("#####555", event , endpointSecret)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new Response('Webhook Error: Unknown error occurred', { status: 400 });
  }

  const data = event.data.object;
  // console.log("#####50", data, event , event.type , endpointSecret1)

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = data as Stripe.Subscription & {
        start_date: number;
        current_period_start: number;
        current_period_end: number;
      };
      const customerId = sub.customer as string;
      const user = await User.findOne({ stripeCustomerId: customerId });

      console.log("#####51", sub)
      // console.log("#####52", user)

      if (!user) break;

      const subsc = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          user: user._id,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: customerId,
          status: sub.status,
          startDate: new Date(sub.start_date * 1000),
          endDate: new Date(sub.current_period_end * 1000),
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          planId: sub.items.data[0].price.id,
        },
        { upsert: true, new: true }
      );

      console.log("#####6", subsc)

      user.subscription = {
        status: sub.status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        planId: sub.items.data[0].price.id,
      };
      user.subscriptionCompleted = true;

      await user.save();
      console.log("#####56", user)
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = data as Stripe.Subscription;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { status: 'cancelled', endDate: new Date() }
      );
      await User.findOneAndUpdate(
        { stripeCustomerId: sub.customer },
        { 'subscription.status': 'cancelled' }
      );
      break;
    }
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      console.log("####71");
      const invoice = data as Stripe.Invoice & {
        paid: boolean;
        subscription: string;
        period_start: number;
        period_end: number;
        created: number;
        payment_intent: string;
        status_transitions: {
          paid_at?: number;
        };
      };

      const user = await User.findOne({ stripeCustomerId: invoice.customer });

      if (!user) break;

      const subscriptionId = (await Subscription.findOne({ stripeSubscriptionId: invoice.subscription }))?._id;


      await Invoice.findOneAndUpdate(
        { invoiceId: invoice.id },
        {
          user: user._id,
          subscription: subscriptionId,
          invoiceId: invoice.id,
          invoiceNumber: invoice.number,
          paymentId: invoice.payment_intent,
          amount: invoice.amount_due,
          currency: invoice.currency.toUpperCase(),
          status: invoice.paid ? 'paid' : invoice.status,
          invoiceUrl: invoice.hosted_invoice_url,
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          paidAt: invoice.paid && invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : undefined,
          createdAtStripe: new Date(invoice.created * 1000),
        },
        { upsert: true }
      );
      break;
    }
  }

  return new Response('Webhook received', { status: 200 });
}
