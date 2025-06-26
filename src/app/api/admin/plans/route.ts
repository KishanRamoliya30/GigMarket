import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

export async function PATCH(req: NextResponse) {
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