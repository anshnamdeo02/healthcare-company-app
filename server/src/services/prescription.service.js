const prisma = require('../config/db');
const { AppError } = require('../utils/AppError');

/**
 * Doctor adds a prescription to a consultation they are assigned to.
 */
async function addPrescription(doctorId, consultationId, { medicines, notes }) {
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
    include: { prescription: true },
  });

  if (!consultation) throw new AppError('Consultation not found.', 404);
  if (consultation.doctorId !== doctorId) {
    throw new AppError('You are not assigned to this consultation.', 403);
  }
  if (consultation.prescription) {
    throw new AppError('A prescription already exists for this consultation.', 409);
  }
  if (consultation.status === 'PENDING') {
    throw new AppError('Cannot prescribe for an unassigned consultation.', 400);
  }

  // Create prescription and mark consultation COMPLETED in a transaction
  const [prescription] = await prisma.$transaction([
    prisma.prescription.create({
      data: {
        consultationId,
        medicines,
        notes: notes || null,
      },
    }),
    prisma.consultation.update({
      where: { id: consultationId },
      data: { status: 'COMPLETED' },
    }),
  ]);

  return prescription;
}

module.exports = { addPrescription };
