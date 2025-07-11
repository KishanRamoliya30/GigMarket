import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Profile from "@/app/models/profile";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { generateToken } from "@/app/utils/jwt";
import { expiryTime } from "../../../../utils/constants";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      userId,
      fullName,
      profilePicture,
      professionalSummary,
      interests,
      extracurricularActivities,
      certifications,
      skills,
      currentSchool,
      degreeType,
      major,
      minor,
      graduationYear,
      pastEducation,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in request." },
        { status: 400 }
      );
    }

    const existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists for this user." },
        { status: 400 }
      );
    }

    const formattedCertifications = certifications.map(
      (cert: { file: { name: string; url: string } }) => ({
        fileName: cert?.file?.name || "Unnamed.pdf",
        url: cert?.file?.url || "",
      })
    );

    const profile = new Profile({
      userId,
      fullName,
      profilePicture,
      professionalSummary,
      interests,
      extracurricularActivities,
      certifications: formattedCertifications,
      skills,
      currentSchool,
      degreeType,
      major,
      minor,
      graduationYear,
      pastEducation,
    });

    const savedProfile = await profile.save();

    // ✅ Mark profileCompleted = true in the User model
    await User.findByIdAndUpdate(userId, {
      profileCompleted: true,
    });
    // ✅ Fetch updated user to get the latest subscription/profile info
    const user = await User.findById(userId);

    // ✅ Generate new token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      subscriptionCompleted: user.subscriptionCompleted,
      profileCompleted: user.profileCompleted,
    });

    const response = NextResponse.json({
      success: true,
      message: "Profile created successfully.",
      profile: savedProfile,
    });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: expiryTime,
    });

    return response;
  } catch (error) {
    console.error("Profile Save Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save profile." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Missing or invalid userId in query." },
        { status: 400 }
      );
    }

    const profile = await Profile.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    console.log("Fetched profile:", profile);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET /profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

// ✅ UPDATE PROFILE
export async function PUT(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      userId,
      fullName,
      profilePicture,
      professionalSummary,
      interests,
      extracurricularActivities,
      certifications,
      skills,
      currentSchool,
      degreeType,
      major,
      minor,
      graduationYear,
      pastEducation,
    } = body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing userId." },
        { status: 400 }
      );
    }

    const existingProfile = await Profile.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    const formattedCertifications = certifications?.map(
      (cert: { file: { name: string } }) => ({
        fileName: cert?.file?.name || "Unnamed.pdf",
      })
    );

    existingProfile.fullName = fullName;
    existingProfile.profilePicture = profilePicture;
    existingProfile.professionalSummary = professionalSummary;
    existingProfile.interests = interests;
    existingProfile.extracurricularActivities = extracurricularActivities;
    existingProfile.certifications = formattedCertifications || [];
    existingProfile.skills = skills;
    existingProfile.currentSchool = currentSchool;
    existingProfile.degreeType = degreeType;
    existingProfile.major = major;
    existingProfile.minor = minor;
    existingProfile.graduationYear = graduationYear;
    existingProfile.pastEducation = pastEducation;

    const updatedProfile = await existingProfile.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("PUT /profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
