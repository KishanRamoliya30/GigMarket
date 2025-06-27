import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { sendOtpEmail } from "../../../../utils/sendOtpEmail";

interface ForgotPasswordRequestBody {
  email: string;
  isAdmin?: boolean;
}

interface ForgotPasswordSuccess {
  message: string;
}

interface ForgotPasswordError {
  error: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: ForgotPasswordRequestBody = await request.json();
    const { email,isAdmin } = reqBody;

    if (!email) {
      return NextResponse.json<ForgotPasswordError>(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email,isAdmin });

    if (!user) {
      return NextResponse.json<ForgotPasswordError>(
        { error: "No user found with this email." },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 mins

    try {
      await sendOtpEmail({
        to: email,
        otp,
        username: user.name || "User",
      });
    } catch (error: unknown) {
      let errorMessage = "Failed to send OTP email.";
      if (error instanceof Error) errorMessage = error.message;
      return NextResponse.json<ForgotPasswordError>(
        { error: errorMessage },
        { status: 500 }
      );
    }

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    const response = NextResponse.json<ForgotPasswordSuccess>({
      message: `OTP has been sent to your ${email}.`,
    });

    response.cookies.set({
      name: "email",
      value: email,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 10 * 60,
    });

    return response;
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) errorMessage = error.message;

    return NextResponse.json<ForgotPasswordError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
