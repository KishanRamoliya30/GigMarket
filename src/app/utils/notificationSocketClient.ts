import { io, Socket } from "socket.io-client";
import { INotification } from "../models/notification";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (socket) {
    // If socket already exists, disconnect it first
    socket.disconnect();
  }

  socket = io(window.location.origin, {
    path: "/api/socket_io",
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("🔌 Connected to socket server");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
  });

  socket.on("new-notification", (data: INotification) => {
    console.log("📩 New Notification:", data);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("new-notification", { detail: data }));
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("🔌 Socket reconnected after", attemptNumber, "attempts");
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
