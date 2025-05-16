const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const { connectDB } = require('../config/db');
const { setupRedis } = require('../config/redis');
const { logger } = require('../middlewares/logger');
const errorMiddleware = require('../middlewares/error');

// Load env vars
dotenv.config();

// Initialize Express
const app = express();

// Connect to database
connectDB();

// Set up Redis
setupRedis();

// CORS Configuration - Must be before any route definitions
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://event-registration-rho.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      body: "OK"
    });
  }
  
  next();
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin" }
}));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
  whitelist: ['date', 'title', 'status']
}));

// Compression
app.use(compression());

// Mount routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/events', require('../routes/events'));
app.use('/api/registrations', require('../routes/registrations'));
app.use('/api/admin', require('../routes/admin'));
app.use('/api/superadmin', require('../routes/superAdmin'));
app.use('/api/health', require('../routes/health'));

// Root route
app.get('/api', (req, res) => {
  res.json({
    message: 'Event Registration API is running',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  const requestedUrl = req.originalUrl;
  logger.warn(`404 - Route not found: ${requestedUrl}`);
  
  // Check if it's an API route without the /api prefix
  if (!requestedUrl.startsWith('/api') && requestedUrl !== '/') {
    logger.info(`Suggesting API route correction for: ${requestedUrl}`);
    return res.status(404).json({
      success: false,
      error: `Route not found: ${requestedUrl}`,
      suggestion: `Did you mean to use: /api${requestedUrl}?`
    });
  }
  
  res.status(404).json({
    success: false,
    error: `Route not found: ${requestedUrl}`,
    availableRoutes: {
      auth: '/api/auth/*',
      events: '/api/events/*',
      registrations: '/api/registrations/*',
      admin: '/api/admin/*',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use(errorMiddleware);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Export the Express API
module.exports = app; 