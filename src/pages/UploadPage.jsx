import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, CheckCircle, AlertCircle, Loader2, Eye, Download, Activity } from 'lucide-react';
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

    try {
      const response = await api.post('/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.');
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
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download report. Please try again.');
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
      alert('Failed to view report. Please try again.');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-healthcare-dark">New ECG Analysis</h1>
        <p className="text-slate-500 mt-2">Upload your heart rate image for AI classification</p>
      </div>

      <div className="glass-card p-8">
        {!result ? (
          <div className="space-y-8">
            {/* Upload Area */}
            {!file ? (
              <label className="relative block border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-healthcare-blue hover:bg-healthcare-blue/5 transition-all cursor-pointer group">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="w-20 h-20 bg-healthcare-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-healthcare-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Click to upload or drag & drop</h3>
                <p className="text-slate-400">PNG, JPG or JPEG (Max. 5MB)</p>
              </label>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
                <img src={preview} alt="Preview" className="w-full h-80 object-contain bg-slate-50" />
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-100 flex items-center gap-3">
                  <FileImage className="w-5 h-5 text-healthcare-blue" />
                  <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button 
                onClick={handleUpload}
                disabled={!file || loading}
                className="btn-primary px-10 py-4 text-lg flex items-center justify-center gap-2 min-w-[220px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  'Run AI Analysis'
                )}
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-healthcare-dark mb-2">Analysis Complete</h2>
            <p className="text-slate-500 mb-8">We've identified your arrhythmia type based on the ECG image.</p>
            
            <div className="bg-slate-50 rounded-3xl p-8 mb-8 text-left space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Classification</div>
                  <div className="text-3xl font-bold text-healthcare-blue">{result.prediction}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Confidence Score</div>
                  <div className="text-3xl font-bold text-healthcare-dark">{(result.confidence * 100).toFixed(2)}%</div>
                </div>
              </div>

              {result.breakdown && result.breakdown.length > 0 && (
                <div>
                  <div className="text-sm text-slate-400 font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Beat Type Distribution
                  </div>
                  <div className="space-y-3">
                    {result.breakdown.map((item, idx) => {
                      const isNormal = item.label.toLowerCase().includes('normal');
                      
                      // Color mapping: Green for normal, various shades of red/orange/purple for risk
                      const barColor = isNormal ? 'bg-green-500' : 
                                      (idx === 0 ? 'bg-red-600' : 
                                      (idx === 1 ? 'bg-orange-500' : 
                                      (idx === 2 ? 'bg-red-400' : 'bg-slate-400')));
                      
                      const textColor = isNormal ? 'text-green-600' : 
                                       (idx === 0 ? 'text-red-600' : 
                                       (idx === 1 ? 'text-orange-600' : 
                                       (idx === 2 ? 'text-red-500' : 'text-slate-500')));

                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-28 text-xs font-semibold text-slate-600 truncate flex-shrink-0">{item.label}</div>
                          <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                          </div>
                          <div className={`text-xs font-bold w-12 text-right ${textColor}`}>
                            {item.percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Clinical Guidance Section */}
                  {(() => {
                    const totalRisk = result.breakdown
                      .filter(item => !item.label.toLowerCase().includes('normal'))
                      .reduce((sum, item) => sum + item.percentage, 0);
                    
                    if (totalRisk < 5) return null;

                    const isHigh = totalRisk > 15; // Threshold for high as per user's "19% included" hint
                    const isModerate = totalRisk >= 5 && totalRisk <= 15;

                    return (
                      <div className={`mt-8 p-5 rounded-2xl border ${isHigh ? 'bg-red-50 border-red-100 text-red-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                        <div className="flex items-center gap-2 font-bold mb-2">
                          <AlertCircle size={20} className={isHigh ? 'text-red-600' : 'text-orange-600'} />
                          {isHigh ? 'High (Abnormal) Risk' : 'Moderate Risk Level'}
                        </div>
                        <p className="text-sm leading-relaxed opacity-90">
                          {isHigh 
                            ? `Your total abnormal beat frequency is ${totalRisk.toFixed(1)}%. This level usually requires medical follow-up and clinical correlation.` 
                            : `Your total abnormal beat frequency is ${totalRisk.toFixed(1)}%. May require an initial checkup to ensure heart structure is okay.`
                          }
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-secondary px-8 flex-1 sm:flex-none"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => handleView(result.id)}
                className="btn-primary px-6 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Eye className="w-5 h-5" /> View Report
              </button>
              <button 
                onClick={() => handleDownload(result.id)}
                className="btn-primary px-6 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
            <button 
              onClick={reset}
              className="mt-6 text-sm text-slate-400 hover:text-healthcare-blue transition-colors underline"
            >
              Run another analysis
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
