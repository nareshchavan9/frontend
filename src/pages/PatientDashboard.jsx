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
  X,
  ShieldCheck,
  Heart,
  ChevronRight,
  Shield,
  Search
} from 'lucide-react';
import api from '../services/api';
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

  return (
    <div className="pt-32 pb-0 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-4">
            <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
            Clinical Wellness Portal
          </div>
          <h1 className="text-4xl font-bold text-[#111111] tracking-tight mb-2">Welcome, {user?.name.split(' ')[0]}</h1>
          <p className="text-[#6B7280] text-base font-medium">Your heart health summary and diagnostic history.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link to="/ai-assistant" className="bg-white border border-[#E5E7EB] text-[#111111] px-6 py-3 rounded-xl font-bold text-[13px] hover:border-[#111111] transition-all flex items-center gap-3 w-full md:w-auto justify-center shadow-sm">
            <MessageSquare size={16} /> AI Assistant
          </Link>
          <Link to="/upload" className="bg-[#111111] text-white px-6 py-3 rounded-xl font-bold text-[13px] hover:bg-black transition-all flex items-center gap-3 w-full md:w-auto justify-center">
            <Upload size={16} /> New Analysis
          </Link>
        </div>
      </div>

      {/* Grid Layout - Stats (Reduced Size to Medium) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <MetricCard 
          icon={<Activity />} 
          label="Cumulative Tests" 
          value={stats.totalPredictions} 
          trend="+2"
        />
        <MetricCard 
          icon={<TrendingUp />} 
          label="Latest Classification" 
          value={stats.lastResult.split('(')[0].trim()} 
          subValue={stats.lastResult !== 'N/A' ? `${(stats.confidence * 100).toFixed(0)}% accuracy` : 'No data'}
          isAlert={!stats.lastResult.toLowerCase().includes('normal') && stats.lastResult !== 'N/A'}
        />
        <MetricCard 
          icon={<ShieldCheck />} 
          label="Security Status" 
          value="Encrypted" 
          subValue="Verified"
        />
        
        {/* Insight Card */}
        <motion.button 
          whileHover={{ y: -3 }}
          onClick={() => setShowTips(true)}
          className="bg-white p-6 rounded-[1.5rem] border border-[#E5E7EB] hover:border-[#111111] transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#E8A26A]/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-10 h-10 bg-[#F3F4F6] text-[#E8A26A] flex items-center justify-center rounded-xl group-hover:bg-[#E8A26A] group-hover:text-white transition-all">
              <Lightbulb size={20} />
            </div>
            <span className="text-[8px] font-bold text-[#E8A26A] border border-[#E8A26A]/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Pro Tip</span>
          </div>
          <div className="mt-auto relative z-10">
            <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Wellness Intelligence</div>
            <div className="text-lg font-bold text-[#111111]">Daily Insights</div>
          </div>
        </motion.button>
      </div>

      <div className="mb-20">
        <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <ArrowRight size={12} className="text-[#111111]" /> Active Clinical Operations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CompactActionCard 
            to="/history"
            icon={<History />}
            title="Clinical Archives"
            description="Access previous analyses."
          />
          <CompactActionCard 
            to="/upload"
            icon={<Activity />}
            title="Rapid Diagnostic"
            description="New neural classification."
          />
        </div>
      </div>

      {/* Footer Section - System Compliance with White Background */}
      <div className="mt-20 -mx-6 lg:-mx-10 px-6 lg:px-10 py-12 bg-white border-t border-[#E5E7EB] mb-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-[#111111] w-4 h-4" />
                <h3 className="text-[10px] font-bold text-[#111111] uppercase tracking-[0.2em]">Clinical System Compliance</h3>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
                Your clinical data is protected by hospital-grade encryption and HIPAA-compliant neural architecture. 
                We utilize AES-256 protocols to ensure data sovereignty.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <SecurityBadge label="Encryption" />
              <SecurityBadge label="HIPAA" />
              <SecurityBadge label="Sovereignty" />
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-[#F3F4F6] flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-[#111111] transition-colors">Privacy</Link>
              <Link to="/about" className="hover:text-[#111111] transition-colors">Methodology</Link>
              <Link to="/contact" className="hover:text-[#111111] transition-colors">Support</Link>
            </div>
            <div>© 2026 Arrythmia Intelligence</div>
          </div>
        </div>
      </div>

      {/* Health Tips Modal */}
      <AnimatePresence>
        {showTips && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTips(false)}
              className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-10 max-w-md w-full relative z-10 shadow-2xl border border-[#E5E7EB]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F3F4F6] text-[#E8A26A] rounded-xl flex items-center justify-center">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111111]">Heart Tips</h3>
                    <p className="text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">Expert Guidance</p>
                  </div>
                </div>
                <button onClick={() => setShowTips(false)} className="p-2 hover:bg-[#F3F4F6] rounded-xl transition-all">
                  <X size={20} className="text-[#6B7280]" />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                <TipItem title="Daily Movement" text="Try to walk at least 30 minutes daily." />
                <TipItem title="Sodium Control" text="Limit salt intake to under 2,300mg." />
                <TipItem title="Hydration" text="Drink at least 8 glasses of water." />
              </div>

              <button 
                onClick={() => setShowTips(false)}
                className="bg-[#111111] text-white w-full py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-black transition-all rounded-xl"
              >
                Close Insights
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({ icon, label, value, subValue, trend, isAlert }) => (
  <div className="bg-white p-6 rounded-[1.5rem] border border-[#E5E7EB] hover:border-[#111111] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-10 h-10 bg-[#F3F4F6] text-[#111111] flex items-center justify-center rounded-xl group-hover:bg-[#111111] group-hover:text-white transition-all`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      {trend && (
        <span className="text-[8px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-md uppercase tracking-wider">
          {trend}
        </span>
      )}
      {isAlert && (
        <span className="w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      )}
    </div>
    <div className="mt-auto">
      <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">{label}</div>
      <div className="text-xl font-bold text-[#111111] tracking-tight mb-0.5">{value}</div>
      {subValue && <div className="text-[9px] font-medium text-[#6B7280] tracking-tight">{subValue}</div>}
    </div>
  </div>
);

const CompactActionCard = ({ to, icon, title, description }) => (
  <Link to={to} className="bg-white p-5 rounded-[1.25rem] border border-[#E5E7EB] hover:border-[#111111] transition-all flex items-center gap-4 group">
    <div className="w-10 h-10 bg-[#F9FAFB] text-[#111111] flex items-center justify-center rounded-lg group-hover:bg-[#111111] group-hover:text-white transition-all shrink-0">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="text-sm font-bold text-[#111111] tracking-tight truncate">{title}</h4>
      <p className="text-[10px] text-[#6B7280] truncate">{description}</p>
    </div>
    <ChevronRight size={16} className="text-[#6B7280] group-hover:text-[#111111] group-hover:translate-x-1 transition-all" />
  </Link>
);

const SecurityBadge = ({ label }) => (
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-[#111111] rounded-full"></div>
    <span className="text-[9px] font-bold text-[#111111] uppercase tracking-widest">{label}</span>
  </div>
);

const TipItem = ({ title, text }) => (
  <div className="flex gap-4">
    <div className="w-0.5 h-10 bg-[#F3F4F6] rounded-full"></div>
    <div>
      <div className="font-bold text-[#111111] text-sm mb-0.5">{title}</div>
      <div className="text-xs text-[#6B7280] leading-relaxed">{text}</div>
    </div>
  </div>
);

export default PatientDashboard;
