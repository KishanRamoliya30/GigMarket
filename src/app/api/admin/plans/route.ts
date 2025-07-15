import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Plan from "@/app/models/plans";
import {stripe} from "@/app/lib/strip"; 

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, name, price, description, benefits } = body;

    if (!_id) {
      return NextResponse.json({ success: false, message: "Missing plan ID" }, { status: 400 });
    }

    const plan = await Plan.findById(_id);
    if (!plan) throw new Error("Plan not found");

    const { type } = plan;

    if (type !== 1 && plan.price !== price) {
      const stripePrice = await stripe.prices.create({
        unit_amount: price * 100,
        currency: "usd",
        recurring: { interval: "month" },
        product: plan.productId,
      });

      plan.priceId = stripePrice.id;
    }

    plan.name = name;
    plan.price = price;
    plan.description = description;
    plan.benefits = benefits;

    await plan.save();
    return NextResponse.json(
      { success: true, message: "Plan updated successfully" },
    );
  } catch (err) {
    console.error("PATCH /admin/plans error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update plan" },
      { status: 500 }
    );
  }
}