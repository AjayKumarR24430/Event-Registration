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

// CORS Configuration based on environment
const allowedOrigins = [
  'https://event-registration-rho.vercel.app',    // Production frontend
  'http://localhost:3000'                         // Development frontend
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      body: "OK"
    });
  }
  next();
});

// Security middleware with CORS-friendly config
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  contentSecurityPolicy: false
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

// Mount routes (without /api prefix for Vercel deployment)
app.use('/auth', require('./routes/auth'));
app.use('/events', require('./routes/events'));
app.use('/registrations', require('./routes/registrations'));
app.use('/admin', require('./routes/admin'));
app.use('/superadmin', require('./routes/superAdmin'));
app.use('/health', require('./routes/health'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Event Management APIs are running',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Handle 404 routes with better error messages
app.use('*', (req, res) => {
  const requestedUrl = req.originalUrl;
  logger.warn(`404 - Route not found: ${requestedUrl}`);
  
  res.status(404).json({
    success: false,
    error: `Route not found: ${requestedUrl}`,
    availableRoutes: {
      auth: '/auth/*',
      events: '/events/*',
      registrations: '/registrations/*',
      admin: '/admin/*',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server only in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Development server running on port ${PORT}`);
  });
} else {
  // In production (Vercel), we export the app
  logger.info('Production environment detected');
}

// Export the Express API
module.exports = app;