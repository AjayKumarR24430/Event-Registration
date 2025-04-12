const express = require('express');
const { 
  getMyRegistrations, 
  cancelRegistration 
} = require('../controllers/registrationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protected routes
router.get('/', protect, getMyRegistrations);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;