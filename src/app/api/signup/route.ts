import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../models/user";
import dbConnect from "@/app/lib/dbConnect";
import { generateToken } from "@/app/utils/jwt";
import { sendVerificationEmail } from "../../../../utils/emailService";

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

    // Check if terms are accepted
    if (!termsAccepted) {
      return NextResponse.json<SignupResponseError>(
        { error: "You must accept the Terms of Service." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json<SignupResponseError>(
        { error: "Looks like you already have an account. Please sign in." },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      email,
      password: hashedPassword,
      termsAccepted,
      subscriptionCompleted: false,
      profileCompleted: false,
      termsAcceptedAt: new Date(),
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken({
      userId: savedUser._id,
      email: savedUser.email,
      isAdmin: false
    });

    // Send verification email

    try {
      await sendVerificationEmail(email, token);
    } catch (error) {
      console.log("Failed to send verification email error", error)
      return NextResponse.json<SignupResponseError>(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }
    await sendEmailVerification(email);

    const response = NextResponse.json<SignupResponseSuccess>({
      message: "User created successfully. Verification email sent.",
      success: true,
      savedUser,
    });
  
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 ,
    });
    return response;
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
