"use client";

import { useState, useRef, useCallback } from "react";
import { Badge, Paper, IconButton, Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
import { useUser } from "@/context/UserContext";
import { formatTimeAgo } from "../../../utils/common";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { ArrowRight, Bell, CheckCheck, Clock, X } from "lucide-react";
import Link from "next/link";
import {
  useMarkAllAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { NOTIFICATIONS_LIMIT } from "./constants";


export default function NotificationModal({ title }: { title?: string }) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLButtonElement>(null);
  const { unreadCount } = useUser();

  const { data, isLoading } = useNotifications(NOTIFICATIONS_LIMIT);
  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  useNotificationSocket({ limit: 10 });
 
  const handlePopover = (value: boolean) => {
    setNotificationOpen(value);
  };

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

  const renderPopover = () => {
    return (
      <Popover
        anchorEl={notificationRef.current}
        open={notificationOpen}
        onClose={() => handlePopover(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 350,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Paper elevation={0}>
          <div className="sticky top-0 z-10 p-3 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-bold text-gray-900 pl-[6px]">
                Notifications
              </h4>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors rounded-full hover:bg-green-50 cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => handlePopover(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 ">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-green-500 border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <li
                    key={`modal-${notification._id}`}
                    className={`group transition-colors ${
                      notification.isRead
                        ? "bg-white hover:bg-gray-50"
                        : "bg-green-50/50 hover:bg-green-50"
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification._id);
                        } else {
                          if (notification.link) {
                            window.open(notification.link, "_blank");
                          }
                        }
                      }}
                      className="w-full px-5 py-4 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        {!notification.isRead ? (
                          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse mr-2" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                        )}
                        <span
                          className={`text-sm ${
                            notification.isRead
                              ? "font-normal"
                              : "font-semibold"
                          } text-gray-900 text-left line-clamp-1 group-hover:text-green-600 transition-colors`}
                        >
                          {notification.title}
                        </span>
                      </div>
                      <div className="flex flex-row w-full justify-between items-start mt-2">
                        <p
                          className="text-xs text-gray-600 text-start line-clamp-2 mr-3 flex-1"
                          title={
                            notification.message.length > 34
                              ? notification.message
                              : undefined
                          }
                        >
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
                {notifications.length >= 10 && (
                  <li
                    key="view"
                    className="group transition-colors bg-white border-t border-gray-100"
                    onClick={() => setNotificationOpen(false)}
                  >
                    <Link
                      href="/notifications"
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-gray-700 hover:text-green-600 transition-all duration-200 group-hover:bg-gray-50"
                    >
                      <span>View All Notifications</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        </Paper>
      </Popover>
    );
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="show notifications"
        color="inherit"
        className="p-0"
        onClick={() => {
          handlePopover(true);
        }}
        ref={notificationRef}
      >
        {title && (
          <Typography className="pr-2" style={{ marginLeft: "-5px" }}>
            {title}
          </Typography>
        )}
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      {renderPopover()}
    </>
  );
}
