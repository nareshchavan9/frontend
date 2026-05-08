import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorSearchPage from './pages/DoctorSearchPage';
import DoctorAnalysisPage from './pages/DoctorAnalysisPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import GlobalHistoryPage from './pages/GlobalHistoryPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIHealthAssistant from './pages/AIHealthAssistant';
import Contact from './pages/Contact';


const AppRoutes = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isAIPath = location.pathname === '/ai-assistant';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/doctor');

  return (
    <>
      {!isAIPath && !isAuthPage && !isDashboardPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Patient Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <UploadPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <HistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-assistant" 
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
              <AIHealthAssistant />
            </ProtectedRoute>
          } 
        />


        {/* Doctor Routes */}
        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/analyze" 
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DoctorAnalysisPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/patient/:patientId" 
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <PatientHistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/history" 
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <GlobalHistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/search" 
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DoctorSearchPage />
            </ProtectedRoute>
          } 
        />

        {/* Placeholder for Admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DoctorDashboard /> {/* Reusing doctor dashboard for now */}
            </ProtectedRoute>
          } 
        />
      </Routes>
      {location.pathname === '/' && <Footer />}
    </>
  );
};

export default AppRoutes;
