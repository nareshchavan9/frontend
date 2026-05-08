import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Pill, 
  User, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Activity,
  Heart,
  Droplets,
  Clock,
  ArrowRight,
  Download,
  Plus,
  Video,
  AlertCircle,
  TrendingUp,
  X,
  Menu,
  ShieldCheck,
  Zap,
  PhoneCall,
  Check,
  ChevronRight,
  Lightbulb,
  Trash2,
  Shield,
  History
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // UI State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // --- PREVIOUS DASHBOARD STATE ---
  const [lifestyleNotes, setLifestyleNotes] = useState([]);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', category: 'Activity' });
  const [stats, setStats] = useState({
    totalPredictions: 0,
    lastResult: 'N/A',
    confidence: 0
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Diagnostic Ready', message: 'Your ECG analysis v4.2 is complete.', time: '2m ago', icon: <FileText size={14} /> },
    { id: 2, title: 'Prescription Sync', message: 'Atorvastatin dosage updated by Dr. Chen.', time: '1h ago', icon: <Pill size={14} /> },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/predict/history');
        setRecentHistory(response.data);
        if (response.data.length > 0) {
          setStats({
            totalPredictions: response.data.length,
            lastResult: response.data[0].prediction,
            confidence: response.data[0].confidence
          });
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();

    const fetchProfile = async () => {
      try {
        if (user?.lifestyle_notes) {
          setLifestyleNotes(user.lifestyle_notes);
        }
      } catch (err) {}
    };
    fetchProfile();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/lifestyle-notes', newHabit);
      setLifestyleNotes([...lifestyleNotes, { ...newHabit, timestamp: new Date().toISOString() }]);
      setShowHabitModal(false);
      setNewHabit({ title: '', category: 'Activity' });
    } catch (err) {
      alert('Failed to add note');
    }
  };

  const handleDeleteHabit = async (timestamp) => {
    try {
      await api.delete(`/auth/lifestyle-notes/${timestamp}`);
      setLifestyleNotes(lifestyleNotes.filter(n => n.timestamp !== timestamp));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };



  return (
    <div className="flex h-screen bg-[#F8FAFC] font-['Inter'] overflow-hidden">
      {/* Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-72 bg-[#1A1A1A] text-white flex flex-col z-50 shrink-0"
          >
            <div className="p-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight font-['Poppins']">HeartSync</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
              <SidebarItem icon={<Plus size={20} />} label="New Analysis" active={activeTab === 'NewAnalysis'} onClick={() => navigate('/upload')} />
              <SidebarItem icon={<FileText size={20} />} label="Medical Reports" active={activeTab === 'Reports'} onClick={() => navigate('/history')} />
              <SidebarItem icon={<Pill size={20} />} label="Prescriptions" active={activeTab === 'Prescriptions'} onClick={() => navigate('/profile')} />
              <SidebarItem icon={<User size={20} />} label="Doctors" active={activeTab === 'Doctors'} onClick={() => navigate('/doctor/search')} />
              <SidebarItem icon={<MessageSquare size={20} />} label="AI Assistant" active={activeTab === 'AI'} onClick={() => navigate('/ai-assistant')} />
              <SidebarItem icon={<CreditCard size={20} />} label="Billing" active={activeTab === 'Billing'} onClick={() => navigate('/profile')} />
              <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => navigate('/profile')} />
            </nav>

            <div className="p-6 border-t border-white/5">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-40">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <Menu size={20} />
            </button>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/history?q=${encodeURIComponent(searchQuery)}`);
              }
            }} className="max-w-md w-full relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search telemetry history..." 
                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-6">
             {/* Notifications */}
             <div className="relative" ref={notificationRef}>
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className="relative p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-[#14B8A6] hover:bg-teal-50 transition-all"
               >
                 <Bell size={20} />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#14B8A6] rounded-full border-2 border-white"></span>
               </button>
               
               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                     className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden z-50"
                   >
                     <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Alerts</span>
                       <button className="text-[9px] font-bold text-[#14B8A6] hover:underline">Mark all read</button>
                     </div>
                     <div className="max-h-80 overflow-y-auto">
                       {notifications.map(n => (
                         <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-teal-50 text-[#14B8A6] rounded-lg flex items-center justify-center shrink-0">{n.icon}</div>
                              <div>
                                <h4 className="text-xs font-bold text-[#1A1A1A]">{n.title}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{n.message}</p>
                                <span className="text-[9px] text-slate-300 font-medium mt-2 block">{n.time}</span>
                              </div>
                            </div>
                         </div>
                       ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
             
             <div className="w-[1px] h-8 bg-slate-100 mx-2"></div>
             
             {/* Profile Menu */}
             <div className="relative" ref={profileRef}>
               <button 
                 onClick={() => setShowProfileMenu(!showProfileMenu)}
                 className="flex items-center gap-4 cursor-pointer group p-1 pr-3 rounded-2xl hover:bg-slate-50 transition-all"
               >
                  <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center shadow-sm border-2 border-white group-hover:border-teal-500/20 transition-all text-xs font-black">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'PT'}
                  </div>
                 <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#14B8A6] transition-colors">{user?.name.split(' ')[0]}</p>
                   <ChevronDown size={12} className="text-slate-300 ml-auto" />
                 </div>
               </button>

               <AnimatePresence>
                 {showProfileMenu && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                     className="absolute right-0 mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                   >
                     <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                       <User size={18} className="text-slate-400" /> My Profile
                     </button>
                     <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                       <Settings size={18} className="text-slate-400" /> Settings
                     </button>
                     <div className="h-[1px] bg-slate-50 my-1 mx-2"></div>
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                       <LogOut size={18} /> Sign Out
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1440px] mx-auto">
            {/* Conditional Rendering based on Tab or Search */}


            {/* Header Title */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Welcome, {user?.name.split(' ')[0]}</h1>
              <p className="text-slate-500 text-sm font-medium">Heart health summary and diagnostic history.</p>
            </div>

            {/* Grid Layout - Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <MetricCard 
                icon={<Activity className="text-[#14B8A6]" />} 
                label="Cumulative Tests" 
                value={stats.totalPredictions} 
                trend="+2"
              />
              <MetricCard 
                icon={<TrendingUp className="text-sky-500" />} 
                label="Latest Classification" 
                value={stats.lastResult.split('(')[0].trim()} 
                subValue={stats.lastResult !== 'N/A' ? `${(stats.confidence * 100).toFixed(0)}% accuracy` : 'No telemetry data'}
                isAlert={!stats.lastResult.toLowerCase().includes('normal') && stats.lastResult !== 'N/A'}
              />
              <MetricCard 
                icon={<ShieldCheck className="text-teal-600" />} 
                label="Security Protocol" 
                value="Active" 
                subValue="End-to-end Encrypted"
              />
              
              <motion.button 
                whileHover={{ y: -3 }}
                onClick={() => setShowTips(true)}
                className="premium-card group text-left relative overflow-hidden bg-white p-6"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-10 h-10 bg-teal-50 text-[#14B8A6] flex items-center justify-center rounded-xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all">
                    <Lightbulb size={20} />
                  </div>
                  <span className="text-[8px] font-bold text-[#14B8A6] border border-teal-100 px-2 py-0.5 rounded-full uppercase tracking-widest bg-white">Expert Tip</span>
                </div>
                <div className="mt-auto relative z-10">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Wellness Intelligence</div>
                  <div className="text-lg font-bold text-[#1A1A1A]">Daily Heart Insights</div>
                </div>
              </motion.button>
            </div>

            {/* Habits & Activities Section */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <ArrowRight size={12} className="text-[#14B8A6]" /> Lifestyle & Habits
                </h3>
                <button 
                  onClick={() => setShowHabitModal(true)}
                  className="text-[9px] font-bold text-[#14B8A6] uppercase tracking-[0.2em] hover:underline underline-offset-8 flex items-center gap-2 group"
                >
                  <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Log Activity
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {lifestyleNotes.length > 0 ? (
                  lifestyleNotes.slice(-4).reverse().map((note, idx) => (
                    <div key={idx} className="premium-card bg-white p-6 relative group border-teal-50/50 hover:border-[#14B8A6]">
                      <div className="text-[8px] font-bold uppercase tracking-widest mb-4 flex items-center justify-between">
                        <span className={note.category === 'Risk/Habit' ? 'text-red-400' : 'text-slate-400'}>
                          {note.category}
                        </span>
                        <button 
                          onClick={() => handleDeleteHabit(note.timestamp)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="text-[13px] font-bold text-[#1A1A1A] mb-3 leading-tight">{note.title}</div>
                      <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={10} /> {new Date(note.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lg:col-span-4 p-16 bg-white rounded-[2.5rem] border border-dashed border-teal-100 text-center group hover:border-[#14B8A6] transition-colors cursor-pointer" onClick={() => setShowHabitModal(true)}>
                    <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">No clinical logs detected. Initialize activity tracking.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Clinical Operations */}
            <div className="mb-24">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <ArrowRight size={12} className="text-[#14B8A6]" /> Active Clinical Operations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CompactActionCard 
                  to="/history"
                  icon={<History className="text-teal-500" />}
                  title="Clinical Archives"
                  description="Access cumulative diagnostic history."
                />
                <CompactActionCard 
                  to="/upload"
                  icon={<Activity className="text-sky-500" />}
                  title="Neural Classification"
                  description="Initiate new telemetry analysis."
                />
              </div>
            </div>

            {/* Compliance Footer */}
            <div className="mt-20 -mx-8 px-8 py-16 bg-white border-t border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
              <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="text-[#14B8A6] w-5 h-5" />
                      <h3 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em]">System Compliance</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Professional diagnostic data residency protected by AES-256 encryption. 
                      Our neural architecture complies with global healthcare interoperability standards.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-10">
                    <SecurityBadge label="AES-256" />
                    <SecurityBadge label="HIPAA COMPLIANT" />
                    <SecurityBadge label="SOVEREIGN DATA" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showTips && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTips(false)} className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative z-10 shadow-3xl border border-teal-50">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] rounded-2xl flex items-center justify-center"><Lightbulb size={24} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">Clinical Insights</h3>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">Expert Wellness Protocols</p>
                  </div>
                </div>
                <button onClick={() => setShowTips(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="space-y-6 mb-10">
                <TipItem title="Cardiac Movement" text="Try to maintain 30 minutes of moderate aerobic activity daily." />
                <TipItem title="Electrolyte Control" text="Manage sodium intake to under 2,300mg to reduce cardiac strain." />
                <TipItem title="Hyper-Hydration" text="Consistent fluid intake supports efficient neural cardiac function." />
              </div>
              <button onClick={() => setShowTips(false)} className="btn-premium-teal w-full py-4 text-[10px] uppercase tracking-[0.3em]">Sync with Routine</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHabitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHabitModal(false)} className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative z-10 shadow-3xl border border-teal-50">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] rounded-2xl flex items-center justify-center"><Activity size={24} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">Log Activity</h3>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">Telemetry Tracking</p>
                  </div>
                </div>
                <button onClick={() => setShowHabitModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20} className="text-slate-400" /></button>
              </div>
              <form onSubmit={handleAddHabit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Event Description</label>
                  <input type="text" required placeholder="e.g. 30 min morning walk" className="input-premium w-full" value={newHabit.title} onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                  <select className="input-premium w-full appearance-none pr-10" value={newHabit.category} onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}>
                    <option value="Activity">Activity / Exercise</option>
                    <option value="Nutrition">Nutrition / Diet</option>
                    <option value="Wellness">Wellness / Sleep</option>
                    <option value="Medication">Medication</option>
                    <option value="Risk/Habit">Risk / Habit</option>
                  </select>
                </div>
                <button type="submit" className="btn-premium-teal w-full py-4 text-[10px] uppercase tracking-[0.3em] mt-4">Confirm Entry</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] group ${active ? 'bg-[#14B8A6] text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-[#14B8A6] transition-colors'}`}>{icon}</span>
    {label}
  </button>
);

const MetricCard = ({ icon, label, value, subValue, trend, isAlert }) => (
  <div className="premium-card group bg-white p-6 relative">
    <div className="flex justify-between items-start mb-8">
      <div className={`w-11 h-11 bg-slate-50 text-[#1A1A1A] flex items-center justify-center rounded-xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-transparent`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {trend && (
        <span className="text-[9px] font-bold text-[#14B8A6] bg-teal-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
          {trend}
        </span>
      )}
      {isAlert && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-lg">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
           <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Alert</span>
        </div>
      )}
    </div>
    <div className="mt-auto">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-1">{value}</div>
      {subValue && <div className="text-[10px] font-medium text-slate-400 tracking-tight">{subValue}</div>}
    </div>
  </div>
);

const CompactActionCard = ({ to, icon, title, description }) => (
  <Link to={to} className="premium-card bg-white p-5 flex items-center gap-5 group border-slate-50">
    <div className="w-11 h-11 bg-teal-50 text-[#14B8A6] flex items-center justify-center rounded-xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all shrink-0">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight truncate group-hover:text-[#14B8A6] transition-colors">{title}</h4>
      <p className="text-[11px] text-slate-400 truncate font-medium">{description}</p>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
  </Link>
);

const SecurityBadge = ({ label }) => (
  <div className="flex items-center gap-3">
    <div className="w-2 h-2 bg-[#14B8A6] rounded-full shadow-[0_0_8px_rgba(20,184,166,0.4)]"></div>
    <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const TipItem = ({ title, text }) => (
  <div className="flex gap-5 group">
    <div className="w-1 h-12 bg-teal-50 rounded-full group-hover:bg-[#14B8A6] transition-colors"></div>
    <div>
      <div className="font-bold text-[#1A1A1A] text-[15px] mb-1">{title}</div>
      <div className="text-xs text-slate-400 leading-relaxed font-medium">{text}</div>
    </div>
  </div>
);

export default PatientDashboard;
