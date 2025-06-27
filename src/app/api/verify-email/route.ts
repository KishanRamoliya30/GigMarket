import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      console.warn("No token provided");
      return NextResponse.json(
        { error: "Token is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      console.warn("Invalid or expired token");
      return NextResponse.json(
        { error: "Invalid verification token." },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User is already verified." },
        { status: 409 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const response = NextResponse.json({
      message: "Email verified successfully.",
      ok: true,
      status: 200,
    });

    response.cookies.set("isVerified", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error.",
        ok: false,
        status: 500,
      },
      { status: 500 }
    );
  }
}
