const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const env = require("./env");
const User = require("../modules/user/user.model");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        env.CLIENT_URL || "http://localhost:4000",
        env.ADMIN_URL || "http://localhost:4001",
      ],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user || !user.isActive) {
        return next(new Error("User not found or inactive"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    socket.join(`user:${socket.user._id}`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("send-message", (data) => {
      const message = {
        id: Date.now().toString(),
        userId: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
        content: data.content,
        room: data.room,
        timestamp: new Date(),
      };

      io.to(data.room).emit("new-message", message);
    });

    socket.on("typing", (data) => {
      socket.to(data.room).emit("user-typing", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.room).emit("user-stop-typing", {
        userId: socket.user._id,
      });
    });

    socket.on("notification", (data) => {
      io.to(`user:${data.userId}`).emit("notification", {
        title: data.title,
        body: data.body,
        type: data.type,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

module.exports = { initSocket, getIO, emitToUser, emitToRoom };
