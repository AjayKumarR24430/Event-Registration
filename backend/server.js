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
const { connectDB } = require('./config/db');
const { setupRedis } = require('./config/redis');
const { logger } = require('./middlewares/logger');
const errorMiddleware = require('./middlewares/error');
const superAdminRoutes = require('./routes/superAdmin');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Set up Redis
setupRedis();

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-production-domain.com' 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['date', 'title', 'status'] // parameters that can be duplicated
}));

// Compress responses
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
app.use('/api', apiLimiter);

// More strict rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100000, // 100000 requests per hour
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth', authLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Mount routers
app.use('/api/superadmin', superAdminRoutes);

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/health', require('./routes/health')); // Add health check routes

// Root route
app.get('/', (req, res) => {
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

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM signal (e.g., when deployed in containers)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = server; // Export for testing