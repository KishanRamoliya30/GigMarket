import { notifySocket } from "../../../utils/socket";
export const requestNotificationPermission = async (userId?: string) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("Notifications not supported or running on server");
    notifySocket.emit("disconnect");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && userId) {
      console.log("Notification permission granted");
      if (notifySocket.connected && notifySocket.hasListeners("register")) {
        return true;
      }
      notifySocket.emit("register", userId);
      return true;
    } else if (permission === "granted" && !userId) {
      console.log("Notification permission granted but no token provided");
      notifySocket.emit("disconnect");
      return false;
    } else {
      console.log("Notification permission denied");
      notifySocket.emit("disconnect");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    notifySocket.emit("disconnect");
    return false;
  }
};
