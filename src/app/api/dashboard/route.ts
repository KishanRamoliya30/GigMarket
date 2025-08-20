import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Notification from "@/app/models/notification";
import { verifyToken } from "@/app/utils/jwt";
import { successResponse } from "@/app/lib/commonHandlers";
import { ApiError } from "@/app/lib/commonError";

export async function GET(req: NextRequest) {
  await dbConnect();

  const userDetails = await verifyToken(req);
  if (!userDetails?.userId) {
    throw new ApiError("Unauthorized request", 401);
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5");
  const roleParam = searchParams.get("role");

  const role = roleParam || userDetails.role || "User";

  let query = {};
  if (role === "User") {
    query = { createdBy: userDetails.userId };
  } else if (role === "Provider") {
    query = { assignedTo: userDetails.userId };
  } else if (role === "Admin") {
    query = {};
  }

  const gigs = await Gig.find(query).sort({ createdAt: -1 }).lean();

  const postedServices = gigs.length;
  const completedServices = gigs.filter((g) => g.status === "Completed").length;
  const inQueueServices = gigs.filter((g) => g.status === "In-Progress").length;

  const reviews = gigs.reduce((sum, g) => sum + (g.reviews?.length || 0), 0);

  const gigStatusMap: Record<string, number> = {};
  gigs.forEach((g) => {
    gigStatusMap[g.status] = (gigStatusMap[g.status] || 0) + 1;
  });

  const gigStatusData = Object.entries(gigStatusMap).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const recentProjects = gigs.slice(0, limit).map((g) => ({
    _id: (g._id as any).toString(),
    title: g.title,
    description: g.description || "",
    cost: g.price || 0,
    status: g.status,
    createdAt: g.createdAt,
  }));

  const notifications = await Notification.find({ userId: userDetails.userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return successResponse(
    {
      stats: {
        postedServices,
        completedServices,
        inQueueServices,
        reviews,
      },
      gigStatusData,
      recentProjects,
      notifications,
    },
    "Dashboard data fetched successfully"
  );
}
