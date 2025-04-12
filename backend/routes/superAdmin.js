const express = require('express');
const { 
  createAdmin,
  getAdmins,
  deleteAdmin
} = require('../controllers/superAdminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('superadmin'));

router.route('/admins')
  .post(createAdmin)
  .get(getAdmins);

router.delete('/admins/:id', deleteAdmin);

module.exports = router;