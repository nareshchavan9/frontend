import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-healthcare-blue p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Heart className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-['Outfit'] font-bold text-healthcare-dark">
              Arrythmia<span className="text-healthcare-blue">Detector</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            
            {user ? (
              <>
                {user.role === 'patient' && (
                  <>
                    <Link to="/upload" className="nav-link">Upload ECG</Link>
                    <Link to="/history" className="nav-link">History</Link>
                  </>
                )}
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/dashboard'} 
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-healthcare-dark">{user.name}</span>
                    <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
