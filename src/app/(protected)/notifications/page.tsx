import { Metadata } from "next";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotificationsClient from "@/components/notification/NotificationsClient";
import { getQueryClient } from "@/app/utils/reactQueryClient";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your notifications",
};

export interface Notification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchNotifications(
  page = 1,
  limit = 10
): Promise<NotificationsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/notifications?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=desc`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      notifications: [],
      unreadCount: 0,
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

export default async function NotificationsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["notifications", 10],
    queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam, 10),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationsClient />
    </HydrationBoundary>
  );
}
