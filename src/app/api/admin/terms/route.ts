import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Terms from "@/app/models/terms";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { htmlContent } = body;

    if (!htmlContent || htmlContent.trim() === "") {
      return NextResponse.json({ error: "Terms content is required." }, { status: 400 });
    }

    const savedTerms = await Terms.findOneAndUpdate(
      {},
      {
        content: htmlContent,
        updatedAt: new Date(),
      },
      {
        upsert: true, // create if not exists
        new: true,    // return updated one
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      message: "Terms saved successfully.",
      success: true,
      savedTerms,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

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
        { error: error.message || "Failed to load terms." },
        { status: 500 }
      );
    }
  }