import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
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
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
