import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { createGigSchema } from "@/utils/beValidationSchema";

import { uploadToCloudinary } from "@/lib/cloudinaryFileUpload";
import User from "@/app/models/user";

export const POST = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userHeader = req.headers.get("x-user");
  console.log("#####62", userHeader)
  if (!userHeader) throw new ApiError("Unauthorized request", 401);

  const userDetails = JSON.parse(userHeader);
  if (!userDetails?._id || !userDetails?.role) {
    throw new ApiError("Invalid user data", 401);
  }

  const user = await User.findById(userDetails._id);
  if (!user) throw new ApiError("User not found", 404);
  const plan = user.subscription?.planName || "Free";
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (plan === "Free") {
    throw new ApiError("Free plan users are not allowed to post gigs", 403);
  }

  if (plan === "Basic") {
    const currentMonthGigCount = await Gig.countDocuments({
      createdBy: user._id,
      createdAt: { $gte: startOfMonth },
    });

    if (currentMonthGigCount >= 3) {
      throw new ApiError("Basic plan allows only 3 gig posts per month", 403);
    }
  }

  const formData = await req.formData();

  const file = formData.get("certification") as File | null;
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const tier = formData.get("tier")?.toString();
  const price = Number(formData.get("price"));
  const time = Number(formData.get("time"));
  const keywords = JSON.parse((formData.get("keywords") as string) || "[]");
  const releventSkills = JSON.parse((formData.get("releventSkills") as string) || "[]");

  if (!title || !description || !tier || isNaN(price) || isNaN(time)) {
    throw new ApiError("Missing or invalid required fields", 400);
  }

  let uploadedFile = null;
  if (file) {
    const url = await uploadToCloudinary(file, { folder: "gig_certifications" });
    uploadedFile = {
      url,
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }

  const data = {
    title,
    description,
    tier,
    price,
    time,
    keywords,
    releventSkills,
    certification: uploadedFile,
    createdByRole: userDetails.role,
    createdBy: userDetails._id,
    status: "Open"
  };

  createGigSchema.parse(data);
  const gig = await Gig.create(data);
  return successResponse(gig, "Gig created successfully", 201);
});