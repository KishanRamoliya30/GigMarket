import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";

interface ResetPasswordRequestBody {
  email: string;
  newPassword: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: ResetPasswordRequestBody = await request.json();
    const { email, newPassword } = reqBody;

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "Please verify your email with otp." },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;

    user.password = hashedPassword;
    await user.save();

    // Create response and delete the cookie
    const response = NextResponse.json({
      message: "Password has been reset successfully.",
    });

    response.cookies.set({
      name: "email",
      value: "",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message || "Something went wrong."
        : "Something went wrong.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
