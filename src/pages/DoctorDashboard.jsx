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
  MessageSquare
} from 'lucide-react';
import api from '../services/api';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'patients'
  const [patientTypeFilter, setPatientTypeFilter] = useState('all'); // 'all', 'self', 'clinical'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, analysesRes] = await Promise.all([
          api.get('/reports/admin/patients'),
          api.get('/predict/all')
        ]);
        
        // Self-registered patients from users collection
        const selfRegistered = patientsRes.data.map(p => ({
          ...p,
          type: 'self',
          patient_name: p.name // for consistency
        }));

        // Extract clinical patients from analyses history
        const clinicalPatientMap = new Map();
        analysesRes.data.forEach(a => {
          if (a.patient_name && !selfRegistered.some(p => p.name === a.patient_name)) {
            if (!clinicalPatientMap.has(a.patient_name)) {
              clinicalPatientMap.set(a.patient_name, {
                _id: a._id, // Use latest prediction ID as reference
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

  const filteredPatients = patients.filter(p => {
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = patientTypeFilter === 'all' || p.type === patientTypeFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAnalyses = analyses.filter(a => 
    (a.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const visibleAnalyses = showAllHistory ? filteredAnalyses : filteredAnalyses.slice(0, 3);
  const visiblePatients = showAllPatients ? filteredPatients : filteredPatients.slice(0, 3);

  if (loading) {
    return (
      <div className="pt-28 flex justify-center items-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-healthcare-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">Synchronizing Clinical Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-healthcare-dark">Doctor Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor patient health and AI detection metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/ai-assistant" className="p-3 bg-healthcare-dark text-white rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
            <MessageSquare size={20} className="text-orange-400" />
            <span className="font-bold text-sm">Clinical AI</span>
          </Link>
          <Link to="/doctor/analyze" className="btn-primary flex items-center gap-2">
            <Activity size={20} /> New Patient Analysis
          </Link>
        </div>
      </div>

      {/* Quick Search Gateway */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-healthcare-blue transition-colors">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-healthcare-blue focus:shadow-lg focus:shadow-healthcare-blue/10 transition-all text-lg font-medium placeholder:text-slate-300 shadow-sm"
            placeholder="Search patients by name, email, or record..."
            onChange={(e) => navigate(`/doctor/search?q=${e.target.value}`)}
          />
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <MiniStatCard icon={<Users />} label="Total Patients" value={patients.length} color="bg-blue-500" />
        <MiniStatCard icon={<Clipboard />} label="Total Analyses" value={analyses.length} color="bg-orange-500" />
        <MiniStatCard icon={<TrendingUp />} label="Abnormal Cases" value={analyses.filter(a => a.prediction !== 'Normal').length} color="bg-teal-500" />
        <MiniStatCard icon={<AlertCircle />} label="Recent Alerts" value={analyses.filter(a => a.prediction === 'Abnormal').length} color="bg-red-500" />
        
        <MiniStatCard 
          icon={<FileText />} 
          label="Analysis Summary" 
          value={`${((analyses.filter(a => a.prediction !== 'Normal').length / (analyses.length || 1)) * 100).toFixed(1)}%`}
          color="bg-purple-600"
        />
      </div>

      {/* Tab Navigation & Content */}
      <div className="flex gap-4 mb-8 border-b border-slate-100 pb-px">
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'history' ? 'text-healthcare-blue' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-2">
            <History size={18} /> Recent History
          </div>
          {activeTab === 'history' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-healthcare-blue" />}
        </button>
        <button 
          onClick={() => setActiveTab('patients')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'patients' ? 'text-healthcare-blue' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} /> Registered Patients
          </div>
          {activeTab === 'patients' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-healthcare-blue" />}
        </button>
      </div>

      <AnimatePresence mode="wait">

            {activeTab === 'history' ? (
              <motion.div 
                key="history-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="mb-16"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-healthcare-blue rounded-lg">
                        <History size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-healthcare-dark">Recent Clinical History</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      {filteredAnalyses.length > 3 && (
                        <button 
                          onClick={() => setShowAllHistory(!showAllHistory)}
                          className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl hover:text-healthcare-blue transition-all flex items-center gap-2"
                        >
                          {showAllHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {showAllHistory ? 'Show Less' : `Show ${filteredAnalyses.length - 3} More`}
                        </button>
                      )}
                      {filteredAnalyses.length > 3 && (
                        <button 
                          onClick={() => navigate('/doctor/history')}
                          className="text-sm font-semibold text-healthcare-blue hover:underline flex items-center gap-1"
                        >
                          View All History <ArrowUpRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {visibleAnalyses.map((item) => (
                      <div key={item._id} className="glass-card p-4 hover:shadow-md transition-all border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${item.prediction === 'Normal' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            <Activity size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-healthcare-dark">{item.patient_name || "Self-Tested Patient"}</div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={12} /> {new Date(item.timestamp).toLocaleDateString()}
                              </div>
                              <div className="text-[10px] font-black text-healthcare-blue bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                {item.doctor_name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center sm:items-end">
                          <div className={`text-sm font-bold ${item.prediction === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.prediction} ({(item.confidence * 100).toFixed(0)}%)
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleView(item._id)}
                              className="p-1.5 bg-healthcare-blue/5 text-healthcare-blue rounded-lg hover:bg-healthcare-blue/10 transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => handleDownload(item._id)}
                              className="p-1.5 bg-healthcare-blue/5 text-healthcare-blue rounded-lg hover:bg-healthcare-blue/10 transition-colors"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="patients-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    {['all', 'self', 'clinical'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setPatientTypeFilter(type)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${patientTypeFilter === type ? 'bg-white text-healthcare-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {type === 'all' ? 'All Patients' : type === 'self' ? 'Self-Registered' : 'Clinical'}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    {filteredPatients.length > 3 && (
                      <button 
                        onClick={() => setShowAllPatients(!showAllPatients)}
                        className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl hover:text-healthcare-blue transition-all flex items-center gap-2"
                      >
                        {showAllPatients ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {showAllPatients ? 'Show Less' : `Show ${filteredPatients.length - 3} More`}
                      </button>
                    )}
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredPatients.length} Patients Total</span>
                  </div>
                </div>

                <div className="glass-card overflow-hidden border border-slate-100 shadow-sm mb-6">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Reference/Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Age/Gender</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Tests</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visiblePatients.map((patient) => (
                        <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-healthcare-dark">{patient.name}</td>
                          <td className="px-6 py-5">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${patient.type === 'self' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                              {patient.type}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-slate-500 text-sm">{patient.email}</td>
                          <td className="px-6 py-5">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                              {patient.age}y / {(patient.gender || '??').charAt(0).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-healthcare-blue text-xs font-black">
                              {patient.testCount}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => navigate(`/doctor/patient/${patient._id}`)}
                              className="text-healthcare-blue hover:text-blue-700 font-bold text-sm bg-healthcare-blue/5 px-4 py-2 rounded-xl transition-all inline-flex items-center gap-2"
                            >
                              Details <ArrowUpRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

const MiniStatCard = ({ icon, label, value, color }) => (
  <div className="glass-card p-6 border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-slate-200`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-bold text-healthcare-dark">{value}</div>
  </div>
);

export default DoctorDashboard;