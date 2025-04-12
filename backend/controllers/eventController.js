const Event = require('../models/Event');
const { logger } = require('../middlewares/logger');
const { cacheData, getCachedData, deleteCachedData } = require('../utils/redisUtils');

// Get all events with available spots
// @route   GET /api/events
exports.getEvents = async (req, res, next) => {
  try {
    // Check cache first
    const cacheKey = 'events:list';
    const cachedEvents = await getCachedData(cacheKey);
    
    if (cachedEvents) {
      return res.status(200).json({
        success: true,
        count: cachedEvents.length,
        data: cachedEvents
      });
    }

    // Query parameters
    const { title, date } = req.query;
    let query = {};
    
    // Filter by title
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    
    // Filter by date
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    // Sort by date, most recent first
    const events = await Event.find(query).sort({ date: 1 });
    
    // Cache results
    await cacheData(cacheKey, events);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    logger.error(`Get events error: ${err.message}`);
    next(err);
  }
};

// Get single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    
    // Check cache first
    const cacheKey = `event:${eventId}`;
    const cachedEvent = await getCachedData(cacheKey);
    
    if (cachedEvent) {
      return res.status(200).json({
        success: true,
        data: cachedEvent
      });
    }
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      logger.warn(`Event not found with id: ${eventId}`);
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Cache event
    await cacheData(cacheKey, event);
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    logger.error(`Get event error: ${err.message}`);
    next(err);
  }
};

// Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    const event = await Event.create(req.body);
    
    // Invalidate cache
    await deleteCachedData('events:list');
    
    logger.info(`Event created: ${event._id} by user ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    logger.error(`Create event error: ${err.message}`);
    next(err);
  }
};

// Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    let event = await Event.findById(eventId);
    
    if (!event) {
      logger.warn(`Update attempt for non-existent event: ${eventId}`);
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check ownership
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      logger.warn(`Unauthorized update attempt for event ${eventId} by user ${req.user.id}`);
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }
    
    // If capacity is being updated, also update availableSpots
    if (req.body.capacity) {
      const capacityDifference = req.body.capacity - event.capacity;
      req.body.availableSpots = event.availableSpots + capacityDifference;
      
      // Ensure availableSpots doesn't go negative
      if (req.body.availableSpots < 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot reduce capacity below current registrations'
        });
      }
    }
    
    event = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true
    });
    
    // Invalidate caches
    await deleteCachedData(`event:${eventId}`);
    await deleteCachedData('events:list');
    
    logger.info(`Event updated: ${eventId} by user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    logger.error(`Update event error: ${err.message}`);
    next(err);
  }
};

// Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    
    if (!event) {
      logger.warn(`Delete attempt for non-existent event: ${eventId}`);
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check ownership
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      logger.warn(`Unauthorized delete attempt for event ${eventId} by user ${req.user.id}`);
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }
    
    await event.deleteOne();
    
    // Invalidate caches
    await deleteCachedData(`event:${eventId}`);
    await deleteCachedData('events:list');
    
    logger.info(`Event deleted: ${eventId} by user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    logger.error(`Delete event error: ${err.message}`);
    next(err);
  }
};