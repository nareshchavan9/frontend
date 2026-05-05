import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Activity, LogOut, Camera, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  });

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-20 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Editorial Breadcrumb */}
        <div className="mb-12">
          <Link to="/" className="text-[#6B7280] hover:text-[#111111] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to inspiration
          </Link>
        </div>

        {/* Profile Header Card */}
        <div className="premium-job-card !p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F3F4F6] rounded-full -mr-32 -mt-32"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 bg-[#111111] text-white flex items-center justify-center rounded-[2rem] text-4xl font-bold shadow-2xl">
                {getInitials(user?.name)}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-[#111111] rounded-xl border border-[#E5E7EB] flex items-center justify-center shadow-lg hover:bg-[#F3F4F6] transition-all">
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                <h1 className="text-4xl font-bold text-[#111111] tracking-tight">{user?.name}</h1>
                <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#E5E7EB]">
                  {user?.role}
                </span>
              </div>
              <p className="text-[#6B7280] font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user?.email}
              </p>
            </div>

            <button 
              onClick={logout}
              className="px-6 py-3 border border-red-100 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all rounded-xl"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Identity & Settings */}
          <div className="lg:col-span-2 space-y-10">
            <div className="premium-job-card !p-12">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-xl font-bold text-[#111111]">Identity Details</h3>
                  <p className="text-sm text-[#6B7280] mt-1 font-medium">Update your professional clinical profile.</p>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-bold text-[#111111] hover:underline underline-offset-8"
                  >
                    Edit Details
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-sm font-bold text-red-500 hover:underline underline-offset-8"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="group">
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 ml-1">Full Identity Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    className={`input-standard w-full ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={!isEditing}
                  />
                </div>

                <div className="group">
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 ml-1">Clinical Email Reference</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    className={`input-standard w-full ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="btn-primary-dark flex items-center gap-3"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="premium-job-card !p-12">
              <h3 className="text-xl font-bold text-[#111111] mb-10">Diagnostic Activity</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-[#F9FAFB] rounded-[1.5rem] border border-[#E5E7EB]">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Total Analyses</p>
                  <p className="text-4xl font-bold text-[#111111]">24</p>
                </div>
                <div className="p-8 bg-[#F9FAFB] rounded-[1.5rem] border border-[#E5E7EB]">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Risk Flags</p>
                  <p className="text-4xl font-bold text-[#111111]">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Support Sidebar */}
          <div className="space-y-10">
            <div className="premium-job-card !p-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-[#F3F4F6] text-[#111111] flex items-center justify-center rounded-xl">
                  <Shield size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">Security</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Two-Factor Auth</p>
                  <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                    <span className="text-xs font-bold text-[#111111]">Inactive</span>
                    <button className="text-xs font-bold text-[#111111] hover:underline underline-offset-4">Enable</button>
                  </div>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Identity Encryption</p>
                  <p className="text-sm font-bold text-[#111111]">AES-256 Protocol Verified</p>
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 border border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-widest hover:bg-[#F3F4F6] transition-all rounded-2xl">
                    Update Pass-Key
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] p-10 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
              <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
              <h4 className="text-xl font-bold mb-3 relative z-10">Professional Support</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">Need help with your clinical account or data residency questions?</p>
              <button className="text-[#E8A26A] font-bold text-xs uppercase tracking-widest hover:underline relative z-10">Contact Concierge</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
