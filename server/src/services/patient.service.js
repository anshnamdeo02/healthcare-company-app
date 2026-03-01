const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { encryptAadhaar } = require('../utils/encryption');
const { maskAadhaar } = require('../utils/aadhaarMask');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../utils/AppError');
const { sendPatientRegistrationEmail, sendPasswordResetEmail } = require('./email.service');

const SALT_ROUNDS = 12;

/**
 * Register a new patient.
 */
async function signupPatient(data) {
  const { name, age, gender, mobile, email, address, emergencyContact, aadhaar, password } = data;

  // Check if email already exists
  const existing = await prisma.patient.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('A patient with this email already exists.', 409);
  }

  // Hash password & encrypt Aadhaar
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const aadhaarEncrypted = encryptAadhaar(aadhaar);

  // Default medical records structure
  const medicalRecords = {
    symptoms: [],
    prescriptions: [],
    followups: [],
    currentFollowUp: null,
  };

  const patient = await prisma.patient.create({
    data: {
      name,
      age,
      gender,
      mobile,
      email,
      address,
      emergencyContact,
      aadhaarEncrypted,
      password: hashedPassword,
      medicalRecords,
    },
  });

  // Send notification email (fire and forget — don't block response)
  sendPatientRegistrationEmail({
    name,
    age,
    gender,
    mobile,
    email,
    address,
    emergencyContact,
    aadhaarMasked: maskAadhaar(aadhaarEncrypted),
  }).catch((err) => console.error('Email send failed:', err.message));

  // Return sanitized patient data
  return {
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    mobile: patient.mobile,
    email: patient.email,
    address: patient.address,
    emergencyContact: patient.emergencyContact,
    aadhaar: maskAadhaar(patient.aadhaarEncrypted),
    createdAt: patient.createdAt,
  };
}

/**
 * Login a patient.
 */
async function loginPatient(email, password) {
  const patient = await prisma.patient.findUnique({ where: { email } });
  if (!patient) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, patient.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken({ id: patient.id, role: 'patient' });

  return {
    token,
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      mobile: patient.mobile,
      email: patient.email,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      aadhaar: maskAadhaar(patient.aadhaarEncrypted),
    },
  };
}

/**
 * Initiate password reset — generate token and send email.
 */
async function forgotPassword(email) {
  const patient = await prisma.patient.findUnique({ where: { email } });
  if (!patient) {
    // Don't reveal whether email exists — return success either way
    return;
  }

  const resetToken = generateToken({ id: patient.id, role: 'patient', purpose: 'reset' }, '15m');
  const resetLink = `${process.env.CLIENT_URL}/patient/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(patient.email, resetLink);
}

/**
 * Reset password with token.
 */
async function resetPassword(token, newPassword) {
  const { verifyToken } = require('../utils/jwt');
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError('Invalid or expired reset token.', 400);
  }

  if (decoded.purpose !== 'reset') {
    throw new AppError('Invalid reset token.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.patient.update({
    where: { id: decoded.id },
    data: { password: hashedPassword },
  });
}

/**
 * Get patient dashboard data (profile + medical records).
 */
async function getDashboard(patientId) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }

  const records = patient.medicalRecords || {};

  return {
    profile: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      mobile: patient.mobile,
      email: patient.email,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      aadhaar: maskAadhaar(patient.aadhaarEncrypted),
    },
    currentSymptoms: records.symptoms || [],
    currentFollowUp: records.currentFollowUp || null,
    prescriptionsCount: (records.prescriptions || []).length,
    followupsCount: (records.followups || []).length,
  };
}

/**
 * Get patient prescriptions.
 */
async function getPrescriptions(patientId) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new AppError('Patient not found.', 404);
  const records = patient.medicalRecords || {};
  return records.prescriptions || [];
}

/**
 * Get patient follow-ups.
 */
async function getFollowups(patientId) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new AppError('Patient not found.', 404);
  const records = patient.medicalRecords || {};
  return records.followups || [];
}

module.exports = {
  signupPatient,
  loginPatient,
  forgotPassword,
  resetPassword,
  getDashboard,
  getPrescriptions,
  getFollowups,
};
