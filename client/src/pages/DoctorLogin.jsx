import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/doctor/login', data);
      const { token, doctor } = res.data.data;
      login(token, { ...doctor, role: 'doctor' });
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => navigate('/doctor/dashboard'), 500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Doctor Sign In</h1>
            <p className="text-text-secondary text-sm mt-1">Access your doctor portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" {...register('email')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-danger focus:ring-danger/25' : 'border-gray-300 focus:ring-primary/25 focus:border-primary'}`}
                placeholder="doctor@hospital.com"
              />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" {...register('password')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-danger focus:ring-danger/25' : 'border-gray-300 focus:ring-primary/25 focus:border-primary'}`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>Note:</strong> Your account must be approved by an admin before you can log in. If you just registered, please wait for approval.
            </p>
          </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/doctor/signup" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
