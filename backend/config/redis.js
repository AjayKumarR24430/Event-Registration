const redis = require('redis');
const { logger } = require('../middlewares/logger');

let redisClient;

// Connect to Redis
const setupRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URI
    });

    redisClient.on('error', (error) => {
      logger.error(`Redis Error: ${error}`);
    });

    await redisClient.connect();
    logger.info('Redis connected');
    
    return redisClient;
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error.message}`);
    process.exit(1);
  }
};

// Get Redis client
const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

module.exports = { setupRedis, getRedisClient };