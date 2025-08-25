import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { requestNotificationPermission } from "@/app/utils/notificationPermission";
import { getQueryClient } from "@/app/utils/reactQueryClient";
import { Notification } from "@/app/(protected)/notifications/page";
import { notifySocket } from "../../utils/socket";

interface UseNotificationSocketProps {
  limit?: number;
}

export const useNotificationSocket = ({
  limit = 10,
}: UseNotificationSocketProps = {}) => {
  const { user, setUnreadCount } = useUser();

  useEffect(() => {
    const initializeSocket = async () => {
      if (user?._id) {
        await requestNotificationPermission(user._id);
      }
    };

    initializeSocket();

    const handleNewNotification = (notif: Notification & { unreadCount: number }) => {
      if (notif) {
        setUnreadCount(notif?.unreadCount || 0);

        const queryClient = getQueryClient();
        queryClient.setQueryData(
          ["notifications", limit],
          {
            pages: [
              {
                notifications: [notif]
              }
            ]
          }
        );
      }
    };

    notifySocket.on("newNotification", handleNewNotification);

    return () => {
      notifySocket.emit("unregister", user?._id);
      notifySocket.off("newNotification", handleNewNotification);
    };
  }, [user?._id, limit, setUnreadCount]);
};
