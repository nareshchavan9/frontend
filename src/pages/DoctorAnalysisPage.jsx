import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Activity,
  UserPlus,
  Shield,
  Clipboard,
  ChevronLeft,
  TrendingUp,
  History,
  Download,
  Eye,
  ChevronRight,
  Share2,
  Printer,
  X,
  Plus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const DoctorAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    id: '', 
    name: '',
    age: '',
    gender: 'male',
    history: ''
  });

  const [showImageModal, setShowImageModal] = useState(false);

  React.useEffect(() => {
    if (location.state?.prefill) {
      const { id, name, age, gender } = location.state.prefill;
      setPatientInfo(prev => ({
        ...prev,
        id: id || prev.id,
        name: name || prev.name,
        age: age || prev.age,
        gender: gender || prev.gender
      }));
    }
  }, [location.state]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleInfoChange = (e) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_name', patientInfo.name);
    formData.append('patient_age', patientInfo.age);
    formData.append('patient_gender', patientInfo.gender);
    
    if (patientInfo.id) {
      formData.append('patient_id', patientInfo.id);
    }

    try {
      const response = await api.post('/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze telemetry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${predictionId}.pdf`);
      link.click();
      link.remove();
    } catch (err) { console.error(err); }
  };

  const handleViewReport = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to view report', err);
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Unified Action Header */}
      <div className="flex items-center justify-between mb-12 gap-8">
        <div className="w-1/4">
          <button 
            onClick={() => navigate('/doctor')} 
            className="btn-outline-premium group px-5 py-2.5 flex items-center gap-2"
          >
            <ChevronLeft size={16} className="text-slate-400 group-hover:text-[#14B8A6] transition-colors" /> <span className="text-[10px]">Dashboard</span>
          </button>
        </div>

        <div className="flex-1 max-w-lg relative flex items-center justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 -z-0"></div>
          <div className="flex items-center justify-between w-full relative z-10 px-4">
            <StepNode active={step >= 1} icon={<UserPlus size={16} />} label="PROFILE" />
            <StepNode active={step >= 2} icon={<Activity size={16} />} label="TELEMETRY" />
            <StepNode active={step >= 3} icon={<TrendingUp size={16} />} label="DIAGNOSTIC" />
          </div>
        </div>

        <div className="w-1/4 flex flex-col items-end">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Diagnostic Mode</div>
          <div className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-[0.2em] flex items-center gap-2">
            <Shield size={12} className="text-[#14B8A6]" /> Pipeline v4.2
          </div>
        </div>
      </div>

      <div className={`mx-auto transition-all duration-500 ${step === 3 ? 'max-w-6xl' : 'max-w-4xl'}`}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="premium-card bg-white p-6 md:p-8 border-slate-50"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-1">Patient Identification</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Registry Entry Protocol</p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!patientInfo.name || !patientInfo.age}
                  className="btn-premium-teal group px-8 py-3.5 text-[10px] flex items-center gap-3 disabled:opacity-20"
                >
                  Proceed <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-8 items-end">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3 ml-1">Legal Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="input-premium w-full text-[13px]" 
                    placeholder="Full Clinical Name"
                    value={patientInfo.name}
                    onChange={handleInfoChange}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3 ml-1">Age</label>
                  <input 
                    type="number" 
                    name="age"
                    className="input-premium w-full text-[13px]" 
                    placeholder="YY"
                    value={patientInfo.age}
                    onChange={handleInfoChange}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3 ml-1">Gender</label>
                  <select 
                    name="gender"
                    className="input-premium w-full appearance-none pr-10 uppercase tracking-widest text-[11px]"
                    value={patientInfo.gender}
                    onChange={handleInfoChange}
                  >
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                    <option value="other">OTHER</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="premium-card bg-white p-6 md:p-8 border-slate-50"
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <button onClick={() => setStep(1)} className="w-11 h-11 bg-slate-50 rounded-xl hover:bg-[#14B8A6] hover:text-white transition-all flex items-center justify-center text-[#1A1A1A]">
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-1">Signal Acquisition</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">ECG Telemetry Intake</p>
                  </div>
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="btn-premium-teal group px-8 py-3.5 text-[10px] flex items-center gap-3 disabled:opacity-20"
                >
                  {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Analyzing...</> : <><Plus size={18} /> Execute Analysis</>}
                </button>
              </div>

              <div className="grid grid-cols-5 gap-12 items-center">
                <div className="col-span-2">
                  {!file ? (
                    <label className="block border-2 border-dashed border-teal-50 rounded-[2rem] p-12 text-center hover:border-[#14B8A6] hover:bg-teal-50/10 transition-all cursor-pointer group">
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      <div className="w-16 h-16 bg-teal-50 text-[#14B8A6] flex items-center justify-center mx-auto mb-6 rounded-2xl group-hover:scale-110 transition-all shadow-sm">
                        <Upload size={28} />
                      </div>
                      <h3 className="text-base font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">Import ECG</h3>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest opacity-60">High-Res Signal Required</p>
                    </label>
                  ) : (
                    <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl group bg-slate-50">
                      <img src={preview} alt="ECG" className="w-full h-48 object-contain" />
                      <button onClick={() => setFile(null)} className="absolute top-4 right-4 w-10 h-10 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-xl flex items-center justify-center">
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-span-3">
                  <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-40 -z-0"></div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#14B8A6] border border-slate-100 shadow-sm">
                        <Activity size={24} />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">Neural Readiness</h4>
                        <p className="text-[#14B8A6] text-[9px] font-bold uppercase tracking-widest">Protocol 4.2 Optimized</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium relative z-10">System calibrated for high-density ECG signal processing. Ensure clinical tracing is well-lit and covers full diagnostic window for 98.5% precision mapping.</p>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-10 p-5 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest"
                >
                  <AlertCircle size={20} /> {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card bg-white p-6 md:p-8 border-slate-50 shadow-3xl overflow-hidden"
            >
              {/* Utility Bar */}
              <div className="flex items-center justify-between mb-10">
                <button 
                  onClick={() => setStep(2)} 
                  className="w-12 h-12 bg-slate-50 border border-slate-100 text-[#1A1A1A] rounded-2xl hover:bg-[#14B8A6] hover:text-white hover:border-[#14B8A6] transition-all flex items-center justify-center shadow-sm"
                  title="Backward"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleViewReport(result.id)}
                    className="btn-outline-premium group px-6 py-3 flex items-center gap-3"
                  >
                    <Eye size={18} className="text-slate-400 group-hover:text-[#14B8A6] transition-colors" /> <span className="text-[10px] font-bold uppercase tracking-widest">Clinical Review</span>
                  </button>
                  <button 
                    onClick={() => handleDownload(result.id)}
                    className="btn-premium-teal px-8 py-3.5 text-[10px] flex items-center gap-3 shadow-xl"
                  >
                    <Download size={18} /> Export Data
                  </button>
                </div>
              </div>

              {/* Central Diagnostic Content */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12 pb-12 border-b border-slate-50 px-4">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-teal-50 text-[#14B8A6] flex items-center justify-center rounded-[1.5rem] shadow-inner">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-1">Diagnostics Finalized</h2>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em]">Patient: {patientInfo.name}</p>
                  </div>
                </div>

                <div className="flex gap-20">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em] mb-3">Classification</div>
                    <div className={`text-5xl font-black tracking-tighter ${result.prediction === 'Normal' ? 'text-[#1A1A1A]' : 'text-red-500'}`}>{result.prediction}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em] mb-3">Accuracy</div>
                    <div className="text-5xl font-black text-[#1A1A1A] tracking-tighter">{(result.confidence * 100).toFixed(0)}<span className="text-2xl font-bold text-[#14B8A6]">%</span></div>
                  </div>
                </div>
              </div>

              {/* Probability Breakdown */}
              <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100">
                <div className="text-[11px] text-[#1A1A1A] uppercase font-bold tracking-[0.4em] mb-10 flex items-center gap-4">
                  <Activity size={16} className="text-[#14B8A6]" /> Neural Probability Distribution Index
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest">{item.label}</div>
                        <div className="text-[11px] font-black text-[#14B8A6] tabular-nums">{item.percentage.toFixed(0)}%</div>
                      </div>
                      <div className="flex-1 bg-white border border-slate-50 rounded-full h-2 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.percentage, 100)}%` }}
                          transition={{ duration: 1.2, delay: idx * 0.1, ease: "circOut" }}
                          className={`h-full rounded-full ${item.label.toLowerCase().includes('normal') ? 'bg-[#14B8A6]' : 'bg-red-400'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StepNode = ({ active, icon, label }) => (
  <div className="flex flex-col items-center gap-3 relative z-10">
    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 shadow-sm border ${active ? 'bg-[#1A1A1A] text-white border-transparent shadow-xl' : 'bg-white border-slate-100 text-slate-300'}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${active ? 'text-[#1A1A1A]' : 'text-slate-300'}`}>{label}</span>
  </div>
);

export default DoctorAnalysisPage;
