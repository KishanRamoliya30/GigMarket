import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Profile from "@/app/models/profile";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await dbConnect();
  const userId = (await params).userId

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("profilePicture");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No profile picture file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pictures",
      public_id: `${userId}_${Date.now()}`,
      resource_type: "image",
    });

    const fileUrl = uploadResult.secure_url;
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { profilePicture: fileUrl },
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update picture error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await dbConnect();
  const userId = (await params).userId

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { profilePicture: "" },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
