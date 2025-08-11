import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Rating from "@/app/models/ratings";
import Bid from "@/app/models/bid";;
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import { Types } from "mongoose";

enum RatingStatus {
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PENDING = "Pending",
  REVIEWED = "Reviewed",
}

enum DisputeStatus {
  PENDING = "Pending",
  PROVIDER_WON = "ProviderWon",
  PROVIDER_LOST = "ProviderLost",
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { gigId, createdBy, rating, review, complaint } = body;

  if (!gigId || !createdBy || typeof rating !== "number") {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if already reviewed
  const existingReview = await Rating.findOne({ gigId, createdBy });
  if (existingReview) {
    return NextResponse.json(
      {
        success: false,
        message: "You have already submitted a review for this gig.",
      },
      { status: 400 }
    );
  }

  // Construct rating object
  const newRating: {
    gigId: string;
    createdBy: string;
    rating: number;
    review: number;
    paymentWithheld: boolean;
    isPublic: boolean;
    status: RatingStatus;
    complaint?: {
      issue: string;
      improvementSuggestion: string;
      sincerityAgreement: boolean;
      providerResponse: string;
      disputeStatus: DisputeStatus;
    };
  } = {
    gigId,
    createdBy,
    rating,
    review,
    paymentWithheld: rating < 3,
    isPublic: rating >= 3,
    status: rating >= 3 ? RatingStatus.APPROVED : RatingStatus.PENDING,
  };

  // If rating is low, validate complaint
  if (rating < 3) {
    if (
      !complaint ||
      !complaint.issue ||
      !complaint.improvementSuggestion ||
      complaint.sincerityAgreement !== true
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complaint with issue, improvement suggestion, and sincerity agreement is required for low ratings.",
        },
        { status: 400 }
      );
    }

    newRating.complaint = {
      issue: complaint.issue,
      improvementSuggestion: complaint.improvementSuggestion,
      sincerityAgreement: true,
      providerResponse: "",
      disputeStatus: DisputeStatus.PENDING,
    };
  }

  try {
    const savedRating = await Rating.create(newRating);
    return NextResponse.json({
      success: true,
      message: "Rating submitted successfully.",
      isReview: true,
      data: savedRating,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  const role = userDetails.role as "User" | "Provider";
  const userId = userDetails.userId;

  if (!userId) throw new ApiError("Unauthorized", 401);

  let ratings = [];

  if (role === "User") {
    ratings = await Rating.find({
      createdBy: new Types.ObjectId(userId),
      complaint: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .lean();
  } else if (role === "Provider") {
    // Get all gigIds where provider has placed bids
    const providerBids = await Bid.find({ createdBy: new Types.ObjectId(userId) }, { gigId: 1 }).lean();
    const gigIds = [...new Set(providerBids.map((bid) => bid.gigId.toString()))];

    if (gigIds.length === 0) {
      return successResponse(
        {
          disputes: [],
        },
        "No disputes found"
      );
    }

    // Get ratings with complaints for gigs where ratings < 3
    ratings = await Rating.find({
      gigId: { $in: gigIds.map((id) => new Types.ObjectId(id)) },
      complaint: { $ne: null },
      rating: { $lt: 3 },
    })
      .sort({ createdAt: -1 })
      .lean();
  } else {
    throw new ApiError("Invalid role", 400);
  }

  return successResponse(
    {
      disputes: ratings,
    },
    "Disputes fetched successfully"
  );
});
