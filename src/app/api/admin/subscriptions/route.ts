import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  benefits: [String],
}, { timestamps: true });

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema, "plans");

// GET all subscriptions
export async function GET() {
  await dbConnect();
  const plans = await Subscription.find().lean();
  return NextResponse.json(plans);
}

// PATCH update subscription plan
export async function PATCH(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { _id, name, price, description, benefits } = body;

  const updated = await Subscription.findByIdAndUpdate(
    _id,
    { name, price, description, benefits },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, plan: updated });
}
