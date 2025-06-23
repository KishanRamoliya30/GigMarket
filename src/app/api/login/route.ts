import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import User from "../../models/user"; 
import { generateToken } from "@/app/utils/jwt";
interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseSuccess {
  message: string;
  success: boolean;
  user: {
    id: string;
    email: string;
  };
}

interface LoginResponseError {
  error: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: LoginRequestBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json<LoginResponseError>(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }


    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json<LoginResponseError>(
        { error: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }


    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json<LoginResponseError>(
        { error: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }
 
    const getUserObject = () => {
      const { _id, password, ...newUser } = user;
      return newUser;
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    const response = NextResponse.json<LoginResponseSuccess>({
      message: "Login successful.",
      success: true,
      user: getUserObject(),
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
    return NextResponse.json<LoginResponseError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
