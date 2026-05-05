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
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const DoctorAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    id: '', // Registered patient ID
    name: '',
    age: '',
    gender: 'male',
    history: ''
  });

  const [showImageModal, setShowImageModal] = useState(false);

  // Handle pre-filled data from existing patient profile
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
        setError('Please upload an image file.');
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
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.');
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
      alert('Failed to generate report preview.');
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Unified Action Header */}
      <div className="flex items-center justify-between mb-12 gap-8">
        <div className="w-1/4">
          <button 
            onClick={() => navigate('/doctor')} 
            className="flex items-center gap-3 text-[#111111] font-bold text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-all bg-white px-5 py-2.5 rounded-xl border border-[#E5E7EB]"
          >
            <ChevronLeft size={16} /> Dashboard
          </button>
        </div>

        <div className="flex-1 max-w-lg relative flex items-center justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#E5E7EB] -z-0"></div>
          <div className="flex items-center justify-between w-full relative z-10 px-4">
            <StepNode active={step >= 1} icon={<UserPlus size={16} />} label="PROFILE" />
            <StepNode active={step >= 2} icon={<Activity size={16} />} label="TELEMETRY" />
            <StepNode active={step >= 3} icon={<TrendingUp size={16} />} label="DIAGNOSTIC" />
          </div>
        </div>

        <div className="w-1/4 flex flex-col items-end">
          <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Diagnostic Mode</div>
          <div className="text-[10px] font-black text-[#111111] uppercase tracking-[0.2em] flex items-center gap-2">
            <Shield size={12} className="text-orange-500" /> Pipeline v4.2
          </div>
        </div>
      </div>

      <div className={`mx-auto transition-all duration-500 ${step === 3 ? 'max-w-6xl' : 'max-w-4xl'}`}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-8 px-12 rounded-[2rem] border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#111111] tracking-tight">Patient Identification</h2>
                  <p className="text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">Step 01 / Clinical Registry Entry</p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!patientInfo.name || !patientInfo.age}
                  className="bg-[#111111] text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 disabled:opacity-20"
                >
                  Proceed <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6 items-end">
                <div className="col-span-2">
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-1">Legal Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-5 outline-none text-[#111111] font-bold text-[13px] focus:border-[#111111] transition-all placeholder:opacity-30" 
                    placeholder="Full Clinical Name"
                    value={patientInfo.name}
                    onChange={handleInfoChange}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-1">Age</label>
                  <input 
                    type="number" 
                    name="age"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-5 outline-none text-[#111111] font-bold text-[13px] focus:border-[#111111] transition-all" 
                    placeholder="YY"
                    value={patientInfo.age}
                    onChange={handleInfoChange}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-1">Gender</label>
                  <select 
                    name="gender"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-5 outline-none text-[#111111] font-bold focus:border-[#111111] transition-all appearance-none uppercase tracking-widest text-[10px]"
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-8 px-12 rounded-[2rem] border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F9FAFB]">
                <div className="flex items-center gap-6">
                  <button onClick={() => setStep(1)} className="p-2.5 bg-[#F9FAFB] rounded-xl hover:bg-[#111111] hover:text-white transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-[#111111] tracking-tight">Signal Acquisition</h2>
                    <p className="text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">Step 02 / ECG Intake</p>
                  </div>
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="bg-[#111111] text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 disabled:opacity-20"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Execute Analysis'} <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-10 items-center">
                <div className="col-span-2">
                  {!file ? (
                    <label className="block border-2 border-dashed border-[#E5E7EB] rounded-[2rem] p-12 text-center hover:border-[#111111] hover:bg-[#F9FAFB] transition-all cursor-pointer group">
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      <div className="w-14 h-14 bg-[#F3F4F6] text-[#111111] flex items-center justify-center mx-auto mb-4 rounded-2xl group-hover:bg-[#111111] group-hover:text-white transition-all">
                        <Upload size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-1">Import ECG</h3>
                      <p className="text-[#6B7280] text-[8px] font-bold uppercase tracking-widest">Imaging: High-Res</p>
                    </label>
                  ) : (
                    <div className="relative rounded-[2rem] overflow-hidden border border-[#E5E7EB] shadow-sm">
                      <img src={preview} alt="ECG" className="w-full h-44 object-contain bg-[#F9FAFB]" />
                      <button onClick={() => setFile(null)} className="absolute top-4 right-4 p-2 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg shadow-md">
                        <AlertCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-span-3">
                  <div className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-[#F3F4F6]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 border border-[#E5E7EB]">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-[#111111] uppercase tracking-widest">Neural Readiness</h4>
                        <p className="text-[#6B7280] text-[8px] font-bold uppercase tracking-widest">Pipeline Version 4.2 Optimized</p>
                      </div>
                    </div>
                    <p className="text-[#6B7280] text-[10px] leading-relaxed">System is calibrated for high-density ECG signal processing. Please ensure the clinical tracing is well-lit and covers the full diagnostic window for 98.5% precision mapping.</p>
                  </div>
                </div>
              </div>

              {error && <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center mt-6">{error}</div>}
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 px-12 rounded-[2.5rem] border border-[#E5E7EB] shadow-sm relative"
            >
              {/* Utility Bar: Top Left & Right Buttons */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setStep(2)} 
                  className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] text-[#111111] rounded-xl hover:bg-[#111111] hover:text-white transition-all"
                  title="Backward"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleViewReport(result.id)}
                    className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] text-[#111111] rounded-xl hover:bg-[#111111] hover:text-white transition-all"
                    title="View Clinical Report"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleDownload(result.id)}
                    className="p-3 bg-[#111111] text-white rounded-xl hover:bg-black transition-all"
                    title="Download Report"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              {/* Central Diagnostic Content */}
              <div className="flex items-center justify-center gap-16 mb-10 pb-8 border-b border-[#F9FAFB]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-xl">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#111111] tracking-tight">Diagnostics Finalized</h2>
                    <p className="text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">Clinical Data: {patientInfo.name}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-16">
                  <div className="text-center">
                    <div className="text-[9px] text-[#6B7280] uppercase font-bold tracking-widest mb-1">Prediction</div>
                    <div className={`text-4xl font-black tracking-tighter ${result.prediction === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>{result.prediction}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-[#6B7280] uppercase font-bold tracking-widest mb-1">Confidence</div>
                    <div className="text-4xl font-black text-[#111111] tracking-tighter">{(result.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              {/* Wide Grid Breakdown */}
              <div className="bg-[#F9FAFB] rounded-[2rem] p-8 border border-[#F3F4F6]">
                <div className="text-[9px] text-[#6B7280] uppercase font-bold tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Activity size={14} /> Neural Probability Distribution Index
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-20 text-[8px] font-bold text-[#111111] uppercase tracking-tighter truncate">{item.label}</div>
                      <div className="flex-1 bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.percentage, 100)}%` }}
                          transition={{ duration: 1, delay: idx * 0.05 }}
                          className={`h-full rounded-full ${item.label.toLowerCase().includes('normal') ? 'bg-[#111111]' : 'bg-red-500 shadow-sm shadow-red-500/20'}`}
                        />
                      </div>
                      <div className="text-[10px] font-black w-10 text-right text-[#111111]">
                        {item.percentage.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image View Modal Overlay (Retained for future use if needed) */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#F3F4F6]">
                <div>
                  <h3 className="text-xl font-bold text-[#111111] tracking-tight">Original ECG Signal</h3>
                  <p className="text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">Source Image for Neural Analysis</p>
                </div>
                <button 
                  onClick={() => setShowImageModal(false)}
                  className="p-3 bg-[#F9FAFB] text-[#111111] rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex items-center justify-center bg-[#F9FAFB]">
                <img src={preview} alt="ECG Signal" className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-[#E5E7EB]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StepNode = ({ active, icon, label }) => (
  <div className="flex flex-col items-center gap-3 relative z-10">
    <div className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 ${active ? 'bg-[#111111] text-white shadow-xl' : 'bg-white border border-[#E5E7EB] text-[#D1D5DB]'}`}>
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-[#111111]' : 'text-[#9CA3AF]'}`}>{label}</span>
  </div>
);

export default DoctorAnalysisPage;
