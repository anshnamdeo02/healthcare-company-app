import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export default function ForgotPassword() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/patient/forgot-password', data);
      setSent(true);
      setToast({ message: 'Password reset link sent! Check your email.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Something went wrong.', type: 'error' });
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
            <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Forgot Password</h1>
            <p className="text-text-secondary text-sm mt-1">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Email Sent!</h2>
              <p className="text-text-secondary text-sm mb-6">
                If an account exists with that email, you will receive a password reset link shortly.
              </p>
              <Link to="/patient/login" className="text-primary font-medium hover:underline text-sm">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.email ? 'border-danger focus:ring-danger/25' : 'border-gray-300 focus:ring-primary/25 focus:border-primary'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-text-secondary">
                Remember your password?{' '}
                <Link to="/patient/login" className="text-primary font-medium hover:underline">Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
