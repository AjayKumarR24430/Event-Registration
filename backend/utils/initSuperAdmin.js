const User = require('../models/User');
const { logger } = require('../middlewares/logger');

/**
 * Initialize a super admin user if one doesn't exist
 */
const initSuperAdmin = async () => {
  try {
    // Check if any super admin already exists
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    
    if (!superAdminExists) {
      // Get credentials from environment variables
      const { SUPER_ADMIN_USERNAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;
      
      // Validate required environment variables
      if (!SUPER_ADMIN_USERNAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
        logger.warn('Super admin initialization skipped: missing environment variables');
        return;
      }
      
      // Create super admin
      const superAdmin = await User.create({
        username: SUPER_ADMIN_USERNAME,
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        role: 'superadmin'
      });
      
      logger.info(`Super admin initialized: ${superAdmin._id}`);
    } else {
      logger.info('Super admin already exists, skipping initialization');
    }
  } catch (error) {
    logger.error(`Super admin initialization failed: ${error.message}`);
  }
};

module.exports = initSuperAdmin;