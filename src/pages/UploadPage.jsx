import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, CheckCircle, AlertCircle, Loader2, Eye, Download, Activity, Zap, ShieldCheck, ArrowRight, Clipboard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

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
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Editorial Header - Centered */}
      <div className="flex flex-col items-center text-center mb-16 gap-4">
        <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-2">
          <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
          Neural Classification Engine
          <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight mb-2">New Analysis</h1>
        <p className="text-[#6B7280] text-base font-medium max-w-lg">Upload ECG traces for instantaneous AI-powered assessment.</p>
        
        {result && (
          <button onClick={reset} className="mt-4 btn-outline-dark flex items-center gap-2 text-xs">
            <Activity size={14} /> New Investigation
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {!result ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 border border-[#E5E7EB] rounded-[2rem] shadow-xl"
          >
            {!file ? (
              <label className="relative block border-2 border-dashed border-[#E5E7EB] rounded-[1.5rem] p-12 text-center hover:border-[#111111] hover:bg-[#F9FAFB] transition-all cursor-pointer group">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 bg-[#F3F4F6] text-[#111111] flex items-center justify-center mx-auto mb-6 rounded-2xl group-hover:bg-[#111111] group-hover:text-white transition-all">
                  <Upload size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#111111]">Drop clinical image here</h3>
                <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">JPEG, PNG or DICOM exports</p>
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-[1.5rem] overflow-hidden border border-[#E5E7EB] shadow-lg group bg-[#F9FAFB]">
                  <img src={preview} alt="ECG Trace" className="w-full h-[300px] object-contain" />
                  <div className="absolute inset-0 bg-[#111111]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={reset}
                      className="px-6 py-3 bg-white text-red-500 rounded-xl shadow-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <X size={14} /> Remove Image
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#F9FAFB] border border-[#E5E7EB] gap-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-[#E5E7EB] text-[#111111] rounded-xl">
                      <FileImage size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-[#111111] uppercase tracking-widest truncate max-w-[200px]">{file.name}</div>
                      <div className="text-[9px] text-[#6B7280] font-bold uppercase tracking-widest mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="btn-primary-dark !py-4 !px-8 text-xs flex items-center justify-center gap-3 w-full sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Initialize AI Analysis <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E5E7EB] rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Report Header */}
            <div className="bg-[#F9FAFB] p-8 border-b border-[#E5E7EB] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#E8A26A] font-bold text-[9px] uppercase tracking-widest mb-3">
                  <ShieldCheck size={14} /> Official Analysis Report
                </div>
                <h2 className="text-2xl font-bold text-[#111111] tracking-tight">Diagnostic Summary</h2>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Report ID</div>
                <div className="text-[10px] font-bold text-[#111111] font-mono">{result.id.slice(-12).toUpperCase()}</div>
              </div>
            </div>

            <div className="p-8 space-y-10">
              {/* Main Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                  <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Neural Classification</div>
                  <div className={`text-3xl font-bold tracking-tight ${result.prediction === 'Normal' ? 'text-[#111111]' : 'text-red-500'}`}>
                    {result.prediction}
                  </div>
                </div>
                <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                  <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Confidence Index</div>
                  <div className="text-3xl font-bold text-[#111111] tracking-tight">
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Informatics Table */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                  <h3 className="text-[9px] font-bold text-[#111111] uppercase tracking-widest">Informatics Distribution</h3>
                </div>
                
                <div className="grid gap-4">
                  {result.breakdown && result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                      <div className="w-24 text-[9px] font-bold text-[#111111] uppercase tracking-widest truncate">
                        {item.label}
                      </div>
                      <div className="flex-1 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={`h-full ${item.label.toLowerCase().includes('normal') ? 'bg-[#111111]' : 'bg-[#E8A26A]'}`}
                        />
                      </div>
                      <div className="w-12 text-right text-[9px] font-bold text-[#111111] tabular-nums">
                        {(item.percentage).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Actions */}
              <div className="pt-8 border-t border-[#F3F4F6] flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleView(result.id)}
                  className="flex-1 btn-primary-dark !py-4 flex items-center justify-center gap-3 text-xs"
                >
                  <Eye size={16} /> Clinical PDF Report
                </button>
                <button 
                  onClick={() => handleDownload(result.id)}
                  className="flex-1 btn-outline-dark !py-4 flex items-center justify-center gap-3 text-xs"
                >
                  <Download size={16} /> Download Data
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Requirements Section */}
        <div className="bg-white p-8 rounded-[1.5rem] border border-[#E5E7EB]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h3 className="text-[10px] font-bold text-[#111111] uppercase tracking-[0.2em] mb-1">Analysis Requirements</h3>
              <p className="text-[11px] text-[#6B7280] font-medium">Criteria for optimal neural classification accuracy.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <RequirementItem label="Clear Trace" />
              <RequirementItem label="Low Noise" />
              <RequirementItem label="High Contrast" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequirementItem = ({ label }) => (
  <div className="flex items-center gap-2.5">
    <CheckCircle size={14} className="text-[#111111]" />
    <span className="text-[9px] font-bold text-[#111111] uppercase tracking-widest">{label}</span>
  </div>
);

export default UploadPage;
