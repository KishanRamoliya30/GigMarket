import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";
import Plan from "@/app/models/plans";

export async function GET() {
  try {
    await dbConnect();
    
    const plans = await Plan.find();
    return NextResponse.json({ success: true, data: plans });
  } catch (err) {
    console.error("Fetch plans error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
    try {
      await dbConnect();
      const body = await req.json();
      const { _id, name, price, description, benefits } = body;
  
      if (!_id) {
        return NextResponse.json({ success: false, message: "Missing plan ID" }, { status: 400 });
      }
  
      const db = mongoose.connection.db;
      if (!db) throw new Error("DB not connected");
  
      const result = await db.collection("plans").updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
          $set: {
            name,
            price,
            description,
            benefits,
          },
        }
      );
  
      return NextResponse.json({ success: true, updated: result.modifiedCount });
    } catch (err) {
      console.error("PATCH /admin/plans error:", err);
      return NextResponse.json(
        { success: false, message: "Failed to update plan" },
        { status: 500 }
      );
    }
  }