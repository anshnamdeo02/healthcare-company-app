import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatientSignup from './pages/PatientSignup';
import PatientLogin from './pages/PatientLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PatientDashboard from './pages/PatientDashboard';
import DoctorSignup from './pages/DoctorSignup';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Patient Routes */}
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/forgot-password" element={<ForgotPassword />} />
      <Route path="/patient/reset-password" element={<ResetPassword />} />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route path="/doctor/signup" element={<DoctorSignup />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
