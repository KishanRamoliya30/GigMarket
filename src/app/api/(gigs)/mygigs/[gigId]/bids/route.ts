import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { successResponse } from "@/app/lib/commonHandlers";
import Profile from "@/app/models/profile";
import { verifyToken } from "@/app/utils/jwt";
import { ApiError } from "@/app/lib/commonError";
import Bids from "@/app/models/bid";
import { FilterQuery } from "mongoose";
import { Bid } from "@/app/utils/interfaces";
export async function GET(req: NextRequest,{ params }: { params: Promise<{ gigId: string }>}) {
  await dbConnect();

  const userDetails = await verifyToken(req);
  
 if (!userDetails?.userId || !userDetails?.role) {
   throw new ApiError('Unauthorized request', 401);
 }


 const gigId = (await params).gigId;
  if (!gigId) {
    throw new ApiError("Gig ID is required", 400);
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort = searchParams.get("sort") || "";
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    "Pricing: High to Low": { bidAmount: -1 },
    "Pricing: Low to High": { bidAmount: 1 },
    "Rating: High to Low": { rating: -1 },
    "Rating: Low to High": { rating: 1 },
  };

  const sortOption = sortMap[sort] || { createdAt: -1 };
  const skip = (page - 1) * limit;
  const query: FilterQuery<Bid> = {};
  if (minPrice || maxPrice) {
    query.bidAmount = {};
    if (minPrice) query.bidAmount.$gte = Number(minPrice);
    if (maxPrice) query.bidAmount.$lte = Number(maxPrice);
  }

  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  const [bidRaw, total] = await Promise.all([
    Bids.find({gigId:gigId, ...query})
      .skip(skip)
      .limit(limit)
      .populate({ path: "createdBy", model: "users", select: "email" })
      .sort({ status: 1, ...sortOption }),
    Bids.countDocuments({gigId:gigId, ...query}),
  ]);

  const userIds = bidRaw
    .map((bid) => bid.createdBy && bid.createdBy._id?.toString())
    .filter(Boolean);

  const profiles = await Profile.find(
    { userId: { $in: userIds } }
  )
    .select("fullName pastEducation profilePicture userId")
    .lean();

  const profileMap = new Map(
    profiles.map((p) => [p.userId.toString(), p])
  );

  const bids = bidRaw.map((bidDoc) => {
    const bid = bidDoc.toObject();
    const createdBy = bid.createdBy;

    const userIdStr =
      typeof createdBy?._id === "object"
        ? createdBy._id.toString()
        : createdBy?._id;

    const profile = profileMap.get(userIdStr);

    return {
      ...bid,
      createdBy: {
        ...createdBy,
        ...(profile && {
          fullName: profile.fullName,
          pastEducation: profile.pastEducation,
          profilePicture: profile.profilePicture,
        }),
      },
    };
  });


  return successResponse(bids, "Bids fetched successfully", 200, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}