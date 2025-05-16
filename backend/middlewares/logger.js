const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger with different transports based on environment
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // Always use Console transport
    new winston.transports.Console(),
    
    // Only use File transport in development
    ...(process.env.NODE_ENV === 'development' 
      ? [
          new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/app.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
          })
        ] 
      : [])
  ]
});

module.exports = { logger };