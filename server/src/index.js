require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./services/redis.service');
const { initSocket } = require('./sockets');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await connectDB();
    await connectRedis();

    const server = http.createServer(app);

    initSocket(server);
    logger.info('✅ Socket.io initialized');

    server.listen(PORT, () => {
      logger.info(`🚀 DevPulse server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();