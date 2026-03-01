import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/doctor/dashboard');
        setDoctor(res.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          return;
        }
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-danger text-lg">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome, Dr. {doctor.name.split(' ').slice(-1)[0]}!
          </h1>
          <p className="text-text-secondary mt-1">Here's your profile overview</p>
        </div>

        {/* Status Banner */}
        {doctor.approvalStatus === 'PENDING' ? (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-amber-800">Account Pending Approval</p>
              <p className="text-sm text-amber-700">Your registration is under review by the admin team. You'll be notified once approved.</p>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Account Verified</p>
              <p className="text-sm text-green-700">Your account has been approved. You're all set to use the platform.</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            label="Experience"
            value={`${doctor.experience} years`}
            bgColor="bg-primary/10"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Patients Treated"
            value={`${doctor.patientsTreated}+`}
            bgColor="bg-secondary/10"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            label="Hospital"
            value={doctor.hospital}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
            label="Status"
            value={doctor.approvalStatus === 'APPROVED' ? 'Verified' : 'Pending'}
            bgColor="bg-amber-50"
          />
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
              {/* Avatar */}
              {doctor.photoUrl ? (
                <img
                  src={doctor.photoUrl}
                  alt={doctor.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-primary/20"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-4xl">
                    {doctor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-bold text-text-primary mt-4">{doctor.name}</h2>
              <p className="text-primary font-medium">{doctor.specialization}</p>
              <p className="text-text-secondary text-sm mt-1">{doctor.email}</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  doctor.approvalStatus === 'APPROVED'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {doctor.approvalStatus === 'APPROVED' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approved
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending Approval
                    </>
                  )}
                </span>
              </div>

              {/* Document links */}
              {(doctor.photoUrl || doctor.certificateUrl) && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center gap-4">
                  {doctor.photoUrl && (
                    <a href={doctor.photoUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Photo
                    </a>
                  )}
                  {doctor.certificateUrl && (
                    <a href={doctor.certificateUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Certificate
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Professional Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                <InfoField label="Full Name" value={doctor.name} />
                <InfoField label="Age" value={`${doctor.age} years`} />
                <InfoField label="Gender" value={doctor.gender} />
                <InfoField label="Email" value={doctor.email} />
                <InfoField label="Specialization" value={doctor.specialization} />
                <InfoField label="Hospital" value={doctor.hospital} />
                <InfoField label="Registration Number" value={doctor.registrationNumber} />
                <InfoField label="Registration State" value={doctor.registrationState} />
                <InfoField label="Experience" value={`${doctor.experience} years`} />
                <InfoField label="Patients Treated" value={`${doctor.patientsTreated}+`} />
                <InfoField
                  label="Member Since"
                  value={new Date(doctor.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                />
                <InfoField label="Account Status" value={doctor.approvalStatus === 'APPROVED' ? 'Verified & Active' : 'Pending Review'} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ActionCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  title="View Profile"
                  description="View your complete profile details"
                  color="primary"
                />
                <ActionCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                  title="Patient Records"
                  description="Access and manage patient records"
                  color="secondary"
                />
                <ActionCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  title="Appointments"
                  description="View upcoming appointments"
                  color="green"
                />
                <ActionCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  title="Settings"
                  description="Manage account settings"
                  color="amber"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ── Helper Components ── */

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-text-primary truncate">{value}</p>
          <p className="text-sm text-text-secondary">{label}</p>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-text-primary mt-1">{value}</p>
    </div>
  );
}

function ActionCard({ icon, title, description, color }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
