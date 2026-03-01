import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().int().min(22, 'Doctor must be at least 22').max(100),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Select gender' }) }),
  email: z.string().email('Enter a valid email'),
  specialization: z.string().min(2, 'Specialization is required'),
  registrationNumber: z.string().min(3, 'Registration number is required'),
  registrationState: z.string().min(2, 'Registration state is required'),
  hospital: z.string().min(2, 'Hospital name is required'),
  experience: z.coerce.number().int().min(0).max(70),
  patientsTreated: z.coerce.number().int().min(0),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function DoctorSignup() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [certPreview, setCertPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setToast({ message: 'Only JPG, PNG, and PDF files are allowed.', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'File must be under 5MB.', type: 'error' });
      return;
    }

    if (type === 'photo') {
      setPhotoFile(file);
      if (file.type.startsWith('image/')) {
        setPhotoPreview(URL.createObjectURL(file));
      } else {
        setPhotoPreview(null);
      }
    } else {
      setCertFile(file);
      if (file.type.startsWith('image/')) {
        setCertPreview(URL.createObjectURL(file));
      } else {
        setCertPreview(null);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photoFile) formData.append('photo', photoFile);
      if (certFile) formData.append('certificate', certFile);

      await api.post('/doctor/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setToast({ message: 'Registration submitted! Your account is pending admin approval.', type: 'success' });
      setTimeout(() => navigate('/doctor/login'), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-danger focus:ring-danger/25' : 'border-gray-300 focus:ring-primary/25 focus:border-primary'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Doctor Registration</h1>
            <p className="text-text-secondary text-sm mt-1">Submit your details for verification and approval</p>
            <div className="mt-3 inline-block bg-warning/10 text-warning text-xs font-semibold px-3 py-1 rounded-full">
              Note: Account requires admin approval before login
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
              <input {...register('name')} className={inputClass('name')} placeholder="Dr. John Smith" />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" {...register('age')} className={inputClass('age')} placeholder="35" />
                {errors.age && <p className="text-danger text-xs mt-1">{errors.age.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select {...register('gender')} className={inputClass('gender')}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-danger text-xs mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Email + Specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" {...register('email')} className={inputClass('email')} placeholder="doctor@hospital.com" />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input {...register('specialization')} className={inputClass('specialization')} placeholder="e.g. Cardiology" />
                {errors.specialization && <p className="text-danger text-xs mt-1">{errors.specialization.message}</p>}
              </div>
            </div>

            {/* Reg Number + State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Registration Number</label>
                <input {...register('registrationNumber')} className={inputClass('registrationNumber')} placeholder="MCI-XXXX-XXXXX" />
                {errors.registrationNumber && <p className="text-danger text-xs mt-1">{errors.registrationNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration State</label>
                <input {...register('registrationState')} className={inputClass('registrationState')} placeholder="e.g. Delhi" />
                {errors.registrationState && <p className="text-danger text-xs mt-1">{errors.registrationState.message}</p>}
              </div>
            </div>

            {/* Hospital */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Practice Hospital</label>
              <input {...register('hospital')} className={inputClass('hospital')} placeholder="Hospital name" />
              {errors.hospital && <p className="text-danger text-xs mt-1">{errors.hospital.message}</p>}
            </div>

            {/* Experience + Patients */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input type="number" {...register('experience')} className={inputClass('experience')} placeholder="10" />
                {errors.experience && <p className="text-danger text-xs mt-1">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Patients Treated</label>
                <input type="number" {...register('patientsTreated')} className={inputClass('patientsTreated')} placeholder="5000" />
                {errors.patientsTreated && <p className="text-danger text-xs mt-1">{errors.patientsTreated.message}</p>}
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Photo (with stethoscope)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Certificate</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(e, 'certificate')}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {certPreview && (
                  <img src={certPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border" />
                )}
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                <input type="password" {...register('password')} className={inputClass('password')} placeholder="Min. 8 characters" />
                {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" {...register('confirmPassword')} className={inputClass('confirmPassword')} placeholder="Re-enter password" />
                {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already registered?{' '}
            <Link to="/doctor/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
