const express = require('express');
const rateLimit = require('express-rate-limit');
const doctorController = require('../controllers/doctor.controller');
const { validate } = require('../middleware/validate.middleware');
const { doctorUpload } = require('../middleware/upload.middleware');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { doctorLoginSchema } = require('../validators/schemas');

const router = express.Router();

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Doctor signup — files first (multer), then body validation in controller
// Note: validation for multipart form data is done after multer parses the body
router.post('/signup', doctorUpload, doctorController.signup);

// Doctor login
router.post('/login', loginLimiter, validate(doctorLoginSchema), doctorController.login);

// Doctor dashboard — protected
router.get('/dashboard', authenticate, authorize('doctor'), doctorController.dashboard);

module.exports = router;
