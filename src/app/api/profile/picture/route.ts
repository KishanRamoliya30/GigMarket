import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Profile from "@/app/models/profile";
import mongoose from "mongoose";

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, profilePicture } = body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing userId." },
        { status: 400 }
      );
    }

    if (!profilePicture) {
      return NextResponse.json(
        { error: "profilePicture is required." },
        { status: 400 }
      );
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { profilePicture },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile picture updated.",
      profile,
    });
  } catch (error) {
    console.error("PUT /profile/picture error:", error);
    return NextResponse.json(
      { error: "Failed to update profile picture." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid or missing userId." }, { status: 400 });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { profilePicture: "" },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile picture deleted.", profile });
  } catch (error) {
    console.error("DELETE /profile/picture error:", error);
    return NextResponse.json({ error: "Failed to delete profile picture." }, { status: 500 });
  }
}
