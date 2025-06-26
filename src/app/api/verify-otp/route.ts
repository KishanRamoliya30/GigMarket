import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
// import Otp from "@/app/models/otp";

interface VerifyOtpRequestBody {
  email: string;
  otp: string;
}

interface VerifyOtpSuccess {
  message: string;
}

interface VerifyOtpError {
  error: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: VerifyOtpRequestBody = await request.json();
    const { email, otp } = reqBody;

    if (!email || !otp) {
      return NextResponse.json<VerifyOtpError>(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json<VerifyOtpError>(
        { error: "User not found." },
        { status: 404 }
      );
    }
    // // OTP verified
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
        return NextResponse.json<VerifyOtpError>(
        { error: "No OTP request found" },
        { status: 404 }
      );
  }

  if (user.resetPasswordOTP !== otp) {
     return NextResponse.json<VerifyOtpError>(
        { error: "Invalid OTP" },
        { status: 404 }
      );
  }

  if (new Date() > new Date(user.resetPasswordOTPExpiry)) {
    return NextResponse.json<VerifyOtpError>(
        { error: "OTP has been expired" },
        { status: 404 }
      );
  }

    return NextResponse.json<VerifyOtpSuccess>({
      message: "OTP verified successfully.",
    });
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) errorMessage = error.message;

    return NextResponse.json<VerifyOtpError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
