const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { logger } = require('../middlewares/logger');
const { updateEventAvailability } = require('../utils/redisUtils');

// Register for an event
// @route   POST /api/events/:eventId/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      logger.warn(`Registration attempt for non-existent event: ${eventId}`);
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId
    });
    
    if (existingRegistration) {
      logger.warn(`Duplicate registration attempt by user ${userId} for event ${eventId}`);
      return res.status(400).json({
        success: false,
        error: 'You have already registered for this event',
        status: existingRegistration.status
      });
    }
    
    // Create registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
      status: 'pending'
    });
    
    logger.info(`Registration created: ${registration._id} by user ${userId} for event ${eventId}`);
    
    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    next(err);
  }
};

// Get user's registrations
// @route   GET /api/registrations
// @access  Private
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const registrations = await Registration.find({ user: userId })
      .populate('event')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    logger.error(`Get registrations error: ${err.message}`);
    next(err);
  }
};

// Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registrationId = req.params.id;
    const userId = req.user.id;
    
    // Find registration
    const registration = await Registration.findById(registrationId);
    
    if (!registration) {
      logger.warn(`Cancel attempt for non-existent registration: ${registrationId}`);
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    // Check if registration belongs to user
    if (registration.user.toString() !== userId) {
      logger.warn(`Unauthorized cancel attempt for registration ${registrationId} by user ${userId}`);
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this registration'
      });
    }
    
    // Only allow cancellation of pending registrations
    if (registration.status !== 'pending') {
      logger.warn(`Attempted to cancel non-pending registration: ${registrationId}`);
      return res.status(400).json({
        success: false,
        error: `Cannot cancel registration with status: ${registration.status}`
      });
    }
    
    await registration.deleteOne();
    
    logger.info(`Registration cancelled: ${registrationId} by user ${userId}`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    logger.error(`Cancel registration error: ${err.message}`);
    next(err);
  }
};