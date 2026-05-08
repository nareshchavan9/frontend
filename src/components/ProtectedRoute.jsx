import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-teal-50 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-bold tracking-[0.4em] uppercase text-[10px] animate-pulse">Establishing Secure Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
