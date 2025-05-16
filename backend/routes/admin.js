const express = require('express');
const { 
  getPendingRegistrations, 
  updateRegistrationStatus,
  getStats,
  getEventRegistrations,
  getEventRegistrationStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/registrations', getPendingRegistrations);
router.put('/registrations/:id/:action', updateRegistrationStatus);
router.get('/stats', getStats);
router.get('/events/:eventId/registrations', getEventRegistrations);
router.get('/events/registration-stats', getEventRegistrationStats);

module.exports = router;