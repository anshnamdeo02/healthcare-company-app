const prescriptionService = require('../services/prescription.service');

async function addPrescription(req, res, next) {
  try {
    const result = await prescriptionService.addPrescription(
      req.user.id,
      req.params.consultationId,
      req.body
    );
    res.status(201).json({ success: true, message: 'Prescription added successfully.', data: result });
  } catch (err) { next(err); }
}

module.exports = { addPrescription };
