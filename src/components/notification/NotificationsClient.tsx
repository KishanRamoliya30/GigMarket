"use client";

import { Bell, CheckCheck } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllAsRead,
} from "@/hooks/useNotifications";
import { useEffect, useRef, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import NotificationList from "./NotificationList";
import { LoadMoreIndicator, ScrollSentinel } from "./LoadMoreIndicator";
import { LoadingState, ErrorState } from "./LoadingStates";
import { NOTIFICATIONS_LIMIT } from "./constants";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

export default function NotificationsClient() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useUser();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useNotifications(NOTIFICATIONS_LIMIT);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  useNotificationSocket({ limit: 10 });

  useEffect(() => {
    if (!loadMoreRef.current || isLoading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observerRef.current = observer;
    observer.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, isLoading]);

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markAsReadMutation.mutateAsync(notificationId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [markAsReadMutation]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [markAllAsReadMutation]);

  if (isLoading && notifications.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-green-600" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500" aria-live="polite">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending || unreadCount === 0}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
                <span>
                  {markAllAsReadMutation.isPending
                    ? "Marking..."
                    : "Mark all as read"}
                </span>
              </button>
            )}
          </div>
        </header>

        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          isMarkingRead={markAsReadMutation.isPending}
          markingId={markAsReadMutation.variables as string | undefined}
        />

        <LoadMoreIndicator
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          notificationsCount={notifications.length}
        />

        <ScrollSentinel
          ref={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
