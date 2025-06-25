import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import Otp from "@/app/models/otp";

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

    const record = await Otp.findOne({ email });

    if (!record) {
      return NextResponse.json<VerifyOtpError>(
        { error: "OTP not found or expired." },
        { status: 404 }
      );
    }

    const now = Date.now();

    if (now > new Date(record.expiresAt).getTime()) {
      await Otp.deleteOne({ email });
      return NextResponse.json<VerifyOtpError>(
        { error: "OTP has expired." },
        { status: 410 }
      );
    }

    if (record.otp !== otp) {
      return NextResponse.json<VerifyOtpError>(
        { error: "Invalid OTP." },
        { status: 401 }
      );
    }

    // ✅ OTP verified
    await Otp.deleteOne({ email }); // Clean up OTP entry

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
