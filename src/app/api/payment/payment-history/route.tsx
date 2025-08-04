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
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = parseInt(searchParams.get("status") || "0");
  const skip = (page - 1) * limit;

  const gigStatusFilter =
    status === 0 ? ["In-Progress", "Assigned"] : ["Completed", "Approved"];

  const query = {
    createdBy: userObjectId,
  };

  const payments = await paymentLogs.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$gigId",
        payments: {
          $push: {
            amount: "$amount",
            date: "$createdAt",
            status: "$status",
          },
        },
        totalPaid: {
          $sum: {
            $cond: [{ $eq: ["$status", "Success"] }, "$amount", 0]
          }
        }
      },
    },
    {
      $lookup: {
        from: Gigs.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "gigDetails",
      },
    },
    { $unwind: "$gigDetails" },
    {
      $match: {
        "gigDetails.status": { $in: gigStatusFilter },
      },
    },
    {
      $lookup: {
        from: 'bids',
        let: { assignedBidId: "$gigDetails.assignedToBid" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$assignedBidId"]
              }
            }
          }
        ],
        as: 'bidInfo'
      }
    },
    {
      $unwind: {
        path: '$bidInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'bidInfo.createdBy',
        foreignField: '_id',
        as: 'provider'
      }
    },
    {
      $unwind: {
        path: '$provider',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'profiles',
        localField: 'provider.profile',
        foreignField: '_id',
        as: 'providerProfile'
      }
    },
    {
      $unwind: {
        path: '$providerProfile',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        gigId: "$_id",
        payments: 1,
        totalPaid: 1,
        gigTitle: "$gigDetails.title",
        gigAssigned: "$gigDetails.assignedToBid",
        gigDescription: "$gigDetails.description",
        gigStatus: "$gigDetails.status",
        gigPrice: "$gigDetails.price",
        createdAt: "$gigDetails.createdAt",
        createdBy: {
          fullName: "$providerProfile.fullName",
          profilePicture: "$providerProfile.profilePicture",
        },
      },
    },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    },
    {
      $addFields: {
        total: { $arrayElemAt: ["$totalCount.count", 0] }
      }
    }
  ]);

  const result = payments[0] || { data: [], total: 0 };
  const totalPages = Math.ceil(result.total / limit);

  return successResponse(
    result.data,
    "Payment history fetched",
    200,
    {
      page,
      limit,
      total: result.total,
      totalPages
    }
  );
});
