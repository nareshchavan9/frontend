import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, CheckCircle, AlertCircle, Loader2, Eye, Download, Activity, Zap, ShieldCheck, ArrowRight, Clipboard, ChevronRight, Plus, ChevronLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const currentStep = result ? 3 : (loading ? 2 : 1);

  const getHeaderContent = () => {
    switch (currentStep) {
      case 2:
        return {
          title: "Neural Synthesis",
          desc: "Processing signals and executing multi-class classification protocols."
        };
      case 3:
        return {
          title: "Diagnostics Finalized",
          desc: "Review your neural classification reports and export medical data."
        };
      case 1:
      default:
        return {
          title: "Initialize Analysis",
          desc: "Upload clinical ECG traces for instantaneous AI-powered assessment."
        };
    }
  };

  const headerContent = getHeaderContent();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload a valid ECG image file.');
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

    try {
      const response = await api.post('/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis engine failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${predictionId}.pdf`);
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

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Unified Action Header with Progress Steps */}
      <div className="flex items-center justify-between mb-12 gap-8">
        <div className="w-1/4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-outline-premium group px-5 py-2.5 flex items-center gap-2"
          >
            <ChevronLeft size={16} className="text-slate-400 group-hover:text-[#14B8A6] transition-colors" /> <span className="text-[10px]">Dashboard</span>
          </button>
        </div>

        <div className="flex-1 max-w-lg relative flex items-center justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 -z-0"></div>
          <div className="flex items-center justify-between w-full relative z-10 px-4">
            <StepNode active={currentStep >= 1} icon={<Upload size={16} />} label="TELEMETRY" />
            <StepNode active={currentStep >= 2} icon={<Activity size={16} />} label="ANALYSIS" />
            <StepNode active={currentStep >= 3} icon={<TrendingUp size={16} />} label="DIAGNOSTIC" />
          </div>
        </div>

        <div className="w-1/4 flex flex-col items-end">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Telemetry Mode</div>
          <div className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#14B8A6]" /> Secured Sync
          </div>
        </div>
      </div>

      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center mb-12 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-2"
        >
          <span className="w-8 h-[1px] bg-teal-100"></span>
          Neural Classification Engine
          <span className="w-8 h-[1px] bg-teal-100"></span>
        </motion.div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">{headerContent.title}</h1>
        <p className="text-slate-500 text-sm font-medium max-w-lg">{headerContent.desc}</p>
        
        {result && (
          <button onClick={reset} className="mt-4 btn-outline-premium group px-6 py-2.5 text-[10px] flex items-center gap-2">
            <Plus size={14} className="text-[#14B8A6]" /> New Investigation
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {!result ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card bg-white p-6 md:p-10 border-teal-50/50"
          >
            {!file ? (
              <label className="relative block border-2 border-dashed border-teal-100 rounded-[2.5rem] p-16 text-center hover:border-[#14B8A6] hover:bg-teal-50/10 transition-all cursor-pointer group">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 bg-teal-50 text-[#14B8A6] flex items-center justify-center mx-auto mb-8 rounded-2xl group-hover:scale-110 transition-all shadow-sm">
                  <Upload size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#1A1A1A] tracking-tight">Drop clinical image here</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Supported: JPEG, PNG, DICOM exports</p>
              </label>
            ) : (
              <div className="space-y-8">
                <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl group bg-slate-50 aspect-[16/9]">
                  <img src={preview} alt="ECG Trace" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={reset}
                      className="px-8 py-3 bg-white text-red-500 rounded-xl shadow-2xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <X size={16} /> Discard Image
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50/50 border border-slate-100 gap-6 rounded-2xl">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-white border border-slate-100 text-[#14B8A6] rounded-xl shadow-sm">
                      <FileImage size={24} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest truncate max-w-[200px]">{file.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="btn-premium-teal !py-4 !px-10 text-[11px] uppercase tracking-[0.3em] shadow-xl w-full sm:w-auto"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                    ) : (
                      <>Sync with Neural Engine <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card bg-white border-teal-50/50 shadow-3xl overflow-hidden"
          >
            {/* Report Header */}
            <div className="bg-slate-50/50 p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <div className="flex items-center gap-2 text-[#14B8A6] font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                  <ShieldCheck size={16} /> Neural Classification Report
                </div>
                <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Diagnostic Summary</h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Telemetry ID</div>
                <div className="text-[11px] font-bold text-[#1A1A1A] font-mono bg-white px-3 py-1 rounded-lg border border-slate-100">{result.id.slice(-12).toUpperCase()}</div>
              </div>
            </div>

            <div className="p-10 space-y-12">
              {/* Main Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50/30 rounded-3xl border border-slate-100 group hover:border-[#14B8A6] transition-all">
                  <div className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-3">Primary Classification</div>
                  <div className={`text-4xl font-bold tracking-tight ${result.prediction === 'Normal' ? 'text-[#1A1A1A]' : 'text-red-500'}`}>
                    {result.prediction}
                  </div>
                </div>
                <div className="p-8 bg-slate-50/30 rounded-3xl border border-slate-100 group hover:border-sky-400 transition-all">
                  <div className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-3">Confidence Index</div>
                  <div className="text-4xl font-bold text-[#1A1A1A] tracking-tight">
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Informatics Table */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <h3 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em]">Probability Distribution</h3>
                </div>
                
                <div className="grid gap-6">
                  {result.breakdown && result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-8">
                      <div className="w-28 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest truncate">
                        {item.label}
                      </div>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={`h-full ${(item.label.toLowerCase().includes('normal') && !item.label.toLowerCase().includes('abnormal')) ? 'bg-[#14B8A6]' : 'bg-red-400'}`}
                        />
                      </div>
                      <div className="w-14 text-right text-[11px] font-bold text-[#1A1A1A] tabular-nums">
                        {(item.percentage).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Actions */}
              <div className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => handleView(result.id)}
                  className="flex-1 btn-premium-teal !py-4 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] shadow-xl"
                >
                  <Eye size={18} /> Review PDF Report
                </button>
                <button 
                  onClick={() => handleDownload(result.id)}
                  className="flex-1 btn-outline-premium !py-4 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em]"
                >
                  <Download size={18} /> Export Data
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Requirements Section */}
        <div className="premium-card p-8 bg-white border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div>
              <h3 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em] mb-2">Protocol Requirements</h3>
              <p className="text-xs text-slate-500 font-medium">Optimal neural accuracy criteria.</p>
            </div>
            <div className="flex flex-wrap gap-10">
              <RequirementItem label="Clinical Trace" />
              <RequirementItem label="Low Latency" />
              <RequirementItem label="High Contrast" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequirementItem = ({ label }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 bg-teal-50 text-[#14B8A6] rounded-full flex items-center justify-center shadow-sm">
      <CheckCircle size={14} />
    </div>
    <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">{label}</span>
  </div>
);

const StepNode = ({ active, icon, label }) => (
  <div className="flex flex-col items-center gap-3 relative z-10">
    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 shadow-sm border ${active ? 'bg-[#1A1A1A] text-white border-transparent shadow-xl' : 'bg-white border-slate-100 text-slate-300'}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${active ? 'text-[#1A1A1A]' : 'text-slate-300'}`}>{label}</span>
  </div>
);

export default UploadPage;
