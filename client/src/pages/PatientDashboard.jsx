import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const consultationSchema = z.object({
  symptoms: z.string().min(5, 'Please describe your symptoms (min 5 characters)'),
  duration: z.string().optional(),
});

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  SCHEDULED: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(consultationSchema),
  });

  const fetchData = async () => {
    try {
      const [dashRes, consultRes] = await Promise.all([
        api.get('/patient/dashboard'),
        api.get('/consultations/patient'),
      ]);
      setDashboard(dashRes.data.data);
      setConsultations(consultRes.data.data);
    } catch (err) {
      if (err.response?.status === 401) return logout();
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmitConsultation = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/consultations', data);
      setConsultations((prev) => [res.data.data, ...prev]);
      setToast({ message: 'Consultation request submitted!', type: 'success' });
      reset();
      setShowForm(false);
      setActiveTab('consultations');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to submit consultation.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar /><LoadingSpinner /></div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button onClick={fetchData} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium">Retry</button>
      </div>
    </div>
  );

  const profile = dashboard?.profile;
  const currentConsultations = consultations.filter((c) => c.status !== 'COMPLETED');
  const previousConsultations = consultations.filter((c) => c.status === 'COMPLETED');

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'consultations', label: `Consultations${consultations.length ? ` (${consultations.length})` : ''}` },
    { key: 'prescriptions', label: 'Prescriptions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Header */}
        <div className="bg-gradient-to-r from-primary to-teal-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {profile?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Hello, {profile?.name}</h1>
                <p className="text-white/80 text-sm mt-1">Welcome to your health dashboard</p>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(true); setActiveTab('consultations'); }}
              className="flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Consultation
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Total</p>
              <p className="text-xl font-bold">{consultations.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Active</p>
              <p className="text-xl font-bold">{currentConsultations.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Completed</p>
              <p className="text-xl font-bold">{previousConsultations.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Prescriptions</p>
              <p className="text-xl font-bold">{previousConsultations.filter((c) => c.prescription).length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary hover:bg-bg-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* â”€â”€ OVERVIEW TAB â”€â”€ */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Profile Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Email', value: profile?.email },
                  { label: 'Age', value: profile?.age },
                  { label: 'Gender', value: profile?.gender },
                  { label: 'Mobile', value: profile?.mobile },
                  { label: 'Address', value: profile?.address },
                  { label: 'Emergency Contact', value: profile?.emergencyContact },
                  { label: 'Aadhaar', value: profile?.aadhaar },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className="text-sm font-medium text-text-primary text-right max-w-[55%]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">Active Consultations</h3>
                <button onClick={() => setActiveTab('consultations')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              {currentConsultations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-text-secondary text-sm">No active consultations</p>
                  <button onClick={() => { setShowForm(true); setActiveTab('consultations'); }} className="mt-3 text-sm text-primary font-medium hover:underline">+ Start a consultation</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentConsultations.slice(0, 3).map((c) => <ConsultationCard key={c.id} consultation={c} compact />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* â”€â”€ CONSULTATIONS TAB â”€â”€ */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            {showForm && (
              <div className="bg-white rounded-2xl border border-primary/20 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-text-primary">New Consultation Request</h3>
                  <button onClick={() => { setShowForm(false); reset(); }} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmitConsultation)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Describe your symptoms <span className="text-danger">*</span></label>
                    <textarea {...register('symptoms')} rows={4}
                      placeholder="e.g., I have been experiencing severe headache, fever (102Â°F) and fatigue for the past 3 days..."
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none ${errors.symptoms ? 'border-danger focus:ring-danger/25' : 'border-gray-300 focus:ring-primary/25 focus:border-primary'}`}
                    />
                    {errors.symptoms && <p className="text-danger text-xs mt-1">{errors.symptoms.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (optional)</label>
                    <input {...register('duration')} type="text" placeholder="e.g., 3 days, 1 week"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2">
                      {submitting && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showForm && (
              <div className="flex justify-end">
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  New Consultation
                </button>
              </div>
            )}

            {currentConsultations.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block" />
                  Current Consultations ({currentConsultations.length})
                </h3>
                <div className="space-y-4">{currentConsultations.map((c) => <ConsultationCard key={c.id} consultation={c} />)}</div>
              </div>
            )}

            {previousConsultations.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block" />
                  Previous Consultations ({previousConsultations.length})
                </h3>
                <div className="space-y-4">{previousConsultations.map((c) => <ConsultationCard key={c.id} consultation={c} />)}</div>
              </div>
            )}

            {consultations.length === 0 && !showForm && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-text-secondary text-sm">No consultations yet.</p>
                <button onClick={() => setShowForm(true)} className="mt-3 text-sm text-primary font-medium hover:underline">+ Start your first consultation</button>
              </div>
            )}
          </div>
        )}

        {/* â”€â”€ PRESCRIPTIONS TAB â”€â”€ */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Prescriptions</h3>
            {previousConsultations.filter((c) => c.prescription).length === 0 ? (
              <div className="text-center py-12 text-text-secondary text-sm">No prescriptions yet.</div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {previousConsultations.filter((c) => c.prescription).map((c) => (
                    <div key={c.id} className="relative pl-12">
                      <div className="absolute left-2.5 top-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow" />
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h4 className="text-base font-bold text-text-primary">{c.doctor?.name ? `Dr. ${c.doctor.name}` : 'Doctor'}</h4>
                          <span className="text-xs font-medium text-text-secondary bg-white px-3 py-1 rounded-full">
                            {new Date(c.prescription.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        {c.doctor?.specialization && <p className="text-sm text-primary font-medium mb-3">{c.doctor.specialization}</p>}
                        <p className="text-sm text-gray-600 mb-4 bg-white p-3 rounded-lg italic">
                          <strong className="not-italic text-gray-700">Symptoms: </strong>{c.symptoms}
                        </p>
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Medicines</p>
                        <div className="space-y-2">
                          {c.prescription.medicines?.map((med, j) => (
                            <div key={j} className="flex flex-wrap gap-x-4 gap-y-1 text-sm bg-white p-3 rounded-lg">
                              <span className="font-semibold text-text-primary">{med.name}</span>
                              <span className="text-text-secondary">Dosage: {med.dosage}</span>
                              <span className="text-text-secondary">Frequency: {med.frequency}</span>
                              <span className="text-text-secondary">Duration: {med.duration}</span>
                            </div>
                          ))}
                        </div>
                        {c.prescription.notes && (
                          <p className="text-sm text-text-secondary mt-3 bg-white p-3 rounded-lg"><strong className="text-gray-700">Notes: </strong>{c.prescription.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ConsultationCard({ consultation: c, compact = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
            <span className="text-xs text-text-secondary">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{c.symptoms}</p>
          {c.duration && <p className="text-xs text-text-secondary mt-1">Duration: {c.duration}</p>}
          {c.doctor && <p className="text-sm font-medium text-primary mt-2">Assigned to: Dr. {c.doctor.name} â€” {c.doctor.specialization}</p>}
          {c.scheduledAt && (
            <p className="text-xs text-text-secondary mt-1">
              Scheduled: {new Date(c.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </div>
      </div>
      {c.meetLink && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <a href={c.meetLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
            Join Google Meet
          </a>
        </div>
      )}
      {c.prescription && !compact && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Prescription</p>
          <div className="space-y-1.5">
            {c.prescription.medicines?.map((med, j) => (
              <div key={j} className="text-xs text-gray-600 flex flex-wrap gap-x-3 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-semibold text-gray-800">{med.name}</span>
                <span>{med.dosage}</span><span>{med.frequency}</span><span>{med.duration}</span>
              </div>
            ))}
            {c.prescription.notes && <p className="text-xs text-text-secondary mt-1">Notes: {c.prescription.notes}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
