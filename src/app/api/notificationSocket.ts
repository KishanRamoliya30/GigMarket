import { Server as HTTPServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: {
      io?: IOServer;
    };
  };
};
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
}

const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    (socket as Socket & { user: UserPayload }).user = user;
    next();
  } catch {
    next(new Error("Authentication error"));
  }
};

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const httpServer: HTTPServer = res.socket.server as unknown as HTTPServer;
  const io = new IOServer(httpServer, { 
    path: "/api/socket_io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(authenticateSocket);

  io.on("connection", (socket: Socket) => {
    const userId = (socket as Socket & { user: UserPayload }).user.id;
    socket.join(userId);
    console.log(`User connected: ${userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  // Set global io instance
  global.io = io;
  res.socket.server.io = io;
  res.end();
}

export const emitNotification = (userId: string, notification: { message: string; type: string; createdAt: Date }) => {
  if (global.io) {
    global.io.to(userId).emit("new-notification", notification);
  }
};
