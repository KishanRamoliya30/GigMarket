import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../models/user";
import dbConnect from "@/app/lib/dbConnect";

interface SignupRequestBody {
  email: string;
  password: string;
  termsAccepted: boolean;
}

interface SignupResponseSuccess {
  message: string;
  success: boolean;
  savedUser: unknown;
}

interface SignupResponseError {
  error: string;
}

async function sendEmailVerification(email: string) {
  // Simulate or use real email service
  console.log(`Sending verification email to: ${email}`);
}

export async function POST(request: Request): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: SignupRequestBody = await request.json();
    const { email, password, termsAccepted } = reqBody;

    // Terms check only
    if (!termsAccepted) {
      return NextResponse.json<SignupResponseError>(
        { error: "You must accept the Terms of Service." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json<SignupResponseError>(
        { error: "Looks like you already have an account. Please sign in." },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      termsAccepted,
      subscriptionCompleted: false,
      profileCompleted: false,
    });

    const savedUser = await newUser.save();

    await sendEmailVerification(email);

    return NextResponse.json<SignupResponseSuccess>({
      message: "User created successfully. Verification email sent.",
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json<SignupResponseError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
