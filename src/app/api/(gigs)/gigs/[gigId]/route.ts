import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Bid from "@/app/models/bid";
import Profile from "@/app/models/profile";
import { ApiError } from "@/app/lib/commonError";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";
import { verifyToken } from "@/app/utils/jwt";
import User from "@/app/models/user";
import { uploadToCloudinary } from "@/lib/cloudinaryFileUpload";
import { updateGigSchema } from "@/utils/beValidationSchema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
): Promise<NextResponse> {
  await dbConnect();
  const gigId = (await params).gigId;
  if (!gigId) {
    throw new ApiError("Gig ID is required", 400);
  }
  const gig = await Gig.findById(gigId).populate({
    path: "createdBy",
    model: "users",
    select: "email",
  });
  if (!gig) {
    throw new ApiError("Gig not found", 404);
  }

  const profile = await Profile.findOne({
    userId: gig.createdBy._id.toString(),
  }).select("fullName pastEducation profilePicture userId");

  const bids = await Bid.countDocuments({
    gigId: gig._id,
  });
  const userHeader = req.headers.get("x-user");
  let userBids = null;
  if (userHeader) {
    const userDetails = JSON.parse(userHeader);
    //find Bid for this gig by thi user
    userBids = await Bid.findOne({
      gigId: gig._id,
      createdBy: userDetails._id,
    }).select("bidAmount description status createdAt");
  }

  const createdBy = gig.createdBy;

  return successResponse(
    {
      ...gig.toObject(),
      bids,
      bid: userBids ? userBids.toObject() : null,
      createdBy: {
        ...(createdBy?.toObject?.() ?? createdBy),
        ...(profile && {
          fullName: profile.fullName,
          pastEducation: profile.pastEducation,
          profilePicture: profile.profilePicture,
        }),
      },
    },
    "Gig retrieved successfully"
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
): Promise<NextResponse> {
  await dbConnect();

  const user = await verifyToken(req);
  if (!user?.userId)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const gigId = (await params).gigId;
  if (!gigId) {
    throw new ApiError("Gig ID is required", 400);
  }

  const gig = await Gig.findById(gigId).populate({
    path: "createdBy",
    model: "users",
    select: "email",
  });

  if (!gig) {
    throw new ApiError("Gig not found", 404);
  }

  if (user.role !== "Admin") {
    if (gig.createdBy._id.toString() !== user.userId.toString()) {
      return NextResponse.json(
        { error: "This User is not authorized to delete gig" },
        { status: 401 }
      );
    }
  }
  await Gig.deleteOne({ _id: gigId });

  return successResponse(null, "Gig deleted successfully");
}

export const PATCH = withApiHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ gigId: string }> }
  ): Promise<NextResponse> => {
    await dbConnect();

    const userDetails = await verifyToken(req);
    if (!userDetails?.userId || !userDetails?.role) {
      throw new ApiError("Unauthorized request", 401);
    }

    const user = await User.findById(userDetails.userId);
    if (!user) throw new ApiError("User not found", 404);

    const gigId = (await params).gigId;
    if (!gigId) throw new ApiError("Gig ID is required", 400);

    const gig = await Gig.findById(gigId);
    if (!gig) throw new ApiError("Gig not found", 404);

    if (userDetails.role !== "Admin" && gig.createdBy.toString() !== userDetails.userId) {
      throw new ApiError("You are not authorized to update this gig", 403);
    }

    const formData = await req.formData();

    const certification = formData.get("certification") as File | null;
    const gigImage = formData.get("gigImage") as File | null;
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const tier = formData.get("tier")?.toString();
    const price = formData.get("price") ? Number(formData.get("price")) : undefined;
    const time = formData.get("time") ? Number(formData.get("time")) : undefined;

    const rating = formData.get("rating") ? Number(formData.get("rating")) : undefined;
    const reviews = formData.get("reviews") ? Number(formData.get("reviews")) : undefined;

    const keywords = JSON.parse((formData.get("keywords") as string) || "[]");
    const releventSkills = JSON.parse((formData.get("releventSkills") as string) || "[]");

    let certificationFile = gig.certification;
    if (certification) {
      const url = await uploadToCloudinary(certification, { folder: "gig_certifications" });
      certificationFile = {
        url,
        name: certification.name,
        type: certification.type,
        size: certification.size,
      };
    }

    let gigImageFile = gig.gigImage;
    if (gigImage) {
      const url = await uploadToCloudinary(gigImage, { folder: "gig_images" });
      gigImageFile = {
        url,
        name: gigImage.name,
        type: gigImage.type,
        size: gigImage.size,
      };
    }

    const updatedData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(tier && { tier }),
      ...(price !== undefined && { price }),
      ...(time !== undefined && { time }),
      ...(rating !== undefined && { rating }),
      ...(reviews !== undefined && { reviews }),
      ...(keywords.length > 0 && { keywords }),
      ...(releventSkills.length > 0 && { releventSkills }),
      ...(certificationFile && { certification: certificationFile }),
      ...(gigImageFile && { gigImage: gigImageFile }),
    };

    updateGigSchema.parse(updatedData);

    const updatedGig = await Gig.findByIdAndUpdate(gigId, updatedData, {
      new: true,
      runValidators: true,
    });

    return successResponse(updatedGig, "Gig updated successfully", 200);
  }
);
