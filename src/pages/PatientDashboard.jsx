import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  History, 
  MessageSquare, 
  Activity, 
  TrendingUp, 
  Clock,
  ArrowRight,
  FileText,
  Lightbulb,
  X
} from 'lucide-react';
import api from '../services/api';
import AIAssistant from '../components/AIAssistant';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    lastResult: 'N/A',
    confidence: 0
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/predict/history');
        setRecentHistory(response.data);
        if (response.data.length > 0) {
          setStats({
            totalPredictions: response.data.length,
            lastResult: response.data[0].prediction,
            confidence: response.data[0].confidence
          });
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, []);

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
      alert('Failed to download report. Please try again.');
    }
  };

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-healthcare-dark">Hello, {user?.name}</h1>
          <p className="text-slate-500 mt-1">Here's your heart health overview</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <Upload className="w-5 h-5" /> New Detection
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Activity className="w-6 h-6" />}
          label="Total Tests"
          value={stats.totalPredictions}
          color="bg-blue-500"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />}
          label="Last Result"
          value={stats.lastResult}
          subValue={`${(stats.confidence * 100).toFixed(1)}% confidence`}
          color={stats.lastResult.toLowerCase().includes('abnormal') ? "bg-red-500" : (stats.lastResult.toLowerCase().includes('normal') ? "bg-green-500" : "bg-slate-400")}
        />
        <StatCard 
          icon={<Clock className="w-6 h-6" />}
          label="Status"
          value="Healthy"
          subValue="Keep it up!"
          color="bg-purple-500"
        />
        <button 
          onClick={() => setShowTips(true)}
          className="glass-card p-6 flex items-center gap-4 hover:shadow-lg transition-all text-left group border border-transparent hover:border-healthcare-blue/20"
        >
          <div className="p-4 rounded-2xl bg-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Daily Tips</div>
            <div className="text-xl font-bold text-healthcare-dark">Health Insights</div>
            <div className="text-xs text-healthcare-blue font-bold flex items-center gap-1 mt-0.5">
              View Now <ArrowRight size={12} />
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-6">
            <Link to="/history" className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-lg">
              <History className="w-6 h-6" /> View Prediction History
            </Link>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-healthcare-blue to-healthcare-teal p-6 rounded-3xl text-white shadow-xl">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </h3>
            <p className="text-blue-50/80 text-sm mb-6">
              Have questions about your heart health? Our AI assistant is here to help 24/7.
            </p>
            <Link to="/ai-assistant" className="w-full bg-white text-healthcare-blue py-3 rounded-xl font-bold text-center block hover:shadow-lg transition-all active:scale-95">
              Chat Now
            </Link>
          </div>
        </div>
      </div>

      {/* Health Tips Modal */}
      <AnimatePresence>
        {showTips && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTips(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full relative z-10 shadow-2xl border border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Heart Health Tips</h3>
                    <p className="text-slate-500 text-sm">Expert clinical advice</p>
                  </div>
                </div>
                <button onClick={() => setShowTips(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <TipCard icon={<Activity size={18} />} title="Monitor Activity" text="Walk at least 30 minutes daily to improve blood circulation." />
                <TipCard icon={<TrendingUp size={18} />} title="Nutrition First" text="Maintain a balanced diet rich in omega-3 and low in sodium." />
                <TipCard icon={<Clock size={18} />} title="Regular Checkups" text="Monitor your blood pressure and ECG at consistent intervals." />
              </div>

              <button 
                onClick={() => setShowTips(false)}
                className="btn-primary w-full py-4 shadow-lg shadow-healthcare-blue/20"
              >
                Got it, Thanks!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color }) => {
  const isResult = label === "Last Result";
  const displayValue = isResult && value !== 'N/A' 
    ? (value.toLowerCase().includes('abnormal') ? 'Abnormal' : (value.toLowerCase().includes('normal') ? 'Normal' : 'Abnormal')) 
    : value;

  return (
    <div className="glass-card p-6 flex items-center gap-4 group relative">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-500 font-medium">{label}</div>
        <div className="text-2xl font-bold text-healthcare-dark truncate" title={displayValue}>
          {displayValue}
        </div>
        {subValue && <div className="text-xs text-slate-400 mt-0.5 truncate">{subValue}</div>}
      </div>
      
      {isResult && value !== 'N/A' && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[70] shadow-2xl border border-white/10 scale-90 group-hover:scale-100 origin-bottom">
          <div className="font-bold text-healthcare-teal mb-1 flex items-center gap-1">
            <Activity size={12} /> Full Diagnosis
          </div>
          <div className="text-sm font-medium">{value}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
};

const TipCard = ({ icon, title, text }) => (
  <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-healthcare-blue shadow-sm flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="font-bold text-healthcare-dark text-sm">{title}</div>
      <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{text}</div>
    </div>
  </div>
);

export default PatientDashboard;
