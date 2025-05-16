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

// CORS Configuration
app.use(cors({
  origin: ['https://event-registration-rho.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

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
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
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