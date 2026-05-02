const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { subscribe } = require('../services/redis.service');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      socket.username = decoded.username;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.username}`);
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.username}`);
    });
  });

  // Redis → Socket.io bridge
  subscribe('activity:new', (event) => {
    io.to(`user:${event.userId}`).emit('activity:new', event);
  });

  subscribe('notification:new', (event) => {
    io.to(`user:${event.userId}`).emit('notification:new', event);
  });

  return io;
};

const emitToUser = (userId, event, data) => {
  if (io) io.to(`user:${userId}`).emit(event, data);
};

module.exports = { initSocket, emitToUser };