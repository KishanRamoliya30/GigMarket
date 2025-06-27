import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Terms from "@/app/models/terms";

export async function GET() {
    try {
      await dbConnect();
      const terms = await Terms.findOne({});
      if (!terms) {
        return NextResponse.json({ content: "", updatedAt: null });
      }
      return NextResponse.json({
        content: terms.content,
        updatedAt: terms.updatedAt,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message ?? "Failed to load terms." },
        { status: 500 }
      );
    }
  }