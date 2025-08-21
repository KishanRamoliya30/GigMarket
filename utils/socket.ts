import { apiRequest } from "@/app/lib/apiCall";
import { io, Socket } from "socket.io-client";
export interface NotificationSocketInterface {
  receiverId: string;
  senderId: string;
  link?: string;
  title: string;
  message: string;
  isRead: boolean;
  unreadCount?: number;
  _id?: string;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  withCredentials: true,
  transports: ["websocket"],
});
export default socket;

export const notifySocket: Socket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_URL}/socket-notifications`
);

export const sendNotification = async (
  notification: NotificationSocketInterface
) => {
  try {
    apiRequest(`notifications`, {
      method: "POST",
      data: {
        title: notification.title,
        message: notification.message,
        link: notification.link,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
      },
    }).then(async (res) => {
      if (res.ok) {
        notifySocket.emit("sendNotification", {
          ...notification,
          createdAt: res.data.data.notification.createdAt,
          unreadCount: res.data.data.unreadCount,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};
