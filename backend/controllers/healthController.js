const mongoose = require('mongoose');
const { getRedisClient } = require('../config/redis');
const { logger } = require('../middlewares/logger');

// Health check endpoint
// @route   GET /api/health
// @access  Public
exports.checkHealth = async (req, res, next) => {
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date(),
      services: {
        server: {
          status: 'ok',
          uptime: process.uptime()
        },
        database: {
          status: 'unknown'
        },
        redis: {
          status: 'unknown'
        }
      }
    };

    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.database.status = 'ok';
    } else {
      healthStatus.services.database.status = 'error';
      healthStatus.status = 'error';
      logger.error('Health check: MongoDB connection error');
    }

    // Check Redis connection with timeout
    try {
      // Add a timeout to prevent hanging
      const redisPromise = new Promise(async (resolve, reject) => {
        try {
          const redisClient = getRedisClient();
          const pingResult = await redisClient.ping();
          resolve(pingResult);
        } catch (error) {
          reject(error);
        }
      });
      
      // Set a timeout of 2 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis health check timeout')), 2000)
      );
      
      // Race the promises
      const pingResult = await Promise.race([redisPromise, timeoutPromise]);
      
      if (pingResult === 'PONG') {
        healthStatus.services.redis.status = 'ok';
      } else {
        healthStatus.services.redis.status = 'error';
        healthStatus.status = 'error';
        logger.error('Health check: Redis returned unexpected response');
      }
    } catch (error) {
      healthStatus.services.redis.status = 'error';
      healthStatus.status = 'error';
      logger.error(`Health check: Redis connection error - ${error.message}`);
    }

    // Set appropriate status code
    const statusCode = healthStatus.status === 'ok' ? 200 : 503; // 503 Service Unavailable

    res.status(statusCode).json(healthStatus);
  } catch (err) {
    logger.error(`Health check error: ${err.message}`);
    next(err);
  }
};

// Detailed Health Check
// @route   GET /api/health/details
// @access  Private/Admin
exports.checkDetailedHealth = async (req, res, next) => {
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
      server: {
        status: 'ok',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        pid: process.pid
      },
      database: {
        status: 'unknown',
        connection: {
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        }
      },
      redis: {
        status: 'unknown'
      }
    };

    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthStatus.database.status = 'ok';
      
      // Get some DB stats if possible
      try {
        const dbStats = await mongoose.connection.db.stats();
        healthStatus.database.stats = {
          collections: dbStats.collections,
          objects: dbStats.objects,
          avgObjSize: dbStats.avgObjSize,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexes: dbStats.indexes,
          indexSize: dbStats.indexSize
        };
      } catch (error) {
        logger.warn(`Could not retrieve MongoDB stats: ${error.message}`);
      }
    } else {
      healthStatus.database.status = 'error';
      healthStatus.status = 'error';
      logger.error('Detailed health check: MongoDB connection error');
    }

    // Check Redis connection with timeout
    try {
      // Add a timeout to prevent hanging
      const redisPromise = new Promise(async (resolve, reject) => {
        try {
          const redisClient = getRedisClient();
          const pingResult = await redisClient.ping();
          
          if (pingResult === 'PONG') {
            // Collect basic info - with timeout for each operation
            const infoPromise = new Promise(async (resolve, reject) => {
              try {
                const info = {
                  version: 'unknown',
                  uptime: 'unknown',
                  connectedClients: 'unknown',
                  usedMemory: 'unknown'
                };
                
                try {
                  // Try to get server info with timeout
                  const serverInfo = await Promise.race([
                    redisClient.info('server'),
                    new Promise((_, r) => setTimeout(() => r('timeout'), 1000))
                  ]);
                  
                  if (serverInfo !== 'timeout') {
                    const versionMatch = serverInfo.match(/redis_version:(.*?)(\r\n|\n|$)/);
                    if (versionMatch) info.version = versionMatch[1].trim();
                    
                    const uptimeMatch = serverInfo.match(/uptime_in_seconds:(.*?)(\r\n|\n|$)/);
                    if (uptimeMatch) info.uptime = uptimeMatch[1].trim();
                  }
                } catch (e) {
                  logger.warn(`Redis server info error: ${e.message}`);
                }
                
                try {
                  // Try to get clients info with timeout
                  const clientsInfo = await Promise.race([
                    redisClient.info('clients'),
                    new Promise((_, r) => setTimeout(() => r('timeout'), 1000))
                  ]);
                  
                  if (clientsInfo !== 'timeout') {
                    const clientsMatch = clientsInfo.match(/connected_clients:(.*?)(\r\n|\n|$)/);
                    if (clientsMatch) info.connectedClients = clientsMatch[1].trim();
                  }
                } catch (e) {
                  logger.warn(`Redis clients info error: ${e.message}`);
                }
                
                try {
                  // Try to get memory info with timeout
                  const memoryInfo = await Promise.race([
                    redisClient.info('memory'),
                    new Promise((_, r) => setTimeout(() => r('timeout'), 1000))
                  ]);
                  
                  if (memoryInfo !== 'timeout') {
                    const memoryMatch = memoryInfo.match(/used_memory_human:(.*?)(\r\n|\n|$)/);
                    if (memoryMatch) info.usedMemory = memoryMatch[1].trim();
                  }
                } catch (e) {
                  logger.warn(`Redis memory info error: ${e.message}`);
                }
                
                resolve(info);
              } catch (error) {
                reject(error);
              }
            });
            
            // Set a timeout of 5 seconds for the entire info collection
            const infoTimeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Redis info collection timeout')), 5000)
            );
            
            const redisInfo = await Promise.race([infoPromise, infoTimeoutPromise]);
            resolve({ pingResult, redisInfo });
          } else {
            resolve({ pingResult, error: 'Unexpected ping response' });
          }
        } catch (error) {
          reject(error);
        }
      });
      
      // Set a timeout of 8 seconds for the entire Redis check
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis detailed health check timeout')), 8000)
      );
      
      // Race the promises
      const result = await Promise.race([redisPromise, timeoutPromise]);
      
      if (result.pingResult === 'PONG') {
        healthStatus.redis.status = 'ok';
        healthStatus.redis.info = result.redisInfo;
      } else {
        throw new Error(result.error || 'Redis check failed');
      }
    } catch (error) {
      healthStatus.redis.status = 'error';
      healthStatus.status = 'error';
      healthStatus.redis.error = error.message;
      logger.error(`Detailed health check: Redis connection error - ${error.message}`);
    }

    // Set appropriate status code
    const statusCode = healthStatus.status === 'ok' ? 200 : 503; // 503 Service Unavailable

    res.status(statusCode).json(healthStatus);
  } catch (err) {
    logger.error(`Detailed health check error: ${err.message}`);
    next(err);
  }
};