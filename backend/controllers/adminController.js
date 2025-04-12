const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { logger } = require('../middlewares/logger');
const { updateEventAvailability } = require('../utils/redisUtils');

// Get all pending registrations
// @route   GET /api/admin/registrations
// @access  Private/Admin
exports.getPendingRegistrations = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;
    
    const registrations = await Registration.find({ status })
      .populate([
        { path: 'user', select: 'username email' },
        { path: 'event', select: 'title date' }
      ])
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    logger.error(`Get pending registrations error: ${err.message}`);
    next(err);
  }
};

// Approve or reject registration
// @route   PUT /api/admin/registrations/:id/:action
// @access  Private/Admin
exports.updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id, action } = req.params;
    const adminId = req.user.id;
    const { reason } = req.body;
    
    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Use "approve" or "reject"'
      });
    }
    
    // Find registration
    const registration = await Registration.findById(id);
    
    if (!registration) {
      logger.warn(`Update attempt for non-existent registration: ${id}`);
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    // Check if registration is already processed
    if (registration.status !== 'pending') {
      logger.warn(`Attempt to ${action} non-pending registration: ${id}`);
      return res.status(400).json({
        success: false,
        error: `Registration already ${registration.status}`
      });
    }
    
    // If approving, check event capacity
    if (action === 'approve') {
      const event = await Event.findById(registration.event);
      
      if (!event) {
        logger.error(`Associated event not found for registration: ${id}`);
        return res.status(404).json({
          success: false,
          error: 'Associated event not found'
        });
      }
      
      if (event.availableSpots <= 0) {
        logger.warn(`Attempted to approve registration ${id} for full event ${event._id}`);
        return res.status(400).json({
          success: false,
          error: 'Event is at full capacity'
        });
      }
      
      // Decrement available spots
      event.availableSpots -= 1;
      await event.save();
      
      // Update cache
      await updateEventAvailability(event._id.toString(), -1);
    }
    
    // Update registration
    registration.status = action === 'approve' ? 'approved' : 'rejected';
    registration.approvedBy = adminId;
    registration.reason = reason || '';
    registration.updatedAt = Date.now();
    
    await registration.save();
    
    logger.info(`Registration ${id} ${action}d by admin ${adminId}`);
    
    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (err) {
    logger.error(`Update registration status error: ${err.message}`);
    next(err);
  }
};

// Get registration statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const pendingCount = await Registration.countDocuments({ status: 'pending' });
    const approvedCount = await Registration.countDocuments({ status: 'approved' });
    const rejectedCount = await Registration.countDocuments({ status: 'rejected' });
    const eventCount = await Event.countDocuments();
    
    const eventsAtCapacity = await Event.countDocuments({ availableSpots: 0 });
    
    res.status(200).json({
      success: true,
      data: {
        registrations: {
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          total: pendingCount + approvedCount + rejectedCount
        },
        events: {
          total: eventCount,
          atCapacity: eventsAtCapacity
        }
      }
    });
  } catch (err) {
    logger.error(`Get admin stats error: ${err.message}`);
    next(err);
  }
};