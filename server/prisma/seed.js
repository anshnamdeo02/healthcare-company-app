const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

// ─── AES Encryption (mirrors src/utils/encryption.js) ─────────
const ALGORITHM = 'aes-256-gcm';
function encryptAadhaar(plaintext) {
  const keyHex = process.env.AES_ENCRYPTION_KEY || 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2';
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Clear existing data ────────────────────────────────────────
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.admin.deleteMany();

  // ─── Create Admin ───────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@healthcare.com',
      password: adminPassword,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ─── Create Patients ────────────────────────────────────────────
  const patientPassword = await bcrypt.hash('Patient@123', 12);

  const patient1 = await prisma.patient.create({
    data: {
      name: 'Rahul Sharma',
      age: 32,
      gender: 'Male',
      mobile: '9876543210',
      email: 'rahul@example.com',
      address: '123, MG Road, Sector 5, New Delhi, India',
      emergencyContact: '9876543211',
      aadhaarEncrypted: encryptAadhaar('123456789012'),
      password: patientPassword,
      medicalRecords: {
        symptoms: [
          { id: 1, name: 'Persistent cough', severity: 'moderate', reportedAt: '2026-02-20' },
          { id: 2, name: 'Mild fever', severity: 'low', reportedAt: '2026-02-25' },
        ],
        prescriptions: [
          {
            id: 1,
            doctorName: 'Dr. Priya Mehta',
            date: '2026-01-15',
            diagnosis: 'Upper Respiratory Infection',
            medications: [
              { name: 'Amoxicillin 500mg', dosage: '3 times daily', duration: '7 days' },
              { name: 'Paracetamol 650mg', dosage: 'As needed', duration: '5 days' },
            ],
            notes: 'Rest and hydration recommended. Follow up in 10 days.',
          },
          {
            id: 2,
            doctorName: 'Dr. Ankur Singh',
            date: '2025-11-08',
            diagnosis: 'Seasonal Allergies',
            medications: [
              { name: 'Cetirizine 10mg', dosage: 'Once daily', duration: '14 days' },
              { name: 'Nasal spray', dosage: 'Twice daily', duration: '10 days' },
            ],
            notes: 'Avoid dust and pollen exposure.',
          },
          {
            id: 3,
            doctorName: 'Dr. Priya Mehta',
            date: '2025-08-20',
            diagnosis: 'Routine Checkup',
            medications: [
              { name: 'Vitamin D3 60K', dosage: 'Once weekly', duration: '8 weeks' },
            ],
            notes: 'All vitals normal. Vitamin D levels low.',
          },
        ],
        followups: [
          {
            id: 1,
            doctorName: 'Dr. Priya Mehta',
            scheduledDate: '2026-01-25',
            status: 'completed',
            notes: 'Patient recovered well. Cough resolved.',
          },
          {
            id: 2,
            doctorName: 'Dr. Ankur Singh',
            scheduledDate: '2025-11-22',
            status: 'completed',
            notes: 'Allergies improved. Reduced medication.',
          },
          {
            id: 3,
            doctorName: 'Dr. Priya Mehta',
            scheduledDate: '2026-03-10',
            status: 'scheduled',
            notes: 'Follow up on current cough and fever symptoms.',
          },
        ],
        currentFollowUp: {
          id: 3,
          doctorName: 'Dr. Priya Mehta',
          scheduledDate: '2026-03-10',
          status: 'scheduled',
          notes: 'Follow up on current cough and fever symptoms.',
        },
      },
    },
  });
  console.log('✅ Patient created:', patient1.email);

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Ananya Patel',
      age: 28,
      gender: 'Female',
      mobile: '9123456789',
      email: 'ananya@example.com',
      address: '45, Lake Gardens, Kolkata, West Bengal, India',
      emergencyContact: '9123456790',
      aadhaarEncrypted: encryptAadhaar('987654321098'),
      password: patientPassword,
      medicalRecords: {
        symptoms: [
          { id: 1, name: 'Lower back pain', severity: 'moderate', reportedAt: '2026-02-15' },
        ],
        prescriptions: [
          {
            id: 1,
            doctorName: 'Dr. Vikram Rao',
            date: '2026-02-10',
            diagnosis: 'Lumbar Strain',
            medications: [
              { name: 'Ibuprofen 400mg', dosage: 'Twice daily', duration: '5 days' },
              { name: 'Muscle relaxant', dosage: 'At bedtime', duration: '5 days' },
            ],
            notes: 'Physical therapy recommended. Avoid heavy lifting.',
          },
        ],
        followups: [
          {
            id: 1,
            doctorName: 'Dr. Vikram Rao',
            scheduledDate: '2026-03-05',
            status: 'scheduled',
            notes: 'Review progress on back pain treatment.',
          },
        ],
        currentFollowUp: {
          id: 1,
          doctorName: 'Dr. Vikram Rao',
          scheduledDate: '2026-03-05',
          status: 'scheduled',
          notes: 'Review progress on back pain treatment.',
        },
      },
    },
  });
  console.log('✅ Patient created:', patient2.email);

  // ─── Create Doctors ─────────────────────────────────────────────
  const doctorPassword = await bcrypt.hash('Doctor@123', 12);

  const doctor1 = await prisma.doctor.create({
    data: {
      name: 'Dr. Priya Mehta',
      age: 38,
      gender: 'Female',
      email: 'priya@hospital.com',
      specialization: 'General Medicine',
      registrationNumber: 'MCI-2015-12345',
      registrationState: 'Delhi',
      hospital: 'AIIMS New Delhi',
      experience: 13,
      patientsTreated: 5200,
      photoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/healthcare/doctors/photos/priya_mehta.jpg',
      certificateUrl: 'https://res.cloudinary.com/demo/image/upload/v1/healthcare/doctors/certificates/priya_mehta_cert.pdf',
      password: doctorPassword,
      approvalStatus: 'APPROVED',
    },
  });
  console.log('✅ Doctor created (APPROVED):', doctor1.email);

  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Ankur Singh',
      age: 34,
      gender: 'Male',
      email: 'ankur@hospital.com',
      specialization: 'Pulmonology',
      registrationNumber: 'MCI-2018-67890',
      registrationState: 'Uttar Pradesh',
      hospital: 'Medanta Hospital Lucknow',
      experience: 8,
      patientsTreated: 3100,
      photoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/healthcare/doctors/photos/ankur_singh.jpg',
      certificateUrl: 'https://res.cloudinary.com/demo/image/upload/v1/healthcare/doctors/certificates/ankur_singh_cert.pdf',
      password: doctorPassword,
      approvalStatus: 'PENDING',
    },
  });
  console.log('✅ Doctor created (PENDING):', doctor2.email);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Test Credentials:');
  console.log('   Admin:   admin@healthcare.com / Admin@123');
  console.log('   Patient: rahul@example.com / Patient@123');
  console.log('   Patient: ananya@example.com / Patient@123');
  console.log('   Doctor:  priya@hospital.com / Doctor@123 (APPROVED)');
  console.log('   Doctor:  ankur@hospital.com / Doctor@123 (PENDING)');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
