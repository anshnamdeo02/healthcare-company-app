const prisma = require('../config/db');
const { AppError } = require('../utils/AppError');

/**
 * Patient creates a new consultation request.
 */
async function createConsultation(patientId, { symptoms, duration }) {
  const consultation = await prisma.consultation.create({
    data: {
      patientId,
      symptoms,
      duration: duration || null,
      status: 'PENDING',
    },
    include: {
      patient: { select: { id: true, name: true, email: true, mobile: true, age: true, gender: true } },
    },
  });
  return consultation;
}

/**
 * Admin assigns a doctor (and optional meet link / scheduled time) to a consultation.
 */
async function assignConsultation(consultationId, { doctorId, meetLink, scheduledAt }) {
  const consultation = await prisma.consultation.findUnique({ where: { id: consultationId } });
  if (!consultation) throw new AppError('Consultation not found.', 404);

  // Verify doctor exists and is approved
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) throw new AppError('Doctor not found.', 404);
  if (doctor.approvalStatus !== 'APPROVED') throw new AppError('Doctor is not approved.', 400);

  const newStatus = meetLink ? 'SCHEDULED' : 'ASSIGNED';

  const updated = await prisma.consultation.update({
    where: { id: consultationId },
    data: {
      doctorId,
      status: newStatus,
      meetLink: meetLink || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, specialization: true, hospital: true } },
    },
  });
  return updated;
}

/**
 * Doctor views consultations assigned to them.
 */
async function getDoctorConsultations(doctorId) {
  const consultations = await prisma.consultation.findMany({
    where: { doctorId },
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { select: { id: true, name: true, email: true, mobile: true, age: true, gender: true } },
      prescription: true,
    },
  });
  return consultations;
}

/**
 * Patient views their own consultations.
 */
async function getPatientConsultations(patientId) {
  const consultations = await prisma.consultation.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
    include: {
      doctor: { select: { id: true, name: true, specialization: true, hospital: true, photoUrl: true } },
      prescription: true,
    },
  });
  return consultations;
}

/**
 * Admin views all consultations (optionally filtered by status).
 */
async function getAllConsultations(status) {
  const where = {};
  if (status && ['PENDING', 'ASSIGNED', 'SCHEDULED', 'COMPLETED'].includes(status.toUpperCase())) {
    where.status = status.toUpperCase();
  }

  const consultations = await prisma.consultation.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { select: { id: true, name: true, email: true, mobile: true, age: true, gender: true } },
      doctor: { select: { id: true, name: true, specialization: true, hospital: true } },
      prescription: true,
    },
  });
  return consultations;
}

module.exports = {
  createConsultation,
  assignConsultation,
  getDoctorConsultations,
  getPatientConsultations,
  getAllConsultations,
};
