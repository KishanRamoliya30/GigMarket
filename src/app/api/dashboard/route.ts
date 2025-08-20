import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Gig from "@/app/models/gig";
import Notification from "@/app/models/notification";
import { verifyToken } from "@/app/utils/jwt";
import { successResponse } from "@/app/lib/commonHandlers";
import { ApiError } from "@/app/lib/commonError";

const userStatuses = [
  "Open",
  "Assigned",
  "Not-Assigned",
  "Approved",
  "Rejected",
];
const providerStatuses = ["Requested", "In-Progress", "Completed"];

const ICON_MAP: Record<string, string> = {
  postedServices: "WorkOutline",
  completedServices: "TaskAlt",
  inQueueServices: "HourglassEmpty",
  reviews: "RateReview",
};

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

  let stats = {
    postedServices: 0,
    completedServices: 0,
    inQueueServices: 0,
    reviews: 0,
  };

  if (role === "User") {
    stats = {
      postedServices: gigs.filter((g) => g.status === "Open").length,
      completedServices: gigs.filter((g) => g.status === "Approved").length,
      inQueueServices: gigs.filter((g) => g.status === "Assigned").length,
      reviews: gigs.reduce((sum, g) => sum + (g.reviews?.length || 0), 0),
    };
  } else if (role === "Provider") {
    stats = {
      postedServices: gigs.filter((g) => g.status === "Requested").length,
      completedServices: gigs.filter((g) => g.status === "Completed").length,
      inQueueServices: gigs.filter((g) => g.status === "In-Progress").length,
      reviews: gigs.reduce((sum, g) => sum + (g.reviews?.length || 0), 0),
    };
  }

  const statsCards = [
    {
      title: "Posted Services",
      value: stats.postedServices,
      iconKey: ICON_MAP.postedServices,
    },
    {
      title: "Completed Services",
      value: stats.completedServices,
      iconKey: ICON_MAP.completedServices,
    },
    {
      title: "In Queue Services",
      value: stats.inQueueServices,
      iconKey: ICON_MAP.inQueueServices,
    },
    { title: "Reviews", value: stats.reviews, iconKey: ICON_MAP.reviews },
  ];


  let allowedStatuses: string[] = [];
  if (role === "User") {
    allowedStatuses = userStatuses;
  } else if (role === "Provider") {
    allowedStatuses = providerStatuses;
  } else {
    allowedStatuses = [...new Set(gigs.map((g) => g.status))];
  }

  const gigStatusMap: Record<string, number> = {};
  gigs.forEach((g) => {
    if (allowedStatuses.includes(g.status)) {
      gigStatusMap[g.status] = (gigStatusMap[g.status] || 0) + 1;
    }
  });

  const gigStatusData = allowedStatuses.map((status) => ({
    name: status,
    value: gigStatusMap[status] || 0,
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
      stats,
      statsCards,
      gigStatusData,
      recentProjects,
      notifications,
    },
    "Dashboard data fetched successfully"
  );
}
