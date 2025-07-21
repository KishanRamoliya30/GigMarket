import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import Plan from "@/app/models/plans"
import { verifyToken } from '@/app/utils/jwt';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { planId, stripeSubscriptionId } = await req.json();

  const {userId} = await verifyToken(req);
  if(!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!userId || !planId) {
    return NextResponse.json({ success: false, message: "Missing params" }, { status: 400 });
  }

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    }

    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setMonth(now.getMonth() + 1);

    await User.findByIdAndUpdate(userId, {
      subscriptionCompleted:true,
      currentSubscription: {
        planId: plan._id,
        planName: plan.name,
        price: plan.price,
        startedAt: now,
        endsAt,
        status: "active",
        stripeSubscriptionId,
      },
    });

    return NextResponse.json({ success: true, message: "Subscription saved" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
