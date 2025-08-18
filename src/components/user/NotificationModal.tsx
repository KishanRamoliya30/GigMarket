"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Badge,
  Popover,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiRequest } from "@/app/lib/apiCall";
import { useUser } from "@/context/UserContext";
import { formatTimeAgo } from "../../../utils/common";

interface Notification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationModalProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  anchorEl,
  open,
  onClose,
}: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  const fetchNotifications = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        "notifications?limit=20&sortBy=createdAt&sortOrder=desc"
      );
      if (response.ok && response.data) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
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

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
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
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
        <Box p={2} borderBottom="1px solid" borderColor="divider">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
              Notifications
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {unreadCount > 0 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={markAllAsRead}
                  sx={{ textTransform: "none", fontSize: "0.75rem" }}
                >
                  Mark all read
                </Button>
              )}
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  marginLeft: "auto",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            {unreadCount} unread{" "}
            {unreadCount === 1 ? "notification" : "notifications"}
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 320, overflow: "auto" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="0.875rem"
              >
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  disablePadding
                  sx={{
                    bgcolor: notification.isRead
                      ? "transparent"
                      : "action.hover",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                      if (notification.link) {
                        window.open(notification.link, "_blank");
                      }
                      onClose();
                    }}
                    sx={{ py: 1.5, px: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={notification.isRead ? 400 : 600}
                            fontSize="0.875rem"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Badge
                              variant="dot"
                              color="primary"
                              sx={{ ml: 0.5 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize="0.75rem"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.25, display: "block" }}
                          >
                            {formatTimeAgo(notification.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Popover>
  );
}
