const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../utils/AppError');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendDoctorRegistrationEmail } = require('./email.service');

const SALT_ROUNDS = 12;

/**
 * Register a new doctor. Status = PENDING until admin approves.
 */
async function signupDoctor(data, files) {
  const {
    name, age, gender, email, specialization, registrationNumber,
    registrationState, hospital, experience, patientsTreated, password,
  } = data;

  // Check duplicates
  const existingEmail = await prisma.doctor.findUnique({ where: { email } });
  if (existingEmail) {
    throw new AppError('A doctor with this email already exists.', 409);
  }
  const existingReg = await prisma.doctor.findUnique({ where: { registrationNumber } });
  if (existingReg) {
    throw new AppError('A doctor with this registration number already exists.', 409);
  }

  // Upload files to Cloudinary (skip if not configured)
  let photoUrl = null;
  let certificateUrl = null;

  const cloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your-api-key';

  if (cloudinaryConfigured) {
    if (files?.photo?.[0]) {
      const photoResult = await uploadToCloudinary(files.photo[0].buffer, {
        folder: 'healthcare/doctors/photos',
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
      });
      photoUrl = photoResult.secure_url;
    }

    if (files?.certificate?.[0]) {
      const certResult = await uploadToCloudinary(files.certificate[0].buffer, {
        folder: 'healthcare/doctors/certificates',
      });
      certificateUrl = certResult.secure_url;
    }
  } else if (files?.photo?.[0] || files?.certificate?.[0]) {
    console.warn('⚠️  Cloudinary not configured — file uploads skipped. Documents will not be stored.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const doctor = await prisma.doctor.create({
    data: {
      name,
      age: parseInt(age, 10),
      gender,
      email,
      specialization,
      registrationNumber,
      registrationState,
      hospital,
      experience: parseInt(experience, 10),
      patientsTreated: parseInt(patientsTreated, 10),
      photoUrl,
      certificateUrl,
      password: hashedPassword,
      approvalStatus: 'PENDING',
    },
  });

  // Send notification email (fire and forget)
  sendDoctorRegistrationEmail({
    name,
    specialization,
    registrationNumber,
    registrationState,
    hospital,
    experience,
    patientsTreated,
    photoUrl,
    certificateUrl,
  }).catch((err) => console.error('Doctor email send failed:', err.message));

  return {
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    specialization: doctor.specialization,
    approvalStatus: doctor.approvalStatus,
    createdAt: doctor.createdAt,
  };
}

/**
 * Login a doctor — only if APPROVED.
 */
async function loginDoctor(email, password) {
  const doctor = await prisma.doctor.findUnique({ where: { email } });
  if (!doctor) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (doctor.approvalStatus !== 'APPROVED') {
    throw new AppError('Your account is pending approval. Please wait for admin verification.', 403);
  }

  const token = generateToken({ id: doctor.id, role: 'doctor' });

  return {
    token,
    doctor: {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      approvalStatus: doctor.approvalStatus,
    },
  };
}

/**
 * Approve a doctor (admin only).
 */
async function approveDoctor(doctorId) {
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) {
    throw new AppError('Doctor not found.', 404);
  }

  if (doctor.approvalStatus === 'APPROVED') {
    throw new AppError('Doctor is already approved.', 400);
  }

  const updated = await prisma.doctor.update({
    where: { id: doctorId },
    data: { approvalStatus: 'APPROVED' },
  });

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    approvalStatus: updated.approvalStatus,
  };
}

/**
 * Get doctor dashboard data (profile info).
 */
async function getDoctorDashboard(doctorId) {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
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
  });

  if (!doctor) {
    throw new AppError('Doctor not found.', 404);
  }

  return doctor;
}

module.exports = {
  signupDoctor,
  loginDoctor,
  approveDoctor,
  getDoctorDashboard,
};
