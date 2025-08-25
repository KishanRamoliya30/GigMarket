import { Inbox } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { NOTIFICATION_MESSAGES } from "./constants";
import { NotificationListProps } from "@/app/utils/interfaces";

export default function NotificationList({
  notifications,
  onMarkAsRead,
  isMarkingRead,
  markingId,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="text-center py-12">
          <Inbox
            className="mx-auto h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {NOTIFICATION_MESSAGES.EMPTY_STATE}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {NOTIFICATION_MESSAGES.EMPTY_DESCRIPTION}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <ul
        className="divide-y divide-gray-200"
        role="list"
        aria-label="Notifications list"
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={`N${notification._id}`}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            isMarkingRead={isMarkingRead}
            markingId={markingId}
          />
        ))}
      </ul>
    </div>
  );
}
