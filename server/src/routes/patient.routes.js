const express = require('express');
const rateLimit = require('express-rate-limit');
const patientController = require('../controllers/patient.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  patientSignupSchema,
  patientLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/schemas');

const router = express.Router();

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/signup', validate(patientSignupSchema), patientController.signup);
router.post('/login', loginLimiter, validate(patientLoginSchema), patientController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), patientController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), patientController.resetPassword);

// Protected routes (patient only)
router.get('/dashboard', authenticate, authorize('patient'), patientController.dashboard);
router.get('/prescriptions', authenticate, authorize('patient'), patientController.prescriptions);
router.get('/followups', authenticate, authorize('patient'), patientController.followups);

module.exports = router;
