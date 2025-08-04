import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import paymentLogs from "@/app/models/paymentlog";
import Gigs from "@/app/models/gig";
import mongoose from "mongoose";
import { verifyToken } from "@/app/utils/jwt";
import { successResponse, withApiHandler } from "@/app/lib/commonHandlers";

export const GET = withApiHandler(async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const userDetails = await verifyToken(req);
  const userId = String(userDetails.userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const counts = await paymentLogs.aggregate([
    {
      $match: { createdBy: userObjectId }
    },
    {
      $group: {
        _id: "$gigId"
      }
    },
    {
      $lookup: {
        from: Gigs.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "gig"
      }
    },
    { $unwind: "$gig" },
    {
      $match: {
        "gig.status": { $in: ["In-Progress", "Assigned", "Completed", "Approved"] }
      }
    },
    {
      $group: {
        _id: null,
        inProgressCount: {
          $sum: {
            $cond: [
              { $in: ["$gig.status", ["In-Progress", "Assigned"]] },
              1,
              0
            ]
          }
        },
        completedCount: {
          $sum: {
            $cond: [
              { $in: ["$gig.status", ["Completed", "Approved"]] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        inProgressCount: 1,
        completedCount: 1
      }
    }
  ]);

  return successResponse(counts[0] || { inProgressCount: 0, completedCount: 0 }, "Gig counts fetched", 200);
});
