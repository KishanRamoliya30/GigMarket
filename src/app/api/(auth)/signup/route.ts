import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import { generateToken } from "@/app/utils/jwt";
import User from "@/app/models/user";
import { sendVerificationEmail } from "../../../../../utils/emailService";


interface SignupRequestBody {
  firstName: string;
  lastName: string;
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

export async function POST(request: Request): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: SignupRequestBody = await request.json();
    const { firstName, lastName, email, password, termsAccepted } = reqBody;

    if (!termsAccepted) {
      return NextResponse.json<SignupResponseError>(
        { error: "You must accept the Terms of Service." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json<SignupResponseError>(
        { error: "Looks like you already have an account. Please sign in." },
        { status: 400 }
      );
    }

    const verificationToken = generateToken({
      email,
      purpose: "verify-email",
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      termsAccepted,
      subscriptionCompleted: false,
      profileCompleted: false,
      termsAcceptedAt: new Date(),
      isVerified: false,
      verificationToken,
    });

    const savedUser = await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error("Failed to send verification email", error);
      return NextResponse.json<SignupResponseError>(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    const userResponse = savedUser.toObject
      ? savedUser.toObject()
      : { ...savedUser };
    if (userResponse.password) delete userResponse.password;

    const response = NextResponse.json<SignupResponseSuccess>({
      message: "User created successfully. Please check your email to verify your account.",
      success: true,
      savedUser: userResponse,
    });

    // response.cookies.set({
    //   name: "token",
    //   value: verificationToken,
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/"
    // });

   response.cookies.set("isVerified", "true", {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
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
