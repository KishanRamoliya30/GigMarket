import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Rating from "@/app/models/ratings";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const {
    gigId,
    createdBy,
    rating,
    review,
    complaint
  } = body;

  if (!gigId || !createdBy || !rating) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  interface NewRating {
    gigId: string;
    createdBy: string;
    rating: number;
    review?: string;
    status: string;
    paymentWithheld: boolean;
    complaint?: {
      issue: string;
      improvementSuggestion: string;
      sincerityAgreement: true;
      providerResponse: null | string;
    };
  }

  const newRating: NewRating = {
    gigId,
    createdBy,
    rating,
    review,
    status: "Pending",
    paymentWithheld: rating < 3,
  };

  if (rating < 3) {
    // Validate complaint structure
    if (
      !complaint ||
      !complaint.issue ||
      !complaint.improvementSuggestion ||
      complaint.sincerityAgreement !== true
    ) {
      return NextResponse.json({
        success: false,
        message: "Complaint data required for ratings below 3 with sincerity agreement."
      }, { status: 400 });
    }

    newRating.complaint = {
      issue: complaint.issue,
      improvementSuggestion: complaint.improvementSuggestion,
      sincerityAgreement: true,
      providerResponse: null
    };
  }

  try {
    const savedRating = await Rating.create(newRating);

    return NextResponse.json({
      success: true,
      message: "Rating submitted successfully.",
      data: savedRating
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const gigId = req.nextUrl.searchParams.get("gigId");

  if (!gigId) {
    return NextResponse.json({ success: false, message: "gigId is required" }, { status: 400 });
  }

  try {
    const ratings = await Rating.find({ gigId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: ratings,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch ratings.",
    }, { status: 500 });
  }
}
