import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://vectolio.com",
    "https://tcenter.vectolio.com",
  ];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    // console.log("New client connected", socket.id);

    // Client joins a room with their userId to receive targeted notifications
    socket.on("join", (userId: string) => {
      socket.join(userId);
      // console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      // console.log("Client disconnected", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
