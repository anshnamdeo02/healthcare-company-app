import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const C_STATUS = {
  PENDING: 'bg-amber-100 text-amber-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  SCHEDULED: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('doctors');
  const [toast, setToast] = useState(null);

  // ── Doctors state ──
  const [doctors, setDoctors] = useState([]);
  const [docFilter, setDocFilter] = useState('ALL');
  const [docLoading, setDocLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  // ── Consultations state ──
  const [consultations, setConsultations] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [consultFilter, setConsultFilter] = useState('ALL');
  const [consultLoading, setConsultLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const [assignForms, setAssignForms] = useState({});

  // ── Fetch doctors ──
  const fetchDoctors = useCallback(async () => {
    setDocLoading(true);
    try {
      const params = docFilter !== 'ALL' ? { status: docFilter } : {};
      const res = await api.get('/admin/doctors', { params });
      setDoctors(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) return logout();
      setToast({ message: 'Failed to load doctors.', type: 'error' });
    } finally {
      setDocLoading(false);
    }
  }, [docFilter]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  // ── Fetch consultations + approved doctors ──
  const fetchConsultations = useCallback(async () => {
    setConsultLoading(true);
    try {
      const [consultRes, docRes] = await Promise.all([
        api.get('/consultations', consultFilter !== 'ALL' ? { params: { status: consultFilter } } : {}),
        api.get('/admin/doctors', { params: { status: 'APPROVED' } }),
      ]);
      setConsultations(consultRes.data.data);
      setApprovedDoctors(docRes.data.data);
    } catch (err) {
      if (err.response?.status === 401) return logout();
      setToast({ message: 'Failed to load consultations.', type: 'error' });
    } finally {
      setConsultLoading(false);
    }
  }, [consultFilter]);

  useEffect(() => {
    if (activeTab === 'consultations') fetchConsultations();
  }, [activeTab, fetchConsultations]);

  const handleApprove = async (doctorId, doctorName) => {
    setApprovingId(doctorId);
    try {
      await api.patch(`/admin/doctor/${doctorId}/approve`);
      setDoctors((prev) => prev.map((d) => d.id === doctorId ? { ...d, approvalStatus: 'APPROVED' } : d));
      setToast({ message: `Dr. ${doctorName} approved successfully!`, type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to approve.', type: 'error' });
    } finally {
      setApprovingId(null);
    }
  };

  const handleAssignChange = (consultId, field, value) => {
    setAssignForms((prev) => ({ ...prev, [consultId]: { ...(prev[consultId] || {}), [field]: value } }));
  };

  const handleAssign = async (consultId) => {
    const form = assignForms[consultId] || {};
    if (!form.doctorId) return setToast({ message: 'Please select a doctor.', type: 'error' });
    setAssigningId(consultId);
    try {
      const payload = { doctorId: form.doctorId };
      if (form.meetLink) payload.meetLink = form.meetLink;
      if (form.scheduledAt) payload.scheduledAt = form.scheduledAt;
      const res = await api.patch(`/consultations/${consultId}/assign`, payload);
      setConsultations((prev) => prev.map((c) => c.id === consultId ? res.data.data : c));
      setAssignForms((prev) => { const n = { ...prev }; delete n[consultId]; return n; });
      setToast({ message: 'Consultation assigned successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to assign.', type: 'error' });
    } finally {
      setAssigningId(null);
    }
  };

  const pendingCount = doctors.filter((d) => d.approvalStatus === 'PENDING').length;
  const approvedCount = doctors.filter((d) => d.approvalStatus === 'APPROVED').length;
  const pendingConsultations = consultations.filter((c) => c.status === 'PENDING').length;

  const filteredConsultations = consultFilter === 'ALL' ? consultations : consultations.filter((c) => c.status === consultFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">Manage doctor approvals and patient consultations</p>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-8 w-fit">
          <button onClick={() => setActiveTab('doctors')}
            className={`py-2.5 px-6 rounded-lg text-sm font-medium transition-colors ${activeTab === 'doctors' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
            Doctors {pendingCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
          <button onClick={() => setActiveTab('consultations')}
            className={`py-2.5 px-6 rounded-lg text-sm font-medium transition-colors ${activeTab === 'consultations' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
            Consultations {pendingConsultations > 0 && <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingConsultations}</span>}
          </button>
        </div>

        {/* ══ DOCTORS TAB ══ */}
        {activeTab === 'doctors' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Doctors', value: doctors.length, color: 'blue' },
                { label: 'Pending Approval', value: pendingCount, color: 'amber' },
                { label: 'Approved', value: approvedCount, color: 'green' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                  <p className="text-sm text-text-secondary">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              {['ALL', 'PENDING', 'APPROVED'].map((tab) => (
                <button key={tab} onClick={() => setDocFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${docFilter === tab ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-gray-200 hover:bg-gray-50'}`}>
                  {tab === 'ALL' ? 'All Doctors' : tab}
                </button>
              ))}
            </div>
            {docLoading ? <LoadingSpinner /> : doctors.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-text-secondary">No doctors found.</div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {doctor.photoUrl ? (
                            <img src={doctor.photoUrl} alt={doctor.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold text-lg">{doctor.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-text-primary">{doctor.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {doctor.approvalStatus === 'APPROVED' ? '✓ Approved' : '⏳ Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-primary font-medium mt-0.5">{doctor.specialization}</p>
                          <p className="text-sm text-text-secondary">{doctor.email}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-text-secondary">
                            <span><strong className="text-text-primary">Reg No:</strong> {doctor.registrationNumber}</span>
                            <span><strong className="text-text-primary">Hospital:</strong> {doctor.hospital}</span>
                            <span><strong className="text-text-primary">Experience:</strong> {doctor.experience} yrs</span>
                          </div>
                          {(doctor.photoUrl || doctor.certificateUrl) && (
                            <div className="flex gap-3 mt-2">
                              {doctor.photoUrl && <a href={doctor.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View Photo</a>}
                              {doctor.certificateUrl && <a href={doctor.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View Certificate</a>}
                            </div>
                          )}
                        </div>
                      </div>
                      {doctor.approvalStatus === 'PENDING' && (
                        <button onClick={() => handleApprove(doctor.id, doctor.name)} disabled={approvingId === doctor.id}
                          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                          {approvingId === doctor.id ? (
                            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Approving...</>
                          ) : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Approve Doctor</>)}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ CONSULTATIONS TAB ══ */}
        {activeTab === 'consultations' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {['ALL', 'PENDING', 'ASSIGNED', 'COMPLETED'].map((s) => {
                const count = s === 'ALL' ? consultations.length : consultations.filter((c) => c.status === s).length;
                return (
                  <div key={s} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <p className="text-xl font-bold text-text-primary">{count}</p>
                    <p className="text-xs text-text-secondary capitalize">{s.toLowerCase()}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {['ALL', 'PENDING', 'ASSIGNED', 'SCHEDULED', 'COMPLETED'].map((s) => (
                <button key={s} onClick={() => setConsultFilter(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${consultFilter === s ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-gray-200 hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>

            {consultLoading ? <LoadingSpinner /> : filteredConsultations.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-text-secondary text-sm">No consultations found.</div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((c) => {
                  const form = assignForms[c.id] || {};
                  const canAssign = c.status === 'PENDING' || c.status === 'ASSIGNED';
                  return (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${C_STATUS[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                            <span className="text-xs text-text-secondary">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <h4 className="text-base font-bold text-text-primary">Patient: {c.patient?.name}</h4>
                          <p className="text-sm text-text-secondary">{c.patient?.email}</p>
                        </div>
                        {c.doctor && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">Dr. {c.doctor.name}</p>
                            <p className="text-xs text-text-secondary">{c.doctor.specialization}</p>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl mb-4">
                        <p className="text-xs font-semibold text-text-secondary mb-1">Symptoms</p>
                        <p className="text-sm text-text-primary">{c.symptoms}</p>
                        {c.duration && <p className="text-xs text-text-secondary mt-1">Duration: {c.duration}</p>}
                      </div>

                      {c.meetLink && (
                        <p className="text-xs text-blue-600 mb-3"><strong>Meet Link:</strong> <a href={c.meetLink} target="_blank" rel="noopener noreferrer" className="underline">{c.meetLink}</a></p>
                      )}

                      {canAssign && (
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-sm font-semibold text-text-primary mb-3">
                            {c.status === 'PENDING' ? 'Assign Doctor' : 'Reassign / Update'}
                          </p>
                          <div className="grid sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Doctor <span className="text-danger">*</span></label>
                              <select value={form.doctorId || ''} onChange={(e) => handleAssignChange(c.id, 'doctorId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white">
                                <option value="">Select doctor</option>
                                {approvedDoctors.map((d) => (
                                  <option key={d.id} value={d.id}>Dr. {d.name} — {d.specialization}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Google Meet Link</label>
                              <input type="url" value={form.meetLink || ''} onChange={(e) => handleAssignChange(c.id, 'meetLink', e.target.value)}
                                placeholder="https://meet.google.com/..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Schedule Date/Time</label>
                              <input type="datetime-local" value={form.scheduledAt || ''} onChange={(e) => handleAssignChange(c.id, 'scheduledAt', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
                            </div>
                          </div>
                          <button onClick={() => handleAssign(c.id)} disabled={assigningId === c.id}
                            className="mt-3 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2">
                            {assigningId === c.id ? (
                              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Assigning...</>
                            ) : 'Assign & Notify'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
