import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Activity, 
  LogOut, 
  Camera, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Droplet, 
  Clipboard, 
  Lock, 
  CreditCard, 
  Bell, 
  Smartphone, 
  Clock, 
  Globe, 
  Moon, 
  Download,
  FileText,
  ShieldCheck,
  ChevronRight,
  Eye,
  Plus,
  Settings,
  TrendingUp,
  X
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone_number: user?.phone_number || '',
    blood_group: user?.blood_group || '',
    address: '123 Medical Plaza, New York, NY',
    emergency_contact: 'Jane Doe (+1 234 567 890)',
    allergies: 'Penicillin, Peanuts',
    medical_history: 'Hypertension (Controlled), Myocardial Infarction (2022)'
  });

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: <User size={18} /> },
    { id: 'health', label: 'Health Records', icon: <Activity size={18} /> },
    { id: 'security', label: 'Security Settings', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Insurance & Billing', icon: <CreditCard size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={18} /> },
  ];

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const response = await api.post('/auth/profile-image', data);
      updateUser({ profile_image: response.data.profile_image });
      setStatusMessage({ type: 'success', text: 'Profile image updated successfully.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to upload profile image.' });
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
      if (formData.age) data.append('age', formData.age);
      data.append('gender', formData.gender);
      data.append('phone_number', formData.phone_number);
      data.append('blood_group', formData.blood_group);

      const response = await api.put('/auth/profile', data);
      updateUser({ ...response.data });
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Clinical data synchronized successfully.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to synchronize profile data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 lg:px-10 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
           <div className="flex items-center gap-8">
             <div className="relative group">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="w-32 h-32 bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative group-hover:scale-[1.02] transition-transform">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black">
                      {user?.name?.[0].toUpperCase()}
                    </div>
                  )}
                  <button 
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Camera size={24} />
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
             </div>
             <div>
               <div className="flex items-center gap-4 mb-2">
                 <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">{user?.name}</h1>
                 <span className="px-3 py-1 bg-teal-50 text-[#14B8A6] text-[10px] font-black uppercase tracking-widest rounded-lg border border-teal-100">
                   {user?.role === 'patient' ? 'Verified Patient' : 'Clinical Provider'}
                 </span>
               </div>
               <div className="flex items-center gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                 <p className="flex items-center gap-2"><Smartphone size={14} className="text-[#14B8A6]" /> ID: {user?._id ? user._id.slice(-8).toUpperCase() : 'N/A'}</p>
                 <p className="flex items-center gap-2"><User size={14} className="text-[#14B8A6]" /> {user?.age || '??'} Yrs / {user?.gender || 'N/A'}</p>
                 <p className="flex items-center gap-2"><MapPin size={14} className="text-[#14B8A6]" /> New York, NY</p>
               </div>
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="btn-outline-premium px-6 py-3.5"><ArrowLeft size={18} /> Back</button>
             <button onClick={() => setIsEditing(!isEditing)} className="btn-premium-teal px-8 py-3.5 shadow-xl shadow-teal-500/20">
               {isEditing ? 'Cancel Changes' : 'Edit Profile'}
             </button>
           </div>
        </div>

        {/* Status Alert */}
        <AnimatePresence>
          {statusMessage.text && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mb-8 p-5 rounded-2xl flex justify-between items-center ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-[#14B8A6]'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">{statusMessage.text}</span>
              <button onClick={() => setStatusMessage({ type: '', text: '' })}><X size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Internal Sidebar Sub-Nav */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm sticky top-32">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl mb-2 transition-all font-bold text-[13px] ${activeSection === section.id ? 'bg-[#1A1A1A] text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-[#1A1A1A]'}`}
                >
                  <span className={activeSection === section.id ? 'text-[#14B8A6]' : 'text-slate-300'}>{section.icon}</span>
                  {section.label}
                </button>
              ))}
              <div className="h-[1px] bg-slate-50 my-4 mx-2"></div>
              <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 font-bold text-[13px] hover:bg-red-50 transition-all">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1">
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-16 border border-slate-100 shadow-sm min-h-[600px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/20 rounded-full blur-3xl -mr-48 -mt-48 opacity-50 pointer-events-none"></div>
              
              <AnimatePresence mode="wait">
                {activeSection === 'personal' && (
                  <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-12 flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-[#14B8A6] rounded-full"></div>
                      Personal Information
                    </h2>
                    
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <ProfileField label="Full Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} isEditing={isEditing} icon={<User size={16} />} />
                      <ProfileField label="Clinical Email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} isEditing={isEditing} icon={<Mail size={16} />} />
                      <ProfileField label="Mobile Number" value={formData.phone_number} onChange={(v) => setFormData({...formData, phone_number: v})} isEditing={isEditing} icon={<Phone size={16} />} />
                      <ProfileField label="Blood Group" value={formData.blood_group} onChange={(v) => setFormData({...formData, blood_group: v})} isEditing={isEditing} type="select" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} icon={<Droplet size={16} />} />
                      <div className="md:col-span-2">
                        <ProfileField label="Home Address" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} isEditing={isEditing} icon={<MapPin size={16} />} />
                      </div>
                      <ProfileField label="Emergency Contact" value={formData.emergency_contact} onChange={(v) => setFormData({...formData, emergency_contact: v})} isEditing={isEditing} icon={<AlertCircle size={16} />} />
                      <ProfileField label="Known Allergies" value={formData.allergies} onChange={(v) => setFormData({...formData, allergies: v})} isEditing={isEditing} icon={<AlertCircle size={16} />} />
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Medical History Summary</label>
                        <textarea 
                          disabled={!isEditing}
                          value={formData.medical_history}
                          onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                          className={`w-full bg-[#F8FAFC] border-2 border-transparent p-6 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-teal-500 transition-all ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                          rows={4}
                        />
                      </div>
                      {isEditing && (
                        <div className="md:col-span-2 flex justify-end mt-6">
                           <button type="submit" disabled={loading} className="btn-premium-teal px-12 py-4 shadow-2xl">
                             {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Synchronize Profile
                           </button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                )}

                {activeSection === 'health' && (
                  <motion.div key="health" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-12 flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-[#14B8A6] rounded-full"></div>
                      Diagnostic Records
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                       <RecordCard title="ECG Analysis v4.2" date="May 05, 2026" status="Normal" icon={<Activity className="text-teal-500" />} />
                       <RecordCard title="Cardiology Report" date="Apr 12, 2026" status="Review Ready" icon={<FileText className="text-sky-500" />} />
                       <RecordCard title="Blood Chem Panel" date="Mar 20, 2026" status="Finalized" icon={<Droplet className="text-red-500" />} />
                       <RecordCard title="Stress Test Telemetry" date="Feb 15, 2026" status="Normal" icon={<TrendingUp className="text-[#14B8A6]" />} />
                    </div>
                    
                    <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Prescription Timeline</h4>
                        <button className="text-[10px] font-bold text-[#14B8A6] flex items-center gap-2"><Download size={14} /> Export CSV</button>
                      </div>
                      <div className="space-y-4">
                        <TimelineItem med="Lisinopril" dose="10mg / Once daily" status="Active" />
                        <TimelineItem med="Atorvastatin" dose="20mg / Bedtime" status="Active" />
                        <TimelineItem med="Amoxicillin" dose="500mg / Completed" status="Inactive" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-12 flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-[#14B8A6] rounded-full"></div>
                      Security Settings
                    </h2>
                    
                    <div className="space-y-8">
                       <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1A1A1A] shadow-sm"><Lock size={20} /></div>
                           <div>
                             <h4 className="text-sm font-black text-[#1A1A1A] mb-1">Access Credentials</h4>
                             <p className="text-xs text-slate-400 font-medium">Last changed 42 days ago</p>
                           </div>
                         </div>
                         <button className="btn-outline-premium px-6 py-2.5 text-[10px]">Modify Password</button>
                       </div>

                       <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#14B8A6] shadow-sm"><ShieldCheck size={20} /></div>
                           <div>
                             <h4 className="text-sm font-black text-[#1A1A1A] mb-1">Two-Factor Authentication</h4>
                             <p className="text-xs text-[#14B8A6] font-bold uppercase tracking-widest">Enhanced Security Active</p>
                           </div>
                         </div>
                         <div className="w-12 h-6 bg-[#14B8A6] rounded-full relative p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                         </div>
                       </div>

                       <div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3"><Smartphone size={14} /> Linked Devices</h4>
                         <div className="space-y-4">
                           <DeviceRow device="iPhone 15 Pro" location="Mumbai, IN" status="Current" icon={<Smartphone size={18} />} />
                           <DeviceRow device="MacBook Pro 16" location="Mumbai, IN" status="Active 2h ago" icon={<Globe size={18} />} />
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'billing' && (
                  <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-12 flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-[#14B8A6] rounded-full"></div>
                      Insurance & Billing
                    </h2>
                    
                    <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] text-white relative overflow-hidden mb-12 shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6] rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#14B8A6]">Primary Coverage</div>
                          <ShieldCheck size={24} className="text-[#14B8A6]" />
                        </div>
                        <h3 className="text-3xl font-black mb-1 font-['Poppins']">Aetna Health Premium</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-12">Policy: #HY-992-110-88</p>
                        <div className="flex justify-between items-end">
                           <div>
                             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                             <p className="text-xs font-black text-[#14B8A6] uppercase tracking-widest">Active & Verified</p>
                           </div>
                           <button className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Claim History</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3"><CreditCard size={14} /> Saved Payment Methods</h4>
                       <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[10px]">VISA</div>
                            <p className="text-sm font-bold text-[#1A1A1A]">•••• •••• •••• 4242</p>
                         </div>
                         <button className="text-red-400 text-[9px] font-black uppercase tracking-widest hover:underline">Remove</button>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'preferences' && (
                  <motion.div key="preferences" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-12 flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-[#14B8A6] rounded-full"></div>
                      User Preferences
                    </h2>
                    
                    <div className="space-y-8">
                       <PreferenceToggle label="Appointment Reminders" desc="Receive SMS and Email notifications before visits." active={true} icon={<Bell size={18} />} />
                       <PreferenceToggle label="Clinical Data Alerts" desc="Instant alerts when new analysis results are ready." active={true} icon={<Activity size={18} />} />
                       <PreferenceToggle label="Marketing Communications" desc="Receive news about heart health and platform updates." active={false} icon={<Mail size={18} />} />
                       
                       <div className="pt-8 border-t border-slate-50">
                         <div className="grid grid-cols-2 gap-8">
                           <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Interface Language</label>
                             <select className="input-premium w-full bg-[#F8FAFC]">
                               <option>English (US)</option>
                               <option>English (UK)</option>
                               <option>Spanish</option>
                               <option>French</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Visual Theme</label>
                             <div className="flex gap-4">
                               <button className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-3"><Moon size={14} /> Dark</button>
                               <button className="flex-1 py-3 bg-white border-2 border-teal-500 text-[#14B8A6] rounded-xl font-bold text-xs flex items-center justify-center gap-3">Light</button>
                             </div>
                           </div>
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const ProfileField = ({ label, value, onChange, isEditing, type = 'text', options = [], icon }) => (
  <div className="relative group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
      {icon && <span className="text-slate-300 group-focus-within:text-[#14B8A6] transition-colors">{icon}</span>}
      {label}
    </label>
    {type === 'select' ? (
      <select
        disabled={!isEditing}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#F8FAFC] border-2 border-transparent py-4 px-6 rounded-2xl outline-none text-[13px] font-bold focus:bg-white focus:border-teal-500 transition-all appearance-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input 
        type={type}
        disabled={!isEditing}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#F8FAFC] border-2 border-transparent py-4 px-6 rounded-2xl outline-none text-[13px] font-bold focus:bg-white focus:border-teal-500 transition-all ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
        placeholder={`Enter ${label}`}
      />
    )}
  </div>
);

const RecordCard = ({ title, date, status, icon }) => (
  <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-100 group hover:border-[#14B8A6] hover:bg-white transition-all cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
      <button className="p-2 text-slate-300 hover:text-[#14B8A6]"><Download size={18} /></button>
    </div>
    <h4 className="text-sm font-black text-[#1A1A1A] mb-1">{title}</h4>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</p>
    <div className="mt-6 flex items-center justify-between">
       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${status.includes('Normal') ? 'bg-teal-50 text-[#14B8A6]' : 'bg-sky-50 text-sky-600'}`}>{status}</span>
       <ChevronRight size={14} className="text-slate-200 group-hover:text-[#14B8A6] transition-all" />
    </div>
  </div>
);

const TimelineItem = ({ med, dose, status }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/50 last:border-0 group">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-[#14B8A6] animate-pulse' : 'bg-slate-300'}`}></div>
      <div>
        <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#14B8A6] transition-colors">{med}</p>
        <p className="text-[10px] text-slate-400 font-medium">{dose}</p>
      </div>
    </div>
    <span className={`text-[8px] font-black uppercase tracking-widest ${status === 'Active' ? 'text-[#14B8A6]' : 'text-slate-300'}`}>{status}</span>
  </div>
);

const DeviceRow = ({ device, location, status, icon }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 group hover:border-[#14B8A6] transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 text-[#1A1A1A] rounded-xl flex items-center justify-center group-hover:bg-[#14B8A6] group-hover:text-white transition-all">{icon}</div>
      <div>
        <p className="text-[13px] font-bold text-[#1A1A1A]">{device}</p>
        <p className="text-[10px] text-slate-400 font-medium">{location}</p>
      </div>
    </div>
    <span className={`text-[8px] font-black uppercase tracking-widest ${status === 'Current' ? 'text-[#14B8A6]' : 'text-slate-300'}`}>{status}</span>
  </div>
);

const PreferenceToggle = ({ label, desc, active, icon }) => (
  <div className="flex items-center justify-between gap-8 group">
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 bg-[#F8FAFC] text-slate-400 rounded-2xl flex items-center justify-center group-hover:text-[#14B8A6] transition-all">{icon}</div>
      <div>
        <h4 className="text-sm font-black text-[#1A1A1A] mb-1">{label}</h4>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all ${active ? 'bg-[#14B8A6]' : 'bg-slate-200'}`}>
       <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${active ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

// Added missing Settings import for preference icons
const SettingsIcon = Settings;

export default Profile;
