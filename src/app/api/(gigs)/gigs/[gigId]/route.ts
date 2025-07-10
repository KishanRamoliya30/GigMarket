import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import { ApiError } from "@/app/lib/commonError";
import { successResponse } from "@/app/lib/commonHandlers";
import User from "@/app/models/user";
export async function GET(req: NextRequest,{ params }: { params: { gigId: string } }) {

    await dbConnect();
    const {gigId}=params
    if (!gigId) {
        throw new ApiError("Gig ID is required", 400);
    }
    const gig = await Gig.findById(gigId);
    if (!gig) {
        throw new ApiError("Gig not found", 404);
    }
    const user = await User.findById(gig.createdBy).select("firstName lastName profilePicture");
    return successResponse({gig,user}, "Gig retrieved successfully");

  }