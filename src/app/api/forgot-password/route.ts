import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { sendOtpEmail } from "../../../../utils/sendOtpEmail";
import Otp from "@/app/models/otp";

interface ForgotPasswordRequestBody {
  email: string;
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
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json<ForgotPasswordError>(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json<ForgotPasswordError>(
        { error: "No user found with this email." },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP in MongoDB
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send OTP Email
    await sendOtpEmail({
      to: email,
      otp,
      username: user.name || "User",
    });

    return NextResponse.json<ForgotPasswordSuccess>({
      message: `OTP has been sent to your ${email}.`,
    });
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) errorMessage = error.message;

    return NextResponse.json<ForgotPasswordError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
