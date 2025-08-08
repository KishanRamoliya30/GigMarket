import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Gig from '@/app/models/gig';
import Rating from '@/app/models/ratings';
import { Types } from "mongoose";
import { successResponse } from '@/app/lib/commonHandlers';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const ratingFilter = searchParams.get("rating");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;


    const query: {
      [key: string]: string | { $regex: string; $options: string } | undefined;
    } = {
      status: "Approved",
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Get all matching gigs (for total count)
    const allMatchingGigs = await Gig.find(query).populate("assignedToBid").lean();
    const allGigIds = allMatchingGigs.map((g) => g._id);

    // Get ratings for all matching gigs
    const allRatings = await Rating.aggregate([
      {
        $match: {
          gigId: { $in: allGigIds },
          status: "Approved",
        },
      },
      {
        $group: {
          _id: "$gigId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Build rating map
    const ratingMap = new Map<string, { avgRating: number; totalReviews: number }>();
    allRatings.forEach((r) => ratingMap.set(r._id.toString(), r));

    // Combine gig and rating data
    const allResults = allMatchingGigs.map((gig) => {
      const ratingData = ratingMap.get((gig._id as Types.ObjectId).toString()) || {
        avgRating: 0,
        totalReviews: 0,
      };

      return {
        ...gig,
        rating: parseFloat(ratingData.avgRating.toFixed(1)),
        reviews: ratingData.totalReviews,
        createdBy: gig.assignedToBid?.createdBy?.toString() || null,
      };
    });

    // Apply rating filter
    const filteredResults = allResults.filter((g) => {
      if (ratingFilter) {
        return g.rating >= parseFloat(ratingFilter);
      }
      return true;
    });

    const total = filteredResults.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedResults = filteredResults.slice(skip, skip + limit);

    return successResponse(paginatedResults, "Gig list fetched successfully", 200, {
      total,
      limit,
      page,
      totalPages,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server Error' },
      { status: 500 }
    );
  }
}
