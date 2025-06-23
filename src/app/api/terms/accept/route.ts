import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { verifyToken } from "@/app/utils/jwt";

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const userId  = await verifyToken(request)
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

    return NextResponse.json({
      message: "Terms accepted successfully",
      success: true,
      termsAcceptedAt: updatedUser.termsAcceptedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
