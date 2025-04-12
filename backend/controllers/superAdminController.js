const User = require('../models/User');
const { logger } = require('../middlewares/logger');

// Create an admin user
// @route   POST /api/superadmin/admins
// @access  Private/SuperAdmin
exports.createAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      logger.warn(`Admin creation attempt with existing email/username: ${email} / ${username}`);
      return res.status(400).json({
        success: false,
        error: 'User with that email or username already exists'
      });
    }
    
    // Create admin user
    const admin = await User.create({
      username,
      email,
      password,
      role: 'admin'
    });
    
    logger.info(`Admin created: ${admin._id} by superadmin ${req.user.id}`);
    
    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    logger.error(`Admin creation error: ${err.message}`);
    next(err);
  }
};

// Get all admins
// @route   GET /api/superadmin/admins
// @access  Private/SuperAdmin
exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (err) {
    logger.error(`Get admins error: ${err.message}`);
    next(err);
  }
};

// Delete an admin
// @route   DELETE /api/superadmin/admins/:id
// @access  Private/SuperAdmin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }
    
    if (admin.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Can only delete users with admin role'
      });
    }
    
    await admin.deleteOne();
    
    logger.info(`Admin deleted: ${req.params.id} by superadmin ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    logger.error(`Delete admin error: ${err.message}`);
    next(err);
  }
};