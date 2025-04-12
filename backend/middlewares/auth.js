const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('./logger');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from cookie or headers
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    logger.warn('No token provided for protected route');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      logger.warn(`User not found for token ID: ${decoded.id}`);
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    next();
  } catch (err) {
    logger.error(`JWT Verification error: ${err.message}`);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`User ${req.user?.id} (role: ${req.user?.role}) attempted to access restricted route`);
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    next();
  };
};