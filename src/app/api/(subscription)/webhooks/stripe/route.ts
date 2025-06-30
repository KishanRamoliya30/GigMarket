import { headers } from 'next/headers';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new NextResponse('Webhook Error: Unknown error occurred', { status: 400 });
  }

  const data = event.data.object;
  const session = data as Stripe.Checkout.Session;
  const planData = session.metadata?.planData
    ? JSON.parse(session.metadata.planData)
    : null;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = data as Stripe.Subscription;
      const customerId = sub.customer as string;
      const user = await User.findOne({ stripeCustomerId: customerId });

      if (!user) break;
      const startDate = sub.start_date ? new Date(sub.start_date * 1000) : null
      const endDate = startDate && new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

      const subsc = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          user: user._id,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: customerId,
          planId: planData._id,
          stripePriceId: sub.items?.data?.[0]?.price?.id || '',
          planName: planData.name,
          status: sub.status,
          startDate: startDate,
          endDate: endDate,
          cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
          canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
        },
        { upsert: true, new: true }
      );

      user.subscription = {
        status: sub.status,
        subscriptionId: subsc._id,
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
