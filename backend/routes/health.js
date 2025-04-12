const express = require('express');
const { checkHealth, checkDetailedHealth } = require('../controllers/healthController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public health check endpoint
router.get('/', checkHealth);

// Admin only detailed health check
router.get('/details', protect, authorize('admin'), checkDetailedHealth);

module.exports = router;