export const NOTIFICATIONS_LIMIT = 20;

export const NOTIFICATION_MESSAGES = {
  ERROR_LOADING: "Error loading notifications",
  EMPTY_STATE: "No notifications",
  EMPTY_DESCRIPTION:
    "You're all caught up! We'll notify you when something important happens.",
  LOADING_MORE: "Loading more notifications...",
  NO_MORE: "No more notifications to load",
  SCROLL_TO_LOAD: "Scroll to load more...",
  MARKING: "Marking...",
  MARK_ALL_READ: "Mark all as read",
  MARK_AS_READ: "Mark as read",
} as const;

export const ARIA_LABELS = {
  NOTIFICATIONS_HEADER: "Notifications",
  MARK_ALL_READ: "Mark all notifications as read",
  MARK_AS_READ: "Mark notification as read",
  LOADING_MORE: "Loading more notifications",
  NOTIFICATION_LINK: "View notification details",
} as const;
