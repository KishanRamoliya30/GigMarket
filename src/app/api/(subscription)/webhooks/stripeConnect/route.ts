import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { stripe } from "@/app/lib/strip";
import User from "@/app/models/user";

export async function POST(req: NextRequest) {
  await dbConnect();

  const rawBody = await req.text();
  const sig = (await headers()).get("Stripe-Signature");
  const endpointSecret = "whsec_MK7MIcEwK4UTWppWPIMWvLwDaGEe8wpY";

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: unknown) {
    return new NextResponse(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }

  switch (event.type) {
    case "account.updated": {
      const account = event.data.object;

      const user = await User.findOne({
        stripeConnectAccountId: account.id,
      });

      if (!user) return new Response("User not found", { status: 404 });

      let newStatus = "NEEDS_ONBOARDING";
      if (!account.details_submitted || (account.requirements?.currently_due?.length??0) !== 0) {
        newStatus = "NEEDS_ONBOARDING";
      } else if (
        account.details_submitted &&
        !account.charges_enabled &&
        account.requirements?.currently_due?.length === 0
      ) {
        newStatus = "IN_REVIEW";
      } else if (account.charges_enabled && account.payouts_enabled) {
        newStatus = "ACTIVE";
      }
      console.log("New status:", newStatus);
      user.stripeConnectAccountStatus = newStatus;
      try{
        await user.save();
      }
      catch (err) {
        console.error("Failed to save user:", err);
      }
      break;
    }
  }

  const response = new NextResponse("Webhook recieved successfully", {
    status: 200,
  });

  return response;
}
