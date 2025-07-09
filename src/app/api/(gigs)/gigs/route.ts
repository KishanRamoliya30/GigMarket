import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig, { GigDocument } from "@/app/models/gig";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import { gigSchema } from "@/utils/beValidationSchema";
import { ServiceTier } from "../../../../../utils/constants";
import { FilterQuery } from "mongoose";

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
  const tier = searchParams.get("tier");
  const keyword = searchParams.get("keyword");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const query: FilterQuery<GigDocument> = {};

  if (tier && Object.values(ServiceTier).includes(tier as ServiceTier)) {
    query.tier = tier as ServiceTier;
  }

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { keywords: { $regex: keyword, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;
  const [gigs, total] = await Promise.all([
    Gig.find(query).skip(skip).limit(limit),
    Gig.countDocuments(query),
  ]);

  return successResponse(gigs, "Gigs fetched successfully", 200, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}