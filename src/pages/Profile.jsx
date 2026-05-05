import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Activity, LogOut, Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('image', file);

      const response = await api.put('/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser({ profile_image: response.data.profile_image });
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Failed to upload profile image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);

      const response = await api.put('/auth/profile', data);
      updateUser({ 
        name: response.data.name, 
        email: response.data.email 
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-28 pb-16 px-6 lg:px-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Editorial Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-[#6B7280] hover:text-[#111111] transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <ArrowLeft size={12} /> Back to dashboard
          </Link>
        </div>

        {/* Profile Header Card - Compact */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] mb-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F9FAFB] rounded-full -mr-24 -mt-24 opacity-50"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <div 
                className="w-24 h-24 bg-[#111111] text-white flex items-center justify-center rounded-[1.5rem] text-3xl font-bold shadow-xl overflow-hidden relative"
              >
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name)
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleImageClick}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-[#111111] rounded-lg border border-[#E5E7EB] flex items-center justify-center shadow-lg hover:bg-[#F3F4F6] transition-all disabled:opacity-50"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[#111111] tracking-tight">{user?.name}</h1>
                <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[8px] font-black uppercase tracking-widest rounded-md border border-[#E5E7EB]">
                  {user?.role}
                </span>
              </div>
              <p className="text-[#6B7280] text-xs font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} /> {user?.email}
              </p>
            </div>

            <button 
              onClick={logout}
              className="px-5 py-2.5 border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all rounded-xl"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Identity & Settings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">Identity Details</h3>
                  <p className="text-[10px] text-[#6B7280] mt-0.5 font-bold uppercase tracking-widest">Clinical Profile Sync</p>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] font-bold text-[#111111] hover:underline underline-offset-4 uppercase tracking-widest"
                  >
                    Edit
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-[10px] font-bold text-red-500 hover:underline underline-offset-4 uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-1">Full Identity Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#111111] transition-all ${!isEditing ? 'opacity-60' : ''}`}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-1">Clinical Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#111111] transition-all ${!isEditing ? 'opacity-60' : ''}`}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-[#111111] text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={14} />}
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] shadow-sm">
              <h3 className="text-lg font-bold text-[#111111] mb-8">Diagnostic Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                  <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Total Analyses</p>
                  <p className="text-3xl font-bold text-[#111111]">24</p>
                </div>
                <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                  <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Risk Flags</p>
                  <p className="text-3xl font-bold text-[#111111]">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-[#F3F4F6] text-[#111111] flex items-center justify-center rounded-lg">
                  <Shield size={16} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-[#111111]">Security</h3>
              </div>
              
                <div>
                  <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Data residency</p>
                  <p className="text-[11px] font-bold text-[#111111]">AES-256 Cloud Vault</p>
                </div>

                <div className="pt-2">
                  <button className="w-full py-3.5 border border-[#111111] text-[#111111] text-[10px] font-bold uppercase tracking-widest hover:bg-[#F3F4F6] transition-all rounded-xl">
                    Change Passkey
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
              <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
              <h4 className="text-lg font-bold mb-2 relative z-10">Clinical Concierge</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-6 relative z-10">Account or data residency questions?</p>
              <button className="text-[#E8A26A] font-bold text-[10px] uppercase tracking-widest hover:underline relative z-10">Get Help</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
