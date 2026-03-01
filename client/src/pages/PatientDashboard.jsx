import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, prescRes, followRes] = await Promise.all([
        api.get('/patient/dashboard'),
        api.get('/patient/prescriptions'),
        api.get('/patient/followups'),
      ]);
      setDashboard(dashRes.data.data);
      setPrescriptions(prescRes.data.data);
      setFollowups(followRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2">Error Loading Dashboard</h2>
            <p className="text-text-secondary text-sm mb-4">{error}</p>
            <button onClick={fetchData} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = dashboard?.profile;
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'prescriptions', label: 'Prescriptions' },
    { key: 'followups', label: 'Follow-Ups' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Greeting Header */}
        <div className="bg-gradient-to-r from-primary to-teal-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {profile?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Hello, {profile?.name}</h1>
              <p className="text-white/80 text-sm mt-1">Welcome to your health dashboard</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Symptoms</p>
              <p className="text-xl font-bold">{dashboard?.currentSymptoms?.length || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Prescriptions</p>
              <p className="text-xl font-bold">{dashboard?.prescriptionsCount || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Follow-Ups</p>
              <p className="text-xl font-bold">{dashboard?.followupsCount || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs">Next Visit</p>
              <p className="text-sm font-bold">{dashboard?.currentFollowUp?.scheduledDate || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-primary hover:bg-bg-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profile Card */}
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
                    <span className="text-sm font-medium text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Symptoms */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Current Symptoms</h3>
              {dashboard?.currentSymptoms?.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.currentSymptoms.map((symptom, i) => (
                    <div key={symptom.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{symptom.name}</p>
                        <p className="text-xs text-text-secondary">Reported: {symptom.reportedAt}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        symptom.severity === 'high' ? 'bg-danger/10 text-danger' :
                        symptom.severity === 'moderate' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}>
                        {symptom.severity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary text-sm">
                  <p>No current symptoms reported</p>
                </div>
              )}

              {/* Current Follow-Up Status */}
              {dashboard?.currentFollowUp && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <h4 className="text-sm font-bold text-primary mb-2">Current Follow-Up</h4>
                  <p className="text-sm text-text-primary"><strong>Doctor:</strong> {dashboard.currentFollowUp.doctorName}</p>
                  <p className="text-sm text-text-secondary"><strong>Date:</strong> {dashboard.currentFollowUp.scheduledDate}</p>
                  <p className="text-sm text-text-secondary"><strong>Notes:</strong> {dashboard.currentFollowUp.notes}</p>
                  <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {dashboard.currentFollowUp.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prescriptions Tab — Timeline */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Past Prescriptions</h3>
            {prescriptions.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-8">
                  {prescriptions.map((rx, i) => (
                    <div key={rx.id || i} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 top-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow" />

                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h4 className="text-base font-bold text-text-primary">{rx.diagnosis}</h4>
                          <span className="text-xs font-medium text-text-secondary bg-white px-3 py-1 rounded-full">
                            {rx.date}
                          </span>
                        </div>
                        <p className="text-sm text-primary font-medium mb-3">by {rx.doctorName}</p>

                        <div className="space-y-2 mb-3">
                          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Medications</p>
                          {rx.medications?.map((med, j) => (
                            <div key={j} className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                              <span className="font-medium text-text-primary">{med.name}</span>
                              <span className="text-text-secondary">— {med.dosage}</span>
                              <span className="text-text-secondary text-xs">({med.duration})</span>
                            </div>
                          ))}
                        </div>

                        {rx.notes && (
                          <p className="text-sm text-text-secondary bg-white p-3 rounded-lg">
                            <span className="font-medium">Notes:</span> {rx.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-text-secondary text-sm">
                <p>No prescriptions found</p>
              </div>
            )}
          </div>
        )}

        {/* Follow-Ups Tab — Timeline */}
        {activeTab === 'followups' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Follow-Up History</h3>
            {followups.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {followups.map((fu, i) => (
                    <div key={fu.id || i} className="relative pl-12">
                      <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white shadow ${
                        fu.status === 'completed' ? 'bg-success' :
                        fu.status === 'scheduled' ? 'bg-primary' :
                        'bg-warning'
                      }`} />

                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-bold text-text-primary">{fu.doctorName}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              fu.status === 'completed' ? 'bg-success/10 text-success' :
                              fu.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                              'bg-warning/10 text-warning'
                            }`}>
                              {fu.status}
                            </span>
                            <span className="text-xs text-text-secondary">{fu.scheduledDate}</span>
                          </div>
                        </div>
                        {fu.notes && (
                          <p className="text-sm text-text-secondary">{fu.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-text-secondary text-sm">
                <p>No follow-ups found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
