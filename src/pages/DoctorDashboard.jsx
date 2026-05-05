import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  ArrowUpRight, 
  AlertCircle, 
  FileText, 
  Activity, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  History,
  TrendingUp,
  Clipboard,
  Eye,
  Download,
  MessageSquare,
  Filter,
  Plus,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, analysesRes] = await Promise.all([
          api.get('/reports/admin/patients'),
          api.get('/predict/all')
        ]);
        
        const selfRegistered = patientsRes.data.map(p => ({
          ...p,
          type: 'self',
          patient_name: p.name
        }));

        const clinicalPatientMap = new Map();
        analysesRes.data.forEach(a => {
          if (a.patient_name && !selfRegistered.some(p => p.name === a.patient_name)) {
            if (!clinicalPatientMap.has(a.patient_name)) {
              clinicalPatientMap.set(a.patient_name, {
                _id: a._id,
                name: a.patient_name,
                patient_name: a.patient_name,
                email: 'N/A (Clinical)',
                age: a.notes?.match(/Age:\s*(\d+)/)?.[1] || '??',
                gender: a.notes?.match(/Gender:\s*(\w+)/)?.[1] || 'Unknown',
                type: 'clinical'
              });
            }
          }
        });

        const allPatients = [...selfRegistered, ...Array.from(clinicalPatientMap.values())].map(p => {
          const count = analysesRes.data.filter(a => 
            a.user_id === p._id || (a.patient_name && a.patient_name === p.name)
          ).length;
          return { ...p, testCount: count };
        });
        setPatients(allPatients);
        setAnalyses(analysesRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dynamic Search Redirection
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const delayDebounceFn = setTimeout(() => {
        navigate(`/doctor/search?q=${encodeURIComponent(searchTerm)}`);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, navigate]);

  if (loading) {
    return (
      <div className="pt-28 flex justify-center items-center h-screen bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#111111]/10 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#6B7280] font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Diagnostic Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto bg-[#F5F5F5] min-h-screen flex flex-col">
      {/* 1. Action Buttons - Top & Centered - LARGER SCALE */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <Link to="/doctor/history" className="bg-white border border-[#E5E7EB] text-[#111111] px-8 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:border-[#111111] transition-all flex items-center gap-3 shadow-sm">
          <History size={18} /> Recent Activity
        </Link>
        <Link to="/doctor/search" className="bg-white border border-[#E5E7EB] text-[#111111] px-8 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:border-[#111111] transition-all flex items-center gap-3 shadow-sm">
          <Users size={18} /> Patient Registry
        </Link>
        <Link to="/ai-assistant" className="bg-white border border-[#E5E7EB] text-[#111111] px-8 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:border-[#111111] transition-all flex items-center gap-3 shadow-sm">
          <MessageSquare size={18} /> AI Consult
        </Link>
        <Link to="/doctor/analyze" className="bg-[#111111] text-white px-8 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-black/5">
          <Plus size={18} /> New Test
        </Link>
      </div>

      {/* 2. Top Search Bar - Prominent & Centered */}
      <div className="max-w-2xl mx-auto mb-16 w-full">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              navigate(`/doctor/search?q=${encodeURIComponent(searchTerm)}`);
            }
          }}
          className="relative group"
        >
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#111111] transition-colors" />
          <input 
            type="text" 
            placeholder="Search clinical registry, patients or reports..." 
            className="w-full pl-16 pr-8 py-5 bg-white border border-[#E5E7EB] rounded-[1.5rem] focus:border-[#111111] focus:ring-4 focus:ring-[#111111]/5 outline-none text-[13px] font-bold uppercase tracking-widest shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#111111] hover:text-white text-[#6B7280] rounded-lg border border-[#E5E7EB] transition-all"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
          </button>
        </form>
      </div>

      {/* 3. Stats Cards - Main Workspace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        <StatCard 
          icon={<Users />} 
          label="Active Registry" 
          value={patients.length} 
          trend="+14% Month"
        />
        <StatCard 
          icon={<Clipboard />} 
          label="Total Records" 
          value={analyses.length} 
          trend="84 New"
        />
        <StatCard 
          icon={<AlertCircle />} 
          label="Critical Cases" 
          value={analyses.filter(a => a.prediction !== 'Normal').length} 
          trend="Review Alert"
          isAlert={true}
        />
        <StatCard 
          icon={<ShieldCheck />} 
          label="Neural Precision" 
          value="98.5%" 
          trend="v4.2"
        />
      </div>

      {/* Spacer to push content to footer if page is empty */}
      <div className="flex-grow"></div>

      {/* 4. Editorial Footer Content */}
      <div className="border-t border-[#E5E7EB] pt-12 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[9px] uppercase tracking-widest mb-2">
              <span className="w-4 h-[1px] bg-[#E5E7EB]"></span>
              Physician Control Center
            </div>
            <h2 className="text-xl font-bold text-[#111111] tracking-tight">Physician Overview</h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.2em]">Monitoring {patients.length} Active Profiles</p>
            <p className="text-[#9CA3AF] text-[8px] font-medium mt-1 uppercase tracking-widest">System Precision Index: 98.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, isAlert }) => (
  <div className="bg-white p-6 rounded-[1.5rem] border border-[#E5E7EB] hover:border-[#111111] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-10 h-10 bg-[#F3F4F6] text-[#111111] flex items-center justify-center rounded-xl group-hover:bg-[#111111] group-hover:text-white transition-all`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">{trend}</span>
        {isAlert && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>}
      </div>
    </div>
    <div className="mt-auto">
      <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#111111] tracking-tight">{value}</div>
    </div>
  </div>
);

export default DoctorDashboard;