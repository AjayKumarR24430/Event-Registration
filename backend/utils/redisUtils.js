const { getRedisClient } = require('../config/redis');
const { logger } = require('../middlewares/logger');

// Cache TTL in seconds
const DEFAULT_EXPIRATION = 3600; // 1 hour

// Cache data in Redis
const cacheData = async (key, data, expiration = DEFAULT_EXPIRATION) => {
  try {
    const redisClient = getRedisClient();
    await redisClient.setEx(key, expiration, JSON.stringify(data));
    logger.info(`Data cached with key: ${key}`);
    return true;
  } catch (error) {
    logger.error(`Redis cache error: ${error.message}`);
    return false;
  }
};

// Get cached data from Redis
const getCachedData = async (key) => {
  try {
    const redisClient = getRedisClient();
    const data = await redisClient.get(key);
    
    if (data) {
      logger.info(`Cache hit for key: ${key}`);
      return JSON.parse(data);
    }
    
    logger.info(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    logger.error(`Redis get error: ${error.message}`);
    return null;
  }
};

// Delete cached data
const deleteCachedData = async (key) => {
  try {
    const redisClient = getRedisClient();
    await redisClient.del(key);
    logger.info(`Cache deleted for key: ${key}`);
    return true;
  } catch (error) {
    logger.error(`Redis delete error: ${error.message}`);
    return false;
  }
};

// Update event availability in cache
const updateEventAvailability = async (eventId, change) => {
  try {
    const redisClient = getRedisClient();
    const eventKey = `event:${eventId}`;
    
    // Try to get the cached event
    const cachedEvent = await getCachedData(eventKey);
    
    if (cachedEvent) {
      // Update available spots
      cachedEvent.availableSpots += change;
      await cacheData(eventKey, cachedEvent);
    }
    
    // Also update the events list cache if it exists
    const eventsListKey = 'events:list';
    const cachedEvents = await getCachedData(eventsListKey);
    
    if (cachedEvents) {
      const eventIndex = cachedEvents.findIndex(event => event._id.toString() === eventId);
      
      if (eventIndex !== -1) {
        cachedEvents[eventIndex].availableSpots += change;
        await cacheData(eventsListKey, cachedEvents);
      }
    }
    
    return true;
  } catch (error) {
    logger.error(`Redis update availability error: ${error.message}`);
    return false;
  }
};

module.exports = {
  cacheData,
  getCachedData,
  deleteCachedData,
  updateEventAvailability
};