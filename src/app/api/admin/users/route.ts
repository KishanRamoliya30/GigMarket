import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '0', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const skip = page * limit;

  const [users, total] = await Promise.all([
    User.find({ isAdmin: false }).skip(skip).limit(limit),
    User.countDocuments({ isAdmin: false }),
  ]);

  return NextResponse.json({
    users,
    page:page+1,
    limit,
    totalPages: Math.ceil(total / limit),
    total,
  });
}
