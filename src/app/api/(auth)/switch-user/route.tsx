import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { jwtVerify } from "jose";
import { generateToken } from "@/app/utils/jwt";
import User from "@/app/models/user";



interface LoginResponseError {
  error: string;
}
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const { payload } = await jwtVerify(
      request.cookies.get("token")?.value ?? "",
      getSecret()
    );
    const user = await User.findOne({ _id: payload.userId });  
    
    if ((user.subscription?.planType ?? 0) > 1) {
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: payload.role == "User" ? "Provider" : "User",
      });
      const response = NextResponse.json({
        message: "Switch User successful.",
        success: true,
      });

      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
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
