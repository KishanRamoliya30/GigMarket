import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { generateToken } from "@/app/utils/jwt";
interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  success?: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const { email, password }: LoginRequestBody = await request.json();

    if (!email || !password) {
      return NextResponse.json<LoginResponse>(
        {
          message: "Validation Failed",
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
 
    if (!user || !user.isAdmin) {
      return NextResponse.json<LoginResponse>(
        {
          message: "Unauthorized Access",
          error: "Only admin users are allowed to log in.",
        },
        { status: 403 }
      );
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json<LoginResponse>(
        {
          message: "Login Failed",
          error: "Invalid credentials.",
        },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      isAdmin: true
    });
    const response = NextResponse.json<LoginResponse>({
      message: "Admin login successful.",
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
    response.cookies.set({
      name: 'role',
      value: 'Main',
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 ,
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    return NextResponse.json<LoginResponse>(
      {
        message: "Server Error",
        error: message,
      },
      { status: 500 }
    );
  }
}
