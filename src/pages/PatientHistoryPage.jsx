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
  Plus
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
      <div className="pt-28 flex justify-center items-center h-screen bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 border-2 border-[#111111]/10 border-t-[#111111] rounded-full animate-spin"></div>
          <p className="text-[#6B7280] font-bold tracking-widest uppercase text-[9px]">Retrieving Medical History...</p>
        </div>
      </div>
    );
  }

  const visibleHistory = showAllRecords ? history : history.slice(0, 3);

  return (
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1200px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Top Action Bar - Compact */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/doctor/search')} 
          className="flex items-center gap-2 text-[#111111] font-bold text-[9px] uppercase tracking-widest hover:translate-x-[-2px] transition-all bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]"
        >
          <ChevronLeft size={14} /> Registry
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
          className="bg-[#111111] text-white px-5 py-2.5 rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={14} /> New Analysis
        </button>
      </div>

      {/* Row 1: Profile Card & Longitudinal Analysis Beside Each Other - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        {/* Profile Identity Card - Compact */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-[#E5E7EB] shadow-sm relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9FAFB] rounded-bl-[4rem] -z-0 opacity-50"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-xl flex items-center justify-center shadow-lg">
                <User size={20} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-[#6B7280] border border-[#E5E7EB] px-2.5 py-1 rounded-full uppercase tracking-widest mb-1.5">
                  {patientData?.type || 'Record'}
                </span>
                <span className="text-[8px] font-bold text-[#111111] uppercase tracking-widest opacity-20">ID: {patientId.slice(-6)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#111111] tracking-tight mb-1">{patientName}</h1>
              <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px]">{patientData?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="bg-[#F9FAFB] p-3 rounded-xl border border-[#F3F4F6]">
                <div className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Age</div>
                <div className="text-lg font-bold text-[#111111]">{patientData?.age || '??'} <span className="text-[9px] font-medium opacity-30 uppercase ml-1">Yrs</span></div>
              </div>
              <div className="bg-[#F9FAFB] p-3 rounded-xl border border-[#F3F4F6]">
                <div className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Gender</div>
                <div className="text-lg font-bold text-[#111111]">{(patientData?.gender || 'U').charAt(0).toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Longitudinal Trend Chart - Compact */}
        <div className="bg-[#111111] p-6 rounded-[1.5rem] text-white shadow-xl relative overflow-hidden h-full">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp size={12} className="text-orange-400" /> Stability Index
              </h3>
              <div className="px-2 py-0.5 rounded-full border border-white/10 text-[7px] font-bold text-white/40 uppercase tracking-widest">v4.2</div>
            </div>
            
            <div className="flex justify-between items-end h-24 gap-2 mb-6 relative px-2">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 w-full"></div>
              
              {history.length > 0 ? (
                [...history].reverse().slice(-5).map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((item.confidence * 100), 10)}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 relative ${item.prediction === 'Normal' ? 'bg-white/20 group-hover:bg-white' : 'bg-red-500/40 group-hover:bg-red-500'}`}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-1.5 py-0.5 rounded shadow-lg">
                        {(item.confidence * 100).toFixed(0)}%
                      </div>
                    </motion.div>
                    <div className="text-[7px] font-bold opacity-30 uppercase tracking-tighter text-center">
                      {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] text-white/20 font-bold uppercase tracking-widest italic">
                  No Data
                </div>
              )}
            </div>
            <div className="mt-auto flex items-center justify-between text-[8px] font-bold text-white/30 uppercase tracking-widest pt-4 border-t border-white/5">
              <span>Telemetry Map</span>
              <span className="text-white/60">{history.length} EVALS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Diagnostic Records Spanning Full Width - Compact Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h2 className="text-[9px] font-bold text-[#111111] uppercase tracking-[0.2em] flex items-center gap-2">
            <Clipboard size={12} /> Clinical Timeline
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {visibleHistory.map((item, i) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#111111] transition-all group flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.prediction === 'Normal' ? 'bg-[#F3F4F6] text-[#111111]' : 'bg-red-50 text-red-500'} group-hover:bg-[#111111] group-hover:text-white transition-all`}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[7px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${item.prediction === 'Normal' ? 'border-[#E5E7EB] text-[#111111]' : 'border-red-100 text-red-500 bg-red-50'}`}>
                        {item.prediction}
                      </span>
                      <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} /> {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#111111] mb-0.5">Evaluation Report</h4>
                    <div className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest">
                      {item.doctor_name || "Automated System"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right mr-4">
                    <div className="text-[7px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Confidence</div>
                    <div className="text-lg font-black text-[#111111]">{(item.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(item._id)}
                      className="w-9 h-9 bg-white border border-[#E5E7EB] text-[#111111] rounded-lg flex items-center justify-center hover:bg-[#111111] hover:text-white transition-all shadow-sm"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => handleDownload(item._id)}
                      className="w-9 h-9 bg-[#111111] text-white rounded-lg flex items-center justify-center hover:bg-black transition-all shadow-sm"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-6">
            {!showAllRecords && history.length > 3 && (
              <button 
                onClick={() => setShowAllRecords(true)}
                className="w-auto px-10 py-3 bg-white border border-[#E5E7EB] text-[#111111] rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:border-[#111111] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Expand Medical Archives <ChevronDown size={14} />
              </button>
            )}
            {showAllRecords && history.length > 3 && (
              <button 
                onClick={() => setShowAllRecords(false)}
                className="w-auto px-10 py-3 bg-white border border-[#E5E7EB] text-[#111111] rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:border-[#111111] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Compress Timeline <ChevronUp size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryPage;
