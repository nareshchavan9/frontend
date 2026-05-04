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
  Clock
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

  const filteredPatients = patients.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredAnalyses = analyses.filter(a => 
    (a.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${predictionId}.pdf`);
      link.click();
    } catch (err) { console.error('Download failed', err); }
  };

  const handleView = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      window.open(URL.createObjectURL(file));
    } catch (err) { console.error('View failed', err); }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Search Header */}
      <div className="mb-12">
        <button 
          onClick={() => navigate('/doctor')}
          className="flex items-center gap-2 text-slate-500 hover:text-healthcare-blue font-bold transition-colors mb-6"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold text-healthcare-dark mb-4 tracking-tight">Global Clinical Search</h1>
          <p className="text-slate-500 mb-8">Search across all registered patients and diagnostic analysis history.</p>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-healthcare-blue transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              autoFocus
              className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 outline-none focus:border-healthcare-blue focus:shadow-2xl focus:shadow-healthcare-blue/10 transition-all text-xl font-medium shadow-sm"
              placeholder="Enter patient name, email, or record ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-healthcare-blue border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Records...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {searchTerm && (
            <>
              {/* Patient Results */}
              {filteredPatients.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-healthcare-blue rounded-lg">
                        <Users size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-healthcare-dark">Matching Clinical Records ({filteredPatients.length})</h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPatients.map(p => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={p._id} 
                        className="glass-card overflow-hidden hover:shadow-2xl transition-all border border-slate-100 group flex flex-col"
                      >
                        {/* Header Highlight */}
                        <div className={`h-2 w-full ${p.type === 'self' ? 'bg-healthcare-blue' : 'bg-teal-500'}`} />
                        
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.type === 'self' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                              {p.type === 'self' ? 'Patient App User' : 'Clinical Record'}
                            </span>
                            <span className="text-xs text-slate-300 font-mono">ID: {p._id.slice(-8)}</span>
                          </div>

                          <h3 className="text-2xl font-black text-healthcare-dark mb-1 group-hover:text-healthcare-blue transition-colors">{p.name}</h3>
                          <p className="text-sm text-slate-400 mb-6 font-medium">{p.email}</p>

                          {/* Demographic Details - Matching the Profile View */}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-3 rounded-2xl">
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Age</div>
                              <div className="text-lg font-bold text-healthcare-dark">{p.age || 'N/A'} <span className="text-xs font-medium text-slate-400">Years</span></div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</div>
                              <div className="text-lg font-bold text-healthcare-dark">{(p.gender || 'Unknown').charAt(0).toUpperCase()}{(p.gender || 'Unknown').slice(1)}</div>
                            </div>
                            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50 col-span-2">
                              <div className="text-[10px] font-bold text-healthcare-blue uppercase mb-1">Total Clinical Analyses</div>
                              <div className="text-xl font-black text-healthcare-blue">{p.testCount} <span className="text-xs font-bold text-blue-400 tracking-normal ml-1">Records Found</span></div>
                            </div>
                          </div>

                          <div className="mt-auto pt-6 border-t border-slate-100">
                            <button 
                              onClick={() => navigate(`/doctor/patient/${p._id}`)}
                              className="w-full py-4 bg-healthcare-dark text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
                            >
                              View Full Medical Profile <ArrowUpRight size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-healthcare-dark">No records found</h3>
                  <p className="text-slate-400 mt-2">We couldn't find any patient matching "{searchTerm}"</p>
                </div>
              )}
            </>
          )}

          {!searchTerm && (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-blue-50 text-healthcare-blue rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <h2 className="text-2xl font-bold text-healthcare-dark">Start Typing to Search</h2>
              <p className="text-slate-400 mt-2">Enter patient clinical metadata to begin investigation.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSearchPage;
