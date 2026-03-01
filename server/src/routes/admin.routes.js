const express = require('express');
const adminController = require('../controllers/admin.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { adminLoginSchema } = require('../validators/schemas');

const router = express.Router();

// Admin login
router.post('/login', validate(adminLoginSchema), adminController.login);

// Admin actions — protected
router.get('/doctors', authenticate, authorize('admin'), adminController.getDoctors);
router.patch('/doctor/:id/approve', authenticate, authorize('admin'), adminController.approveDoctor);

module.exports = router;
