import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "dotenv/config";
import dbConnect from "./src/app/lib/dbConnect";

import Message from "./src/app/models/message";
// import Chat from './src/app/models/chat';

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT || "3000");
const clientURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173";

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

interface NotificationSocketInterface {
  receiverId: string;
  senderId: string;
  link?: string;
  title: string;
  message: string;
  isRead: boolean;
  unreadCount: number;
  _id?: string;
}

app.prepare().then(async () => {
  await dbConnect();
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: [clientURL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("leave", (chatId) => {
      socket.leave(chatId);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    // socket.on("message", async ({ chatId, sender, message }) => {
    //   try {
    //     const newMessage = await Message.create({ chatId, sender, message });

    //     await Chat.findByIdAndUpdate(chatId, {
    //       lastMessage: newMessage._id,
    //       updatedAt: Date.now(),
    //     });

    //     io.to(chatId).emit("newMessage", newMessage);
    //   } catch (err) {
    //     console.error("Message send error:", err);
    //   }
    // });

    socket.on("message", async ({ chatId, message }) => {
      io.to(chatId).emit("newMessage", message);
      // try {
      //   const newMessage = await Message.create({ chatId, sender, message });

      //   await Chat.findByIdAndUpdate(chatId, {
      //     lastMessage: newMessage._id,
      //     updatedAt: Date.now(),
      //   });

      // } catch (err) {
      //   console.error("Message send error:", err);
      // }
    });

    socket.on("update-message", async (updatedMessage) => {
      try {
        if (!updatedMessage?._id) {
          console.error("update-message missing _id");
          return;
        }

        const chatId = String(updatedMessage.chatId);
        if (!chatId) {
          console.error("update-message missing chatId");
          return;
        }

        // Broadcast to everyone else in the chat room
        socket.to(chatId).emit("message-updated", {
          ...updatedMessage,
          _id: String(updatedMessage._id),
          chatId,
        });
      } catch (err) {
        console.error("Error handling update-message:", err);
      }
    });

    socket.on("mark-seen", async ({ chatId, userId }) => {
      try {
        const unseenMessages = await Message.find({
          chatId,
          seenBy: { $ne: userId },
        });

        for (const msg of unseenMessages) {
          msg.seenBy.push(userId);
          await msg.save();
          io.to(chatId).emit("seen-update", { messageId: msg._id, userId });
        }
      } catch (err) {
        console.error("Seen update error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  const notifyNamespace = io.of("/socket-notifications");

  notifyNamespace.on("connection", (socket) => {
    console.log(`Notification Socket Connected: ${socket.id}`);

    socket.on("register", (userId: string) => {
      if (!userId) {
        console.warn(
          `[Notififcation Socket] Invalid userId received from ${socket.id}`
        );
        return;
      }

      socket.join(userId);
      console.log(
        `[Notification Socket] User ${userId} registered (socket: ${socket.id})`
      );
    });

    socket.on("sendNotification", async (data: NotificationSocketInterface) => {
      const { senderId, receiverId, title } = data;
      const nsockets = await notifyNamespace.in(receiverId).allSockets();
      if (nsockets.size > 0) {
        notifyNamespace.to(receiverId).emit("newNotification", data);
      }
      console.log(
        `[Notification Socket] Notification sent: ${senderId} → ${receiverId} | ${title}`
      );
    });

    socket.on("unregister", (userId: string) => {
      if (!userId) return;
      socket.leave(userId);
      console.log(
        `[Notification Socket] User ${userId} unregistered (socket: ${socket.id})`
      );
    });

    socket.on("disconnect", () => {
      console.log(`[Notification Socket] Disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
