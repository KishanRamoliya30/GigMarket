import { initSocket, disconnectSocket } from "../utils/notificationSocketClient";

export const requestNotificationPermission = async (token?: string) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("Notifications not supported or running on server");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && token) {
      console.log("Notification permission granted");
      initSocket(token);
      return true;
    } else if (permission === "granted" && !token) {
      console.log("Notification permission granted but no token provided");
      return false;
    } else {
      console.log("Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const revokeNotificationPermission = () => {
  disconnectSocket();
};
