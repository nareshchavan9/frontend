import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ChevronRight
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
      try {
        const [patientsRes, analysesRes] = await Promise.all([
          api.get('/reports/admin/patients'),
          api.get('/predict/all')
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
    fetchData();
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) setSearchTerm(q);
  }, [location.search]);

  const filteredPatients = patients.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F5F5F5] relative">
      {/* Top Right Search Bar - Absolute Positioning */}
      <div className="absolute top-24 right-6 lg:right-10 w-full md:w-72 z-20">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input 
            type="text" 
            className="w-full pl-12 pr-6 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:border-[#111111] outline-none text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm" 
            placeholder="Search by name, email or ID..." 
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              navigate(`/doctor/search?q=${encodeURIComponent(val)}`, { replace: true });
            }}
          />
        </div>
      </div>

      {/* Editorial Header - Centered */}
      <div className="flex flex-col items-center text-center mb-16 mt-16 md:mt-0 gap-4">
        <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-2">
          <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
          Clinical Intelligence Hub
        </div>
        <h1 className="text-4xl font-bold text-[#111111] tracking-tight mb-2">Patient Registry</h1>
        <p className="text-[#6B7280] text-base font-medium max-w-lg leading-relaxed">
          Centralized database of all patient profiles and longitudinal medical archives.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-2 border-[#111111]/10 border-t-[#111111] rounded-full animate-spin mb-4" />
          <p className="text-[#6B7280] font-bold uppercase tracking-widest text-[10px]">Accessing Registry...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredPatients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPatients.map((p, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={p._id} 
                    className="bg-white p-6 rounded-[2rem] border border-[#E5E7EB] hover:border-[#111111] transition-all group flex flex-col shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 bg-[#F3F4F6] text-[#111111] rounded-xl flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-all">
                        <Users size={18} />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                        {p.type}
                      </span>
                    </div>

                    <div className="mb-8 flex-1">
                      <h3 className="text-lg font-bold text-[#111111] leading-tight mb-1 truncate">{p.name}</h3>
                      <p className="text-[10px] text-[#6B7280] font-medium truncate mb-6">{p.email}</p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F9FAFB] p-3 rounded-2xl border border-[#F3F4F6]">
                          <div className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Age</div>
                          <div className="text-sm font-bold text-[#111111]">{p.age || '??'}Y</div>
                        </div>
                        <div className="bg-[#F9FAFB] p-3 rounded-2xl border border-[#F3F4F6]">
                          <div className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Gender</div>
                          <div className="text-sm font-bold text-[#111111]">{(p.gender || 'U').charAt(0).toUpperCase()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#F3F4F6] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest">Analyses</span>
                        <span className="text-lg font-black text-[#111111]">{p.testCount}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/doctor/patient/${p._id}`)}
                        className="w-10 h-10 bg-[#111111] text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-black/10"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-[#E5E7EB] border-dashed">
              <Search size={32} className="mx-auto text-[#6B7280] mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-[#111111]">No Clinical Matches</h3>
              <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSearchPage;
