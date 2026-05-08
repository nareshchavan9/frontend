import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Activity, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  AlertCircle,
  TrendingUp,
  X,
  Menu,
  ShieldCheck,
  Clipboard,
  ChevronRight,
  ArrowRight,
  Download,
  Filter,
  Eye,
  User,
  Zap,
  PhoneCall
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // UI State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Clinical State
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = [
    { id: 1, title: 'Critical Alert', message: 'Patient Sarah Jenkins shows Arrhythmia.', time: '2m ago', icon: <AlertCircle size={14} className="text-red-500" /> },
    { id: 2, title: 'System Update', message: 'Neural Engine v4.2 optimization complete.', time: '1h ago', icon: <ShieldCheck size={14} className="text-teal-500" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, analysesRes] = await Promise.all([
          api.get('/reports/admin/patients'),
          api.get('/predict/all')
        ]);
        
        const selfRegistered = patientsRes.data.map(p => ({
          ...p,
          type: 'self',
          patient_name: p.name
        }));

        const clinicalPatientMap = new Map();
        analysesRes.data.forEach(a => {
          if (a.patient_name && !selfRegistered.some(p => p.name === a.patient_name)) {
            if (!clinicalPatientMap.has(a.patient_name)) {
              clinicalPatientMap.set(a.patient_name, {
                _id: a._id,
                name: a.patient_name,
                patient_name: a.patient_name,
                email: 'N/A (Clinical)',
                age: a.notes?.match(/Age:\s*(\d+)/)?.[1] || '??',
                gender: a.notes?.match(/Gender:\s*(\w+)/)?.[1] || 'Unknown',
                type: 'clinical'
              });
            }
          }
        });

        const allPatients = [...selfRegistered, ...Array.from(clinicalPatientMap.values())].map(p => {
          const count = analysesRes.data.filter(a => 
            a.user_id === p._id || (a.patient_name && a.patient_name === p.name)
          ).length;
          return { ...p, testCount: count };
        });
        setPatients(allPatients);
        setAnalyses(analysesRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <SidebarItem icon={<Users size={20} />} label="Patient Registry" active={activeTab === 'Patients'} onClick={() => navigate('/doctor/search')} />
              <SidebarItem icon={<History size={20} />} label="Clinical Archives" active={activeTab === 'Archives'} onClick={() => navigate('/doctor/history')} />
              <SidebarItem icon={<Zap size={20} />} label="New Analysis" active={activeTab === 'Analysis'} onClick={() => navigate('/doctor/analyze')} />
              <SidebarItem icon={<MessageSquare size={20} />} label="AI Consult" active={activeTab === 'Consult'} onClick={() => navigate('/ai-assistant')} />
              <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => navigate('/profile')} />
            </nav>

            <div className="p-6 border-t border-white/5">
              <div className="bg-teal-500/10 rounded-2xl p-4 mb-4">
                <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-1">Neural Precision</p>
                <div className="flex items-center justify-between">
                   <span className="text-lg font-black text-white">98.5%</span>
                   <ShieldCheck size={16} className="text-teal-500" />
                </div>
              </div>
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
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-all">
              <Menu size={20} />
            </button>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/doctor/search?q=${encodeURIComponent(searchTerm)}`);
              }
            }} className="max-w-md w-full relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search patient registry or reports..." 
                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               
               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                     className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden z-50"
                   >
                     <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diagnostic Alerts</span>
                       <button className="text-[9px] font-bold text-[#14B8A6] hover:underline">Mark all read</button>
                     </div>
                     <div className="max-h-80 overflow-y-auto">
                       {notifications.map(n => (
                         <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">{n.icon}</div>
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
                   DR
                 </div>
                 <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#14B8A6] transition-colors">Dr. {user?.name.split(' ').pop()}</p>
                   <ChevronDown size={12} className="text-slate-300 ml-auto" />
                 </div>
               </button>

               <AnimatePresence>
                 {showProfileMenu && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                     className="absolute right-0 mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                   >
                     <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical Board ID</p>
                        <p className="text-xs font-bold text-[#1A1A1A]">PHY-882-990</p>
                     </div>
                     <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                       <User size={18} className="text-slate-400" /> Physician Profile
                     </button>
                     <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                       <Settings size={18} className="text-slate-400" /> Admin Settings
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
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-3">
                  <span className="w-6 h-[1px] bg-teal-100"></span>
                  Physician Diagnostic Hub
                </div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Clinical Overview</h1>
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  Monitoring {patients.length} active patient profiles in real-time.
                </p>
              </div>
              
              <Link to="/doctor/analyze" className="btn-premium-teal group px-8 py-3.5 shadow-xl shadow-teal-500/20">
                <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Analysis
              </Link>
            </div>

            {/* Grid Layout - Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              <MetricCard 
                icon={<Users className="text-teal-500" />} 
                label="Active Registry" 
                value={patients.length} 
                trend="+12%"
              />
              <MetricCard 
                icon={<Clipboard className="text-sky-500" />} 
                label="Total Records" 
                value={analyses.length} 
                subValue="84 New this week"
              />
              <MetricCard 
                icon={<AlertCircle className="text-red-400" />} 
                label="Critical Review" 
                value={analyses.filter(a => a.prediction !== 'Normal').length} 
                isAlert={true}
                trend="Action Required"
              />
              <MetricCard 
                icon={<TrendingUp className="text-teal-600" />} 
                label="Neural Accuracy" 
                value="98.5%" 
                subValue="v4.2 Neural Engine"
              />
            </div>

            {/* Recent Patients Table (Simplified) */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <ArrowRight size={12} className="text-[#14B8A6]" /> Recent Diagnostic Activity
                </h3>
                <Link to="/doctor/search" className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.2em] hover:underline underline-offset-8">Full Registry</Link>
              </div>
              
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Profile</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Count</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {patients.slice(0, 5).map((patient, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/30 transition-all cursor-pointer" onClick={() => navigate(`/doctor/patient/${patient._id}`)}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#14B8A6] transition-colors">{patient.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{patient.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${patient.type === 'self' ? 'bg-sky-50 text-sky-600' : 'bg-teal-50 text-teal-600'}`}>
                              {patient.type}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-[#1A1A1A]">{patient.testCount} Tests</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all shadow-sm">
                              <ChevronRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Operations */}
            <div className="mb-24">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <ArrowRight size={12} className="text-[#14B8A6]" /> Clinical Command Center
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CompactActionCard 
                  to="/doctor/history"
                  icon={<History className="text-teal-500" />}
                  title="Global Archives"
                  description="View all system-wide telemetry reports."
                />
                <CompactActionCard 
                  to="/doctor/search"
                  icon={<Users className="text-sky-500" />}
                  title="Patient Registry"
                  description="Detailed management of all monitored profiles."
                />
                <CompactActionCard 
                  to="/ai-assistant"
                  icon={<MessageSquare className="text-teal-500" />}
                  title="AI Diagnostic Consult"
                  description="Query the neural model for insights."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
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
  <div className="premium-card group bg-white p-3 relative">
    <div className="flex justify-between items-start mb-2">
      <div className={`w-8 h-8 bg-slate-50 text-[#1A1A1A] flex items-center justify-center rounded-xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-transparent`}>
        {React.cloneElement(icon, { size: 14 })}
      </div>
      {trend && (
        <span className={`text-[9px] font-bold ${isAlert ? 'text-red-500 bg-red-50' : 'text-[#14B8A6] bg-teal-50'} px-2 py-0.5 rounded-lg uppercase tracking-wider`}>
          {trend}
        </span>
      )}
      {isAlert && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-red-50 rounded-lg">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
        </div>
      )}
    </div>
    <div className="mt-auto">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
      <div className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-1">{value}</div>
      {subValue && <div className="text-[10px] font-medium text-slate-400 tracking-tight">{subValue}</div>}
    </div>
  </div>
);

const CompactActionCard = ({ to, icon, title, description }) => (
  <Link to={to} className="premium-card bg-white p-3 flex items-center gap-2 group border-slate-50">
    <div className="w-8 h-8 bg-teal-50 text-[#14B8A6] flex items-center justify-center rounded-xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all shrink-0">
      {React.cloneElement(icon, { size: 14 })}
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="text-xs font-bold text-[#1A1A1A] tracking-tight truncate group-hover:text-[#14B8A6] transition-colors">{title}</h4>
      <p className="text-[10px] text-slate-400 truncate font-medium">{description}</p>
    </div>
    <ChevronRight size={14} className="text-slate-300 group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
  </Link>
);

export default DoctorDashboard;