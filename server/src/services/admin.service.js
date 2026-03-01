const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../utils/AppError');

/**
 * Admin login.
 */
async function loginAdmin(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken({ id: admin.id, role: 'admin' });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  };
}

/**
 * Get all doctors, optionally filtered by approval status.
 */
async function getDoctors(status) {
  const where = {};
  if (status && ['PENDING', 'APPROVED'].includes(status.toUpperCase())) {
    where.approvalStatus = status.toUpperCase();
  }

  const doctors = await prisma.doctor.findMany({
    where,
    select: {
      id: true,
      name: true,
      age: true,
      gender: true,
      email: true,
      specialization: true,
      registrationNumber: true,
      registrationState: true,
      hospital: true,
      experience: true,
      patientsTreated: true,
      photoUrl: true,
      certificateUrl: true,
      approvalStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return doctors;
}

module.exports = { loginAdmin, getDoctors };
