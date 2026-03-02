const consultationService = require('../services/consultation.service');

async function createConsultation(req, res, next) {
  try {
    const result = await consultationService.createConsultation(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Consultation request submitted.', data: result });
  } catch (err) { next(err); }
}

async function assignConsultation(req, res, next) {
  try {
    const result = await consultationService.assignConsultation(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Consultation assigned successfully.', data: result });
  } catch (err) { next(err); }
}

async function getDoctorConsultations(req, res, next) {
  try {
    const result = await consultationService.getDoctorConsultations(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

async function getPatientConsultations(req, res, next) {
  try {
    const result = await consultationService.getPatientConsultations(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

async function getAllConsultations(req, res, next) {
  try {
    const result = await consultationService.getAllConsultations(req.query.status);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

module.exports = {
  createConsultation,
  assignConsultation,
  getDoctorConsultations,
  getPatientConsultations,
  getAllConsultations,
};
