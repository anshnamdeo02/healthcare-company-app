import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const prescriptionSchema = z.object({
  medicines: z.array(z.object({
    name: z.string().min(1, 'Medicine name required'),
    dosage: z.string().min(1, 'Dosage required'),
    frequency: z.string().min(1, 'Frequency required'),
    duration: z.string().min(1, 'Duration required'),
  })).min(1, 'Add at least one medicine'),
  notes: z.string().optional(),
});

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  SCHEDULED: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [prescribingId, setPrescribingId] = useState(null);

  const fetchData = async () => {
    try {
      const [dashRes, consultRes] = await Promise.all([
        api.get('/doctor/dashboard'),
        api.get('/consultations/doctor'),
      ]);
      setDoctor(dashRes.data.data);
      setConsultations(consultRes.data.data);
    } catch (err) {
      if (err.response?.status === 401) return logout();
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (<div className="min-h-screen bg-gray-50"><Navbar /><LoadingSpinner /></div>);
  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-danger text-lg">{error}</p>
        <button onClick={fetchData} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium">Retry</button>
      </div>
    </div>
  );

  const profile = doctor;
  const activeConsultations = consultations.filter((c) => c.status !== 'COMPLETED');
  const completedConsultations = consultations.filter((c) => c.status === 'COMPLETED');

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'consultations', label: `Consultations${consultations.length ? ` (${consultations.length})` : ''}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-teal-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {profile?.name?.charAt(0) || 'D'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dr. {profile?.name}</h1>
              <p className="text-white/80 text-sm mt-1">{profile?.specialization} &bull; {profile?.hospital}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Active</p>
              <p className="text-xl font-bold">{activeConsultations.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Completed</p>
              <p className="text-xl font-bold">{completedConsultations.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Total</p>
              <p className="text-xl font-bold">{consultations.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary hover:bg-bg-light'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Profile Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Email', value: profile?.email },
                  { label: 'Specialization', value: profile?.specialization },
                  { label: 'Experience', value: profile?.experience ? `${profile.experience} yrs` : undefined },
                  { label: 'Hospital', value: profile?.hospital },
                  { label: 'Registration No.', value: profile?.registrationNumber },
                  { label: 'Registration State', value: profile?.registrationState },
                  { label: 'Patients Treated', value: profile?.patientsTreated ? `${profile.patientsTreated}+` : undefined },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className="text-sm font-medium text-text-primary text-right max-w-[55%]">{item.value ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">Active Consultations</h3>
                <button onClick={() => setActiveTab('consultations')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              {activeConsultations.length === 0 ? (
                <div className="text-center py-10 text-text-secondary text-sm">No active consultations assigned.</div>
              ) : (
                <div className="space-y-3">
                  {activeConsultations.slice(0, 4).map((c) => (
                    <div key={c.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{c.patient?.name}</p>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-1">{c.symptoms}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONSULTATIONS ── */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            {activeConsultations.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block" />
                  Active Consultations ({activeConsultations.length})
                </h3>
                <div className="space-y-4">
                  {activeConsultations.map((c) => (
                    <ConsultationCard key={c.id} consultation={c}
                      prescribingId={prescribingId}
                      onPrescribeToggle={setPrescribingId}
                      onPrescribed={(updated) => {
                        setConsultations((prev) => prev.map((x) => x.id === updated.id ? updated : x));
                        setToast({ message: 'Prescription added successfully!', type: 'success' });
                        setPrescribingId(null);
                      }}
                      onError={(msg) => setToast({ message: msg, type: 'error' })}
                    />
                  ))}
                </div>
              </div>
            )}
            {completedConsultations.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block" />
                  Completed ({completedConsultations.length})
                </h3>
                <div className="space-y-4">
                  {completedConsultations.map((c) => (
                    <ConsultationCard key={c.id} consultation={c} prescribingId={null} onPrescribeToggle={() => {}} onPrescribed={() => {}} onError={() => {}} />
                  ))}
                </div>
              </div>
            )}
            {consultations.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-text-secondary text-sm">
                No consultations assigned yet.
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ConsultationCard({ consultation: c, prescribingId, onPrescribeToggle, onPrescribed, onError }) {
  const isOpen = prescribingId === c.id;
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: { medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], notes: '' },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'medicines' });

  const submitPrescription = async (data) => {
    try {
      const res = await api.post(`/consultations/prescriptions/${c.id}`, data);
      onPrescribed(res.data.data);
      reset();
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to add prescription.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
            <span className="text-xs text-text-secondary">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <h4 className="text-sm font-bold text-text-primary">Patient: {c.patient?.name}</h4>
          <p className="text-xs text-text-secondary">{c.patient?.email}</p>
        </div>
        {c.status !== 'COMPLETED' && (
          <button onClick={() => onPrescribeToggle(isOpen ? null : c.id)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isOpen ? 'bg-gray-100 text-gray-700' : 'bg-primary text-white hover:bg-primary-dark'}`}>
            {isOpen ? 'Cancel' : '+ Add Prescription'}
          </button>
        )}
      </div>

      <div className="p-3 bg-gray-50 rounded-xl mb-3">
        <p className="text-xs font-semibold text-text-secondary mb-1">Symptoms</p>
        <p className="text-sm text-text-primary">{c.symptoms}</p>
        {c.duration && <p className="text-xs text-text-secondary mt-1">Duration: {c.duration}</p>}
      </div>

      {c.scheduledAt && (
        <p className="text-xs text-text-secondary mb-3">Scheduled: {new Date(c.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      )}

      {c.meetLink && (
        <a href={c.meetLink} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          Join Google Meet
        </a>
      )}

      {c.prescription && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Prescription Added</p>
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

      {isOpen && (
        <form onSubmit={handleSubmit(submitPrescription)} className="mt-4 space-y-4 border-t border-gray-100 pt-4">
          <h5 className="text-sm font-bold text-text-primary">Add Prescription</h5>
          {fields.map((field, i) => (
            <div key={field.id} className="bg-gray-50 rounded-xl p-4 relative">
              <p className="text-xs font-semibold text-text-secondary mb-3">Medicine {i + 1}</p>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-danger text-xs">Remove</button>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { field: 'name', label: 'Medicine Name', placeholder: 'e.g., Paracetamol' },
                  { field: 'dosage', label: 'Dosage', placeholder: 'e.g., 500mg' },
                  { field: 'frequency', label: 'Frequency', placeholder: 'e.g., Twice a day' },
                  { field: 'duration', label: 'Duration', placeholder: 'e.g., 5 days' },
                ].map(({ field: f, label, placeholder }) => (
                  <div key={f}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                    <input {...register(`medicines.${i}.${f}`)} placeholder={placeholder}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.medicines?.[i]?.[f] ? 'border-danger focus:ring-danger/25' : 'border-gray-300 focus:ring-primary/25 focus:border-primary'}`} />
                    {errors.medicines?.[i]?.[f] && <p className="text-danger text-xs mt-0.5">{errors.medicines[i][f].message}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })}
            className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add another medicine
          </button>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Doctor Notes (optional)</label>
            <textarea {...register('notes')} rows={2} placeholder="Any additional instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { onPrescribeToggle(null); reset(); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              {isSubmitting ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
