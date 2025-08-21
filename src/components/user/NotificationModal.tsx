"use client";

import { useState, useEffect, useRef } from "react";
import { Badge, Paper, IconButton, Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { formatTimeAgo } from "../../../utils/common";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { requestNotificationPermission } from "@/app/utils/notificationPermission";
import { notifySocket } from "../../../utils/socket";
import { Bell, CheckCheck, Clock, X } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationModal({ title }: { title?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLButtonElement>(null);
  const { user } = useUser();

  useEffect(() => {
    const initializeHeader = async () => {
      if (user?._id) {
        await requestNotificationPermission(user._id);
      }
    };

    initializeHeader();

    notifySocket.on("newNotification", (notif) => {
      if (notif) {
        setUnreadCount(notif.unreadCount);
        setNotifications((prev) => [notif, ...prev]);
      }
    });

    return () => {
      notifySocket.emit("unregister", user?._id);
    };
  }, [user?._id]);

  const handlePopover = (value: boolean) => {
    setNotificationOpen(value);
  };

  const fetchNotifications = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        "notifications?limit=20&sortBy=createdAt&sortOrder=desc"
      );
      if (response.ok && response.data.data) {
        setNotifications(response.data.data.notifications || []);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await apiRequest(`notifications?id=${notificationId}`, {
        method: "PATCH",
      });

      const notif = notifications.find((not) => not._id === notificationId);

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => prev - 1);
        if (notif) window.open(notif?.link, "_blank");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiRequest("notifications?markAll=true", {
        method: "PATCH",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [notificationOpen]);

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
                    onClick={markAllAsRead}
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

          <div className="overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 max-h-[calc(100vh)]">
            {loading ? (
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
                    key={notification._id}
                    className={`group transition-colors ${
                      notification.isRead
                        ? "bg-white hover:bg-gray-50"
                        : "bg-green-50/50 hover:bg-green-50"
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification._id);
                          // setUnreadCount(unreadCount - 1);
                        } else {
                          if (notification.link) {
                            window.open(notification.link, "_blank");
                          }
                        }
                      }}
                      className="w-full px-5 py-4 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse mr-2" />
                        )}
                        <span
                          className={`text-sm ${
                            notification.isRead
                              ? "font-normal"
                              : "font-semibold"
                          } text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors`}
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
        {title && <Typography className="pr-2" style={{ marginLeft: "-5px"}}>{title}</Typography>}
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      {renderPopover()}
    </>
  );
}
