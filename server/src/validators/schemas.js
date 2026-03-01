const { z } = require('zod');

const patientSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.coerce.number().int().min(1, 'Age must be at least 1').max(150, 'Age must be at most 150'),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender must be Male, Female, or Other' }) }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  emergencyContact: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit emergency contact number'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be a 12-digit number'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const patientLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const doctorSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.coerce.number().int().min(22, 'Doctor must be at least 22 years old').max(100),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender must be Male, Female, or Other' }) }),
  email: z.string().email('Enter a valid email address'),
  specialization: z.string().min(2, 'Specialization is required').max(100),
  registrationNumber: z.string().min(3, 'Registration number is required').max(50),
  registrationState: z.string().min(2, 'Registration state is required').max(50),
  hospital: z.string().min(2, 'Hospital name is required').max(200),
  experience: z.coerce.number().int().min(0).max(70),
  patientsTreated: z.coerce.number().int().min(0),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const doctorLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  patientSignupSchema,
  patientLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  doctorSignupSchema,
  doctorLoginSchema,
  adminLoginSchema,
};
