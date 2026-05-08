import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  ArrowUpRight, 
  Activity, 
  Eye, 
  Download,
  Users,
  Clipboard,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

const DoctorSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('q') || '');
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsRes, analysesRes] = await Promise.all([
          api.get(`/reports/admin/patients?search=${encodeURIComponent(searchTerm)}`),
          api.get(`/predict/all?search=${encodeURIComponent(searchTerm)}`)
        ]);

        const selfRegistered = patientsRes.data.map(p => ({ ...p, type: 'self' }));
        const clinicalPatientMap = new Map();
        analysesRes.data.forEach(a => {
          if (a.patient_name && !selfRegistered.some(p => p.name === a.patient_name)) {
            if (!clinicalPatientMap.has(a.patient_name)) {
              clinicalPatientMap.set(a.patient_name, {
                _id: a._id,
                name: a.patient_name,
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
        console.error('Search data fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) setSearchTerm(q);
  }, [location.search]);



  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F8FAFC] relative">
      {/* Top Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-[1px] bg-teal-100"></span>
            Clinical Intelligence Hub
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">Patient Registry</h1>
          <p className="text-slate-500 text-sm font-medium">Centralized database of all registered profiles and telemetry archives.</p>
        </div>

        <div className="w-full md:w-[420px] relative">
          <div className="relative group">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14B8A6] transition-colors" />
            <input 
              type="text" 
              className="input-premium w-full pl-16 pr-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm" 
              placeholder="SEARCH REGISTRY..." 
              value={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);
                navigate(`/doctor/search?q=${encodeURIComponent(val)}`, { replace: true });
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-teal-50 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">Accessing Medical Registry...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {patients.map((p, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={p._id} 
                    className="premium-card bg-white p-6 border-slate-50 hover:border-[#14B8A6] transition-all group flex flex-col shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 bg-slate-50 text-[#1A1A1A] rounded-2xl flex items-center justify-center group-hover:bg-[#14B8A6] group-hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-transparent">
                        <Users size={20} />
                      </div>
                      <div className={`text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border shadow-sm ${p.type === 'self' ? 'border-teal-100 text-[#14B8A6] bg-teal-50/20' : 'border-slate-100 text-slate-400 bg-slate-50'}`}>
                        {p.type}
                      </div>
                    </div>

                    <div className="mb-10 flex-1">
                      <h3 className="text-xl font-bold text-[#1A1A1A] leading-tight mb-2 truncate group-hover:text-[#14B8A6] transition-colors">{p.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mb-8 opacity-70">{p.email}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Age</div>
                          <div className="text-base font-black text-[#1A1A1A]">{p.age || '??'}<span className="text-[9px] text-slate-300 ml-1">Y</span></div>
                        </div>
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Gender</div>
                          <div className="text-base font-black text-[#1A1A1A]">{(p.gender || 'U').charAt(0).toUpperCase()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Analyses</span>
                        <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">{p.testCount}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/doctor/patient/${p._id}`)}
                        className="w-12 h-12 bg-[#1A1A1A] text-white rounded-[1.25rem] flex items-center justify-center hover:bg-[#14B8A6] transition-all shadow-xl shadow-black/5 hover:scale-110 active:scale-95"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 border-dashed">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">No Clinical Matches</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Try adjusting your registry search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Footer System Compliance Section */}
      <div className="mt-24 pt-16 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10 opacity-60">
         <div className="flex items-center gap-4">
            <ShieldCheck size={20} className="text-[#14B8A6]" />
            <div>
               <div className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em]">End-to-End Encryption</div>
               <div className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">AES-256 Symmetrical Protocols</div>
            </div>
         </div>
         <div className="flex gap-10">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Compliance Index: HIPAA</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Precision: Neural v4.2</div>
         </div>
      </div>
    </div>
  );
};

export default DoctorSearchPage;
