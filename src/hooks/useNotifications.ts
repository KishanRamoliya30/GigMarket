import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Notification } from "../app/(protected)/notifications/page";
import { useUser } from "@/context/UserContext";
import { getQueryClient } from "@/app/utils/reactQueryClient";

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchNotifications = async ({
  pageParam = 1,
  limit = 10,
}: {
  pageParam: number;
  limit: number;
}): Promise<NotificationsResponse> => {
  const response = await fetch(
    `/api/notifications?page=${pageParam}&limit=${limit}&sortBy=createdAt&sortOrder=desc`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data = await response.json();

  const pagination = data.pagination;

  return {
    notifications: data.data.notifications,
    unreadCount: data.data.unreadCount,
    total: pagination?.total || 0,
    page: pagination?.page || pageParam,
    limit: pagination?.limit || limit,
    totalPages: pagination?.totalPages || 1,
  };
};

const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  const response = await fetch(`/api/notifications?id=${notificationId}`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
};

const markAllNotificationsAsRead = async (): Promise<void> => {
  const response = await fetch(`/api/notifications?markAll=true`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
};

export const useNotifications = (limit = 10) => {
  const { unreadCount, setUnreadCount } = useUser();

  return useInfiniteQuery({
    queryKey: ["notifications", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchNotifications({ pageParam, limit });
      // Update unread count based on the fetched data
      if (result.unreadCount !== unreadCount) {
        setUnreadCount(result.unreadCount);
      }
      return result;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      const shouldFetch = nextPage <= lastPage.totalPages;
      return shouldFetch ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMarkNotificationAsRead = () => {
  const { unreadCount, setUnreadCount } = useUser();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      if (unreadCount > 0) {
        setUnreadCount(unreadCount - 1);
      }
    },
  });
};
export const useMarkAllAsRead = () => {
  const { setUnreadCount } = useUser();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setUnreadCount(0);
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications?limit=1", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }

      const data = await response.json();
      return data.data.unreadCount;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
