import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { generateToken } from "@/app/utils/jwt";
import { expiryTime } from "../../../../../utils/constants";

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { termsAcceptedAt: new Date() },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = generateToken({
      userId: updatedUser._id,
      email: updatedUser.email,
      role: "User"
    });
    const response = NextResponse.json({
      message: "Login successful.",
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
      },
      hasSubscription: updatedUser.subscriptionCompleted,
    });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: expiryTime,
    });
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
