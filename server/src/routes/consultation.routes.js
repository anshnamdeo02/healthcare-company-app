const express = require('express');
const consultationController = require('../controllers/consultation.controller');
const prescriptionController = require('../controllers/prescription.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createConsultationSchema,
  assignConsultationSchema,
  addPrescriptionSchema,
} = require('../validators/schemas');

const router = express.Router();

// ─── Patient ──────────────────────────────────────────────────────
// POST /api/v1/consultations  — patient creates a new consultation
router.post(
  '/',
  authenticate,
  authorize('patient'),
  validate(createConsultationSchema),
  consultationController.createConsultation
);

// GET /api/v1/consultations/patient — patient views their consultations
router.get(
  '/patient',
  authenticate,
  authorize('patient'),
  consultationController.getPatientConsultations
);

// ─── Doctor ───────────────────────────────────────────────────────
// GET /api/v1/consultations/doctor — doctor views assigned consultations
router.get(
  '/doctor',
  authenticate,
  authorize('doctor'),
  consultationController.getDoctorConsultations
);

// POST /api/v1/consultations/prescriptions/:consultationId — doctor adds prescription
router.post(
  '/prescriptions/:consultationId',
  authenticate,
  authorize('doctor'),
  validate(addPrescriptionSchema),
  prescriptionController.addPrescription
);

// ─── Admin ────────────────────────────────────────────────────────
// GET /api/v1/consultations — admin views all consultations
router.get(
  '/',
  authenticate,
  authorize('admin'),
  consultationController.getAllConsultations
);

// PATCH /api/v1/consultations/:id/assign — admin assigns doctor
router.patch(
  '/:id/assign',
  authenticate,
  authorize('admin'),
  validate(assignConsultationSchema),
  consultationController.assignConsultation
);

module.exports = router;
