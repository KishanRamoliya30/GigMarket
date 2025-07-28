import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Profile from "@/app/models/profile";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { generateToken } from "@/app/utils/jwt";
import { expiryTime } from "../../../../utils/constants";
import { uploadToCloudinary } from "@/lib/cloudinaryFileUpload";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const userId = formData.get("userId") as string;
    const fullName = formData.get("fullName") as string;
    const professionalSummary = formData.get("professionalSummary") as string;
    const interests = JSON.parse((formData.get("interests") as string) || "[]");
    const extracurricularActivities = formData.get(
      "extracurricularActivities"
    ) as string;
    const certifications = JSON.parse(
      (formData.get("certifications") as string) || "[]"
    );
    // const certifications = formData.getAll("certifications") as File[];
      const certification = formData.get("certification") as File | null;
    const skills = JSON.parse((formData.get("skills") as string) || "[]");
    const currentSchool = formData.get("currentSchool") as string;
    const degreeType = formData.get("degreeType") as string;
    const major = formData.get("major") as string;
    const minor = formData.get("minor") as string;
    const graduationYear = formData.get("graduationYear") as string;
    const pastEducation = JSON.parse(
      (formData.get("pastEducation") as string) || "[]"
    );
  let certificationFile = null;
  if (certification) {
    const url = await uploadToCloudinary(certification, { folder: "gig_certifications" });
    certificationFile = {
      url,
      name: certification.name,
      type: certification.type,
      size: certification.size,
    };
  }

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

    // Upload profile picture
    // let profilePictureUrl = "";
    // const profilePictureFile = formData.get("profilePicture") as File;
    // if (profilePictureFile && profilePictureFile.size > 0) {
    //   const uploadResult = await uploadToCloudinary1(
    //     profilePictureFile,
    //     "profiles"
    //   );
    //   profilePictureUrl = uploadResult.url;
    // }
    let profilePictureUrl = null;
    const newProfilePicture = formData.get("profilePicture") as File;
    if (newProfilePicture && newProfilePicture.size > 0) {
      const url = await uploadToCloudinary(newProfilePicture, {
        folder: "profile_image",
      });
      profilePictureUrl = {
        url,
        name: newProfilePicture.name,
        type: newProfilePicture.type,
        size: newProfilePicture.size,
      };
    }

    const profile = new Profile({
      userId,
      fullName,
      profilePicture: profilePictureUrl,
      professionalSummary,
      interests,
      extracurricularActivities,
      certification: certificationFile,
      skills,
      currentSchool,
      degreeType,
      major,
      minor,
      graduationYear,
      pastEducation,
      averageRatings: 0,
      ratings: [],
    });

    const savedProfile = await profile.save();

    await User.findByIdAndUpdate(userId, {
      profileCompleted: true,
      profile: savedProfile,
    });

    const user = await User.findById(userId);

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role ?? "User",
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
    }).lean();

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

    const formData = await request.formData();

    const userId = formData.get("userId") as string;
    const fullName = formData.get("fullName") as string;
    const professionalSummary = formData.get("professionalSummary") as string;
    const interests = JSON.parse((formData.get("interests") as string) || "[]");
    const extracurricularActivities = formData.get(
      "extracurricularActivities"
    ) as string;
    const skills = JSON.parse((formData.get("skills") as string) || "[]");
    const currentSchool = formData.get("currentSchool") as string;
    const degreeType = formData.get("degreeType") as string;
    const major = formData.get("major") as string;
    const minor = formData.get("minor") as string;
    const graduationYear = formData.get("graduationYear") as string;
    const pastEducation = JSON.parse(
      (formData.get("pastEducation") as string) || "[]"
    );

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

    // Handle profile picture
    let profilePictureUrl = existingProfile.profilePicture;
    const newProfilePicture = formData.get("profilePicture") as File;
    if (newProfilePicture && newProfilePicture.size > 0) {
      const url = await uploadToCloudinary(newProfilePicture, {
        folder: "profile_image",
      });
      profilePictureUrl = {
        url,
        name: newProfilePicture.name,
        type: newProfilePicture.type,
        size: newProfilePicture.size,
      };
    }

    // Handle certifications
    const certificationFileList = [];

    const certificationFiles = formData.getAll("certifications");

    for (const cert of certificationFiles) {
      if (typeof cert === "string") {
        try {
          const parsed = JSON.parse(cert);
          if (parsed?.url && parsed?.name) {
            certificationFileList.push(parsed);
          }
        } catch (err) {
          console.error("Invalid certification JSON string:", err);
        }
      } else if (cert instanceof File && cert.size > 0) {
        const url = await uploadToCloudinary(cert, { folder: "certification" });
        certificationFileList.push({
          url,
          name: cert.name,
          type: cert.type,
          size: cert.size,
        });
      }
    }

    // Update the profile fields
    existingProfile.fullName = fullName;
    existingProfile.profilePicture = profilePictureUrl;
    existingProfile.professionalSummary = professionalSummary;
    existingProfile.interests = interests;
    existingProfile.extracurricularActivities = extracurricularActivities;
    existingProfile.certifications = certificationFileList;
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
