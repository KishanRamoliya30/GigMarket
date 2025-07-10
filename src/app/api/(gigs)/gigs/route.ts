import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig, { GigDocument } from "@/app/models/gig";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import { gigSchema } from "@/utils/beValidationSchema";
import { ServiceTier } from "../../../../../utils/constants";
import { FilterQuery } from "mongoose";
import Profile from "@/app/models/profile";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const userHeader = req.headers.get("x-user");
  if (!userHeader) throw new ApiError("Unauthorized request", 401);
  const userDetails = JSON.parse(userHeader);
  if (!userDetails?._id) throw new ApiError("Invalid user data", 401);

  const data = {
    ...body,
    createdBy: userDetails._id,
  };
  gigSchema.safeParse(data);

  const gig = await Gig.create(data);

  return successResponse(gig, "Gig created successfully", 201);
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const tierParams = searchParams.getAll("tier");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const minReviews = searchParams.get("minReviews");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const query: FilterQuery<GigDocument> = {};

  if (tierParams.length > 0) {
    const validTiers = tierParams.filter((t) =>
      Object.values(ServiceTier).includes(t as ServiceTier)
    );
    if (validTiers.length > 0) {
      query.tier = { $in: validTiers as ServiceTier[] };
    }
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { keywords: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  if (minReviews) {
    query.reviews = { $gte: Number(minReviews) };
  }

  const skip = (page - 1) * limit;

  const [gigsRaw, total] = await Promise.all([
    Gig.find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: "createdBy", model: "users", select: "email" }),
    Gig.countDocuments(query),
  ]);

  const userIds = gigsRaw
    .map((gig) => gig.createdBy && gig.createdBy._id?.toString())
    .filter(Boolean);

  const profiles = await Profile.find(
    { userId: { $in: userIds } }
  )
    .select("fullName pastEducation profilePicture userId")
    .lean();

  const profileMap = new Map(
    profiles.map((p) => [p.userId.toString(), p])
  );

  const gigs = gigsRaw.map((gigDoc) => {
    const gig = gigDoc.toObject();
    const createdBy = gig.createdBy;

    const userIdStr =
      typeof createdBy?._id === "object"
        ? createdBy._id.toString()
        : createdBy?._id;

    const profile = profileMap.get(userIdStr);

    return {
      ...gig,
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


  return successResponse(gigs, "Gigs fetched successfully", 200, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}