import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";

interface ResetPasswordRequestBody {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordSuccess {
  message: string;
}

interface ResetPasswordError {
  error: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: ResetPasswordRequestBody = await request.json();
    const { email, newPassword, confirmPassword } = reqBody;

    if (!email || !newPassword || !confirmPassword) {
      return NextResponse.json<ResetPasswordError>(
        { error: "Email and both password fields are required." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json<ResetPasswordError>(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json<ResetPasswordError>(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // ✅ Hash the new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json<ResetPasswordSuccess>({
      message: "Password has been reset successfully.",
    });
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message || "Something went wrong."
        : "Something went wrong.";
    return NextResponse.json<ResetPasswordError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
