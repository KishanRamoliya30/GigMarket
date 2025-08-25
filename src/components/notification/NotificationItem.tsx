import { Clock } from "lucide-react";
import { formatTimeAgo } from "../../../utils/common";
import Link from "next/link";
import { ARIA_LABELS } from "./constants";
import { NotificationItemProps } from "@/app/utils/interfaces";

export default function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingRead,
  markingId,
}: NotificationItemProps) {
  const isCurrentlyMarking = isMarkingRead && markingId === notification._id;

  const content = (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div
          className={`h-2 w-2 rounded-full mt-2 ${
            !notification.isRead ? "bg-green-600 animate-pulse" : "bg-gray-300"
          }`}
          role="status"
          aria-label={
            !notification.isRead ? "Unread notification" : "Read notification"
          }
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p
            className={`text-sm font-medium group-hover:text-green-600 ${
              !notification.isRead ? "text-gray-900" : "text-gray-700"
            }`}
          >
            {notification.title}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
            <time dateTime={notification.createdAt}>
              {formatTimeAgo(notification.createdAt)}
            </time>
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {notification.message}
        </p>

        {!notification.isRead && (
          <div className="mt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onMarkAsRead(notification._id);
              }}
              disabled={isMarkingRead}
              className="text-xs font-medium text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`${ARIA_LABELS.MARK_AS_READ}: ${notification.title}`}
            >
              {isCurrentlyMarking ? "Marking..." : "Mark as read"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <li
        className={`p-4 hover:bg-gray-50 transition-colors ${
          !notification.isRead ? "bg-green-50/30" : ""
        }`}
      >
        <Link
          href={notification.link}
          className="block"
          aria-label={`${ARIA_LABELS.NOTIFICATION_LINK}: ${notification.title}`}
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li
      className={`p-4 group hover:bg-gray-50 transition-colors ${
        !notification.isRead ? "bg-green-50/30" : ""
      }`}
    >
      {content}
    </li>
  );
}
