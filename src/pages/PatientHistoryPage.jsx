import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const PatientHistoryPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('Patient');
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 1. Fetch Patient Profile to get accurate demographics
        const patientsRes = await api.get('/reports/admin/patients');
        const profile = patientsRes.data.find(p => p._id === patientId);
        
        if (profile) {
          setPatientData(profile);
          setPatientName(profile.name);
        }

        // 2. Use the new Unified History Endpoint
        // This handles registered users (by ID) and clinical patients (by ID/Name)
        const response = await api.get(`/predict/history/unified/${patientId}`);
        
        if (response.data.length > 0) {
          setHistory(response.data);
          
          // If we didn't find a profile in registered users, try to construct from first history item
          if (!profile) {
            const first = response.data[0];
            const name = first.patient_name || first.notes?.match(/Patient:\s*([^|]+)/)?.[1]?.strip() || 'Patient';
            setPatientName(name);
            
            const ageMatch = first.notes?.match(/Age:\s*(\d+)/);
            const genderMatch = first.notes?.match(/Gender:\s*(\w+)/);
            setPatientData({
              name: name,
              age: ageMatch ? ageMatch[1] : "",
              gender: genderMatch ? genderMatch[1] : "male"
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
      const response = await api.get(`/reports/${predictionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${predictionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleView = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (err) {
      console.error('View failed', err);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/doctor')}
        className="flex items-center gap-2 text-slate-500 hover:text-healthcare-blue transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-healthcare-blue text-white rounded-2xl flex items-center justify-center shadow-lg">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark">{patientName}</h1>
            <p className="text-slate-500">Comprehensive timeline for patient records</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
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
            className="btn-primary flex items-center gap-2 shadow-lg shadow-healthcare-blue/20"
          >
            <Activity size={20} /> Perform New Analysis
          </button>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tests</div>
            <div className="text-2xl font-bold text-healthcare-blue">{history.length}</div>
          </div>
        </div>
      </div>

      {/* Clinical Progression Track */}
      {history.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-12 border border-blue-50 bg-gradient-to-r from-white to-blue-50/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-healthcare-dark uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-healthcare-blue" /> Diagnostic Progression Track
            </h3>
            <span className="text-xs font-bold text-slate-400">Last {Math.min(history.length, 5)} Test Trends</span>
          </div>
          
          <div className="flex items-center justify-between relative px-4">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
            
            {[...history].reverse().slice(-5).map((item, idx) => (
              <div key={item._id} className="flex flex-col items-center gap-3 relative">
                <div className={`w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all hover:scale-110 ${item.prediction.toLowerCase().includes('normal') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {item.prediction.toLowerCase().includes('normal') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className={`text-[10px] font-black uppercase ${item.prediction.toLowerCase().includes('normal') ? 'text-green-600' : 'text-red-600'}`}>{item.prediction}</div>
                </div>
                {idx === Math.min(history.length, 5) - 1 && (
                  <div className="absolute -top-6 bg-healthcare-blue text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter animate-bounce">Latest</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-healthcare-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Loading history...</p>
          </div>
        ) : history.length > 0 ? (
          history.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100 hover:border-healthcare-blue/30 transition-all"
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.prediction.toLowerCase().includes('normal') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <Activity size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.prediction.toLowerCase().includes('normal') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.prediction}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-healthcare-dark">
                    ECG Classification Result
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock size={14} /> Recorded at {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-xs font-bold text-healthcare-blue bg-blue-50 px-2 py-0.5 rounded-md">
                      {item.doctor_name || "Self-Tested"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-center mr-4 hidden lg:block">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Confidence</div>
                  <div className="text-xl font-bold text-healthcare-dark">{(item.confidence * 100).toFixed(1)}%</div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleView(item._id)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button 
                    onClick={() => handleDownload(item._id)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-card bg-slate-50/50 border-dashed border-2 border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Activity size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">No History Found</h3>
            <p className="text-slate-400 mt-2">This patient has no recorded ECG analyses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistoryPage;
