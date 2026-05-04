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
  UserPlus
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

  // Handle pre-filled data from existing patient profile
  React.useEffect(() => {
    if (location.state?.prefill) {
      console.log('Prefilling data:', location.state.prefill);
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
    
    // If we have a registered patient ID, send it so the prediction is linked to their account
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
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download report.');
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
        <StepIndicator active={step >= 1} icon={<UserPlus size={18} />} label="Patient Info" />
        <StepIndicator active={step >= 2} icon={<Upload size={18} />} label="ECG Upload" />
        <StepIndicator active={step >= 3} icon={<CheckCircle size={18} />} label="Analysis" />
      </div>

      <div className="glass-card p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-healthcare-dark">Step 1: Patient Information</h2>
                <p className="text-slate-500">Provide details for the patient being analyzed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Patient Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="input-field" 
                    placeholder="Jane Doe"
                    value={patientInfo.name}
                    onChange={handleInfoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                  <input 
                    type="number" 
                    name="age"
                    className="input-field" 
                    placeholder="45"
                    value={patientInfo.age}
                    onChange={handleInfoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                  <select 
                    name="gender"
                    className="input-field"
                    value={patientInfo.gender}
                    onChange={handleInfoChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Medical Notes (Optional)</label>
                  <textarea 
                    name="history"
                    rows="3"
                    className="input-field"
                    placeholder="Any relevant history or current symptoms..."
                    value={patientInfo.history}
                    onChange={handleInfoChange}
                  ></textarea>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!patientInfo.name || !patientInfo.age}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                Proceed to Upload <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-healthcare-dark">Step 2: ECG Image Upload</h2>
                  <p className="text-slate-500 text-sm">Analyzing ECG for {patientInfo.name}</p>
                </div>
              </div>

              {!file ? (
                <label className="relative block border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-healthcare-blue hover:bg-healthcare-blue/5 transition-all cursor-pointer group">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <div className="w-16 h-16 bg-healthcare-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-healthcare-blue group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-lg font-bold">Select ECG Image</h3>
                </label>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-slate-200">
                  <img src={preview} alt="ECG" className="w-full h-64 object-contain bg-slate-50" />
                  <button onClick={() => setFile(null)} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-red-500">
                    <AlertCircle size={20} />
                  </button>
                </div>
              )}

              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              <button 
                onClick={handleUpload}
                disabled={!file || loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Run AI Analysis'}
              </button>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
              <p className="text-slate-500 mb-8">Classification for {patientInfo.name}</p>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-5">
                <div className="flex justify-around">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Result</div>
                    <div className="text-2xl font-bold text-healthcare-blue">{result.prediction}</div>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Confidence</div>
                    <div className="text-2xl font-bold text-healthcare-dark">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>

                {result.breakdown && result.breakdown.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
                      <Activity size={14} /> Beat Type Distribution
                    </div>
                    <div className="space-y-2.5">
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
                            <div className="w-24 text-xs font-semibold text-slate-600 truncate flex-shrink-0">{item.label}</div>
                            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
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

                      const isHigh = totalRisk > 15;
                      
                      return (
                        <div className={`mt-6 p-4 rounded-xl border ${isHigh ? 'bg-red-50 border-red-100 text-red-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                          <div className="flex items-center gap-2 font-bold mb-1 text-sm">
                            <AlertCircle size={16} className={isHigh ? 'text-red-600' : 'text-orange-600'} />
                            {isHigh ? 'High (Abnormal) Risk' : 'Moderate Risk Level'}
                          </div>
                          <p className="text-[11px] leading-relaxed opacity-90">
                            {isHigh 
                              ? `Total abnormal frequency is ${totalRisk.toFixed(1)}%. This requires clinical follow-up.` 
                              : `Total abnormal frequency is ${totalRisk.toFixed(1)}%. May require checkup to ensure heart structure is okay.`
                            }
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => navigate('/doctor')} className="btn-secondary flex-1">Back to Dashboard</button>
                <button onClick={() => handleDownload(result.id)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FileText size={20} /> Download Report
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StepIndicator = ({ active, icon, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${active ? 'bg-healthcare-blue text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
      {icon}
    </div>
    <span className={`text-xs font-bold ${active ? 'text-healthcare-blue' : 'text-slate-400'}`}>{label}</span>
  </div>
);

export default DoctorAnalysisPage;
