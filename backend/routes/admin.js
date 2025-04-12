const express = require('express');
const { 
  getPendingRegistrations, 
  updateRegistrationStatus,
  getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/registrations', getPendingRegistrations);
router.put('/registrations/:id/:action', updateRegistrationStatus);
router.get('/stats', getStats);

module.exports = router;