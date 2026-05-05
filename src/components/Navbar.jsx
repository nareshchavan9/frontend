import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Menu, 
  Plus
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] h-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-[#111111]" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-[#111111] hidden sm:block">Arrythmia</span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
            >
              Home
            </NavLink>
            
            {user && (
              <NavLink 
                to={user.role === 'doctor' ? '/doctor' : '/dashboard'} 
                className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
              >
                Dashboard
              </NavLink>
            )}

            <NavLink 
              to="/about" 
              className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
            >
              About Us
            </NavLink>

            <NavLink 
              to="/contact" 
              className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
            >
              Contact Us
            </NavLink>
          </div>

          {/* Right: Auth & Account */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <button className="p-2 text-[#6B7280] hover:text-[#111111] transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8A26A] rounded-full border-2 border-white"></span>
                </button>
                
                <div className="relative group flex items-center h-20">
                  <button className="flex items-center gap-3 py-2 pl-2 pr-4 hover:bg-[#F3F4F6] rounded-2xl transition-all">
                    <div className="w-9 h-9 bg-[#111111] text-white flex items-center justify-center rounded-xl text-xs font-bold tracking-tighter shadow-lg shadow-black/10">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-[13px] font-bold text-[#111111] hidden lg:block">Account</span>
                    <ChevronDown size={14} className="text-[#6B7280] transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full pt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[60]">
                    <div className="bg-white border border-[#E5E7EB] shadow-2xl py-2 rounded-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#F3F4F6]">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">{user.role}</p>
                        <p className="text-[13px] font-bold text-[#111111] truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 transition-colors border-t border-[#F3F4F6] mt-1 font-medium"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[13px] font-bold text-[#111111] hover:text-[#6B7280] transition-colors px-4 py-2.5">Login</Link>
                <Link to="/register" className="bg-[#111111] text-[#FFFFFF] px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#333333] transition-all shadow-lg shadow-black/10">Get Started</Link>
              </div>
            )}
            
            <button className="md:hidden p-2 text-[#111111]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
