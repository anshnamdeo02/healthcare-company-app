import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = filter !== 'ALL' ? { status: filter } : {};
      const res = await api.get('/admin/doctors', { params });
      setDoctors(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setToast({ message: 'Failed to load doctors.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [filter]);

  const handleApprove = async (doctorId, doctorName) => {
    setApprovingId(doctorId);
    try {
      await api.patch(`/admin/doctor/${doctorId}/approve`);
      setToast({ message: `Dr. ${doctorName} approved successfully!`, type: 'success' });
      // Update local state
      setDoctors((prev) =>
        prev.map((d) => (d.id === doctorId ? { ...d, approvalStatus: 'APPROVED' } : d))
      );
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to approve doctor.', type: 'error' });
    } finally {
      setApprovingId(null);
    }
  };

  const pendingCount = doctors.filter((d) => d.approvalStatus === 'PENDING').length;
  const approvedCount = doctors.filter((d) => d.approvalStatus === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">Manage doctor registrations and approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{doctors.length}</p>
                <p className="text-sm text-text-secondary">Total Doctors</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                <p className="text-sm text-text-secondary">Pending Approval</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-sm text-text-secondary">Approved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'PENDING', 'APPROVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'ALL' ? 'All Doctors' : tab === 'PENDING' ? 'Pending' : 'Approved'}
            </button>
          ))}
        </div>

        {/* Doctors List */}
        {loading ? (
          <LoadingSpinner />
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-text-secondary">No doctors found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {doctor.photoUrl ? (
                        <img
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {doctor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-text-primary">{doctor.name}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doctor.approvalStatus === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {doctor.approvalStatus === 'APPROVED' ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mt-0.5">{doctor.specialization}</p>
                      <p className="text-sm text-text-secondary mt-1">{doctor.email}</p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-text-secondary">
                        <span>
                          <strong className="text-text-primary">Reg No:</strong> {doctor.registrationNumber}
                        </span>
                        <span>
                          <strong className="text-text-primary">State:</strong> {doctor.registrationState}
                        </span>
                        <span>
                          <strong className="text-text-primary">Hospital:</strong> {doctor.hospital}
                        </span>
                        <span>
                          <strong className="text-text-primary">Experience:</strong> {doctor.experience} yrs
                        </span>
                        <span>
                          <strong className="text-text-primary">Patients:</strong> {doctor.patientsTreated}+
                        </span>
                      </div>

                      {/* Document links */}
                      {(doctor.photoUrl || doctor.certificateUrl) && (
                        <div className="flex gap-3 mt-3">
                          {doctor.photoUrl && (
                            <a
                              href={doctor.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              View Photo
                            </a>
                          )}
                          {doctor.certificateUrl && (
                            <a
                              href={doctor.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Registered: {new Date(doctor.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Approve Button */}
                  {doctor.approvalStatus === 'PENDING' && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleApprove(doctor.id, doctor.name)}
                        disabled={approvingId === doctor.id}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {approvingId === doctor.id ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Approving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve Doctor
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
