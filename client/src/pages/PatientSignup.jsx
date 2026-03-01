import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.coerce.number().int().min(1, 'Age must be at least 1').max(150, 'Age must be at most 150'),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Please select a gender' }) }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  emergencyContact: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit emergency contact'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be a 12-digit number'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function PatientSignup() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/patient/signup', data);
      setToast({ message: 'Registration successful! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/patient/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed. Please try again.';
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
            <h1 className="text-2xl font-bold text-text-primary">Patient Registration</h1>
            <p className="text-text-secondary text-sm mt-1">Create your account to access healthcare services</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input {...register('name')} className={inputClass('name')} placeholder="John Doe" />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" {...register('age')} className={inputClass('age')} placeholder="25" />
                {errors.age && <p className="text-danger text-xs mt-1">{errors.age.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select {...register('gender')} className={inputClass('gender')}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-danger text-xs mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Mobile + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input {...register('mobile')} className={inputClass('mobile')} placeholder="9876543210" />
                {errors.mobile && <p className="text-danger text-xs mt-1">{errors.mobile.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input type="email" {...register('email')} className={inputClass('email')} placeholder="john@example.com" />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea {...register('address')} rows={2} className={inputClass('address')} placeholder="Enter your full address" />
              {errors.address && <p className="text-danger text-xs mt-1">{errors.address.message}</p>}
            </div>

            {/* Emergency Contact + Aadhaar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input {...register('emergencyContact')} className={inputClass('emergencyContact')} placeholder="9876543211" />
                {errors.emergencyContact && <p className="text-danger text-xs mt-1">{errors.emergencyContact.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                <input {...register('aadhaar')} className={inputClass('aadhaar')} placeholder="123456789012" maxLength={12} />
                {errors.aadhaar && <p className="text-danger text-xs mt-1">{errors.aadhaar.message}</p>}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register as Patient'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/patient/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
