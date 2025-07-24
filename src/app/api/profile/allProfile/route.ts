import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Profile from "@/app/models/profile";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";

export async function GET(req: NextRequest): Promise<NextResponse> {
  await dbConnect();

  const url = new URL(req.url);

  const rawLimit = url.searchParams.get("limit");
  const rawPage = url.searchParams.get("page");
  const rawSearch = url.searchParams.get("search");

  let limit = parseInt(rawLimit || "", 10);
  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  }

  let page = parseInt(rawPage || "", 10);
  if (isNaN(page) || page <= 0) {
    page = 1;
  }

  const search = rawSearch?.trim() || "";

  const filter: {
    $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  } = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [profiles, total] = await Promise.all([
    Profile.find(filter)
      .sort({ rate: -1, creatdAt: -1 })
      .skip(skip)
      .limit(limit),
    Profile.countDocuments(filter),
  ]);

  if (!profiles.length) {
    throw new ApiError("No profiles found", 404);
  }

  const totalPages = Math.ceil(total / limit);

  return successResponse(
    {
      profiles,
      pagination: {
        total,
        limit,
        page,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    },
    "Profiles retrieved successfully"
  );
}
