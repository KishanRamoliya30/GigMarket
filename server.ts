import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import 'dotenv/config';
import dbConnect from './src/app/lib/dbConnect';

import Message from './src/app/models/message';
import Chat from './src/app/models/chat';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT || '3000');
const clientURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  await dbConnect();
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: [clientURL],
      methods: ['GET', 'POST'],
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

    socket.on("message", async ({ chatId, sender, message }) => {
      try {
        console.log("#####68")
        const newMessage = await Message.create({ chatId, sender, message });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: newMessage._id,
          updatedAt: Date.now(),
        });

        io.to(chatId).emit("newMessage", newMessage);
      } catch (err) {
        console.error("Message send error:", err);
      }
    });

    socket.on("mark-seen", async ({ chatId, userId }) => {
      try {
        const unseenMessages = await Message.find({ chatId, seenBy: { $ne: userId } });

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

  httpServer
    .once('error', err => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
