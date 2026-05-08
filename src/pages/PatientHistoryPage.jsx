import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Activity, 
  FileText, 
  Download, 
  User,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Shield,
  Clipboard,
  TrendingUp,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';

const PatientHistoryPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('Patient');
  const [patientData, setPatientData] = useState(null);
  const [showAllRecords, setShowAllRecords] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const patientsRes = await api.get('/reports/admin/patients');
        const profile = patientsRes.data.find(p => p._id === patientId);
        
        if (profile) {
          setPatientData(profile);
          setPatientName(profile.name);
        }

        const response = await api.get(`/predict/history/unified/${patientId}`);
        
        if (response.data.length > 0) {
          setHistory(response.data);
          
          if (!profile) {
            const first = response.data[0];
            const name = first.patient_name || 'Clinical Profile';
            setPatientName(name);
            
            const ageMatch = first.notes?.match(/Age:\s*(\d+)/);
            const genderMatch = first.notes?.match(/Gender:\s*(\w+)/);
            setPatientData({
              name: name,
              age: ageMatch ? ageMatch[1] : "??",
              gender: genderMatch ? genderMatch[1] : "Unknown",
              email: "N/A (Clinical)",
              type: "clinical"
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch patient history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  const handleDownload = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${predictionId}.pdf`);
      link.click();
      link.remove();
    } catch (err) { console.error(err); }
  };

  const handleView = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      window.open(URL.createObjectURL(file));
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="pt-28 flex justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-teal-50 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-bold tracking-[0.4em] uppercase text-[10px] animate-pulse">Retrieving Medical Archives...</p>
        </div>
      </div>
    );
  }

  const visibleHistory = showAllRecords ? history : history.slice(0, 3);

  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/doctor/search')} 
          className="btn-outline-premium group px-5 py-2.5 flex items-center gap-2"
        >
          <ChevronLeft size={16} className="text-slate-400 group-hover:text-[#14B8A6] transition-colors" /> <span className="text-[10px]">Registry</span>
        </button>

        <button 
          onClick={() => {
            navigate('/doctor/analyze', { 
              state: { 
                prefill: { 
                  id: patientId,
                  name: patientData?.name || patientName, 
                  age: patientData?.age || "", 
                  gender: (patientData?.gender || "male").toLowerCase()
                } 
              } 
            });
          }}
          className="btn-premium-teal group px-7 py-3 text-[10px] flex items-center gap-3 shadow-xl"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> New Analysis
        </button>
      </div>

      {/* Row 1: Profile Card & Longitudinal Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Profile Identity Card */}
        <div className="premium-card bg-white p-10 border-slate-50 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-[6rem] -z-0 opacity-40"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="w-14 h-14 bg-[#1A1A1A] text-white rounded-2xl flex items-center justify-center shadow-2xl">
                <User size={28} />
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-2">
                   <ShieldCheck size={14} className="text-[#14B8A6]" />
                   <span className="text-[10px] font-black text-[#1A1A1A] border border-teal-100 bg-teal-50/20 px-3 py-1 rounded-full uppercase tracking-widest">
                     {patientData?.type || 'Record'}
                   </span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-60">REF: {patientId.slice(-8).toUpperCase()}</span>
              </div>
            </div>
            
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">{patientName}</h1>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest truncate max-w-[300px] opacity-80">{patientData?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-auto">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-60">Clinical Age</div>
                <div className="text-2xl font-black text-[#1A1A1A]">{patientData?.age || '??'} <span className="text-[10px] font-bold text-slate-300 uppercase ml-1">Years</span></div>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-60">Gender Map</div>
                <div className="text-2xl font-black text-[#1A1A1A]">{(patientData?.gender || 'U').charAt(0).toUpperCase()}<span className="text-[10px] font-bold text-slate-300 uppercase ml-1">{(patientData?.gender || 'Unknown').slice(1)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Longitudinal Trend Chart */}
        <div className="premium-card bg-[#1A1A1A] p-10 text-white shadow-3xl relative overflow-hidden h-full border-transparent">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#14B8A6]/10 blur-3xl rounded-full"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.4em] flex items-center gap-3 mb-1">
                  <TrendingUp size={16} className="text-[#14B8A6]" /> Stability Index
                </h3>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Historical Telemetry Map</p>
              </div>
              <div className="px-3 py-1 rounded-full border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest bg-white/5">Neural v4.2</div>
            </div>
            
            <div className="flex justify-between items-end h-40 gap-4 mb-10 relative px-4">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 w-full"></div>
              
              {history.length > 0 ? (
                [...history].reverse().slice(-6).map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group relative h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((item.confidence * 100), 15)}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                      className={`w-full rounded-t-xl transition-all duration-500 relative shadow-lg ${item.prediction === 'Normal' ? 'bg-[#14B8A6] group-hover:bg-[#14B8A6]/80' : 'bg-red-500 group-hover:bg-red-500/80 shadow-red-500/20'}`}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all bg-white text-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-2xl scale-90 group-hover:scale-100">
                        {(item.confidence * 100).toFixed(0)}%
                      </div>
                    </motion.div>
                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-tighter text-center">
                      {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/20">
                  <Activity size={32} className="opacity-10" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] italic">No Telemetry Ingested</span>
                </div>
              )}
            </div>
            <div className="mt-auto flex items-center justify-between text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] pt-6 border-t border-white/5">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div> Active Pulse</span>
              <span className="text-white/60">{history.length} EVALUATIONS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Records Section */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-slate-50 pb-6">
          <h2 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.4em] flex items-center gap-4">
            <Clipboard size={16} className="text-[#14B8A6]" /> Clinical Timeline Archives
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleHistory.map((item, i) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card bg-white p-8 border-slate-50 hover:border-[#14B8A6] transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
              >
                <div className="flex items-center gap-8 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${item.prediction === 'Normal' ? 'bg-teal-50 text-[#14B8A6]' : 'bg-red-50 text-red-500'} group-hover:bg-[#1A1A1A] group-hover:text-white`}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full border shadow-sm ${item.prediction === 'Normal' ? 'border-teal-100 text-[#14B8A6] bg-teal-50/20' : 'border-red-100 text-red-500 bg-red-50'}`}>
                        {item.prediction}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 opacity-60">
                        <Calendar size={12} /> {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-[#1A1A1A] mb-1 tracking-tight group-hover:text-[#14B8A6] transition-colors">Neural Evaluation Report</h4>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                       Origin: {item.doctor_name || "Automated Registry System"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-right mr-6">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 opacity-60">Precision</div>
                    <div className="text-2xl font-black text-[#1A1A1A] tracking-tighter">{(item.confidence * 100).toFixed(0)}<span className="text-[14px] text-slate-300 ml-0.5">%</span></div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleView(item._id)}
                      className="w-12 h-12 bg-white border border-slate-100 text-[#1A1A1A] rounded-2xl flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                      title="View PDF"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDownload(item._id)}
                      className="w-12 h-12 bg-[#1A1A1A] text-white rounded-2xl flex items-center justify-center hover:bg-[#14B8A6] transition-all shadow-xl hover:-translate-y-1"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-center gap-6 mt-10">
            {!showAllRecords && history.length > 3 && (
              <button 
                onClick={() => setShowAllRecords(true)}
                className="btn-outline-premium group px-12 py-4 text-[10px] flex items-center gap-3"
              >
                Expand Medical Archives <ChevronDown size={18} className="text-slate-300 group-hover:text-[#14B8A6] transition-colors" />
              </button>
            )}
            {showAllRecords && history.length > 3 && (
              <button 
                onClick={() => setShowAllRecords(false)}
                className="btn-outline-premium group px-12 py-4 text-[10px] flex items-center gap-3"
              >
                Compress Timeline <ChevronUp size={18} className="text-slate-300 group-hover:text-[#14B8A6] transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryPage;
