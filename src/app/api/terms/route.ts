import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Terms from "@/app/models/terms";
import { stripe } from "@/app/lib/strip";

export async function GET() {
    try {
      await dbConnect();
      const products = await stripe.products.list()
      const prices = await stripe.prices.list()
      
      const terms = await Terms.findOne({});
      if (!terms) {
        return NextResponse.json({ content: "", updatedAt: null });
      }
      return NextResponse.json({
        products,
        prices,
        content: terms.content,
        updatedAt: terms.updatedAt,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to load terms." },
        { status: 500 }
      );
    }
  }