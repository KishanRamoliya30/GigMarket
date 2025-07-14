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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load terms.";
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  }