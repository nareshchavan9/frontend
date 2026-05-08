import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  History, 
  Search, 
  Activity, 
  Clock, 
  Eye, 
  Download, 
  Trash2, 
  Edit3,
  X,
  Check,
  ChevronDown,
  Loader2,
  Calendar,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import api from '../services/api';

const GlobalHistoryPage = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', age: '', gender: 'male' });

  const fetchHistory = async (pageNumber = 1, isAppend = false) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const response = await api.get(`/predict/all?page=${pageNumber}&limit=20`);
      const newItems = response.data;
      
      if (newItems.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (isAppend) {
        setAnalyses(prev => [...prev, ...newItems]);
      } else {
        setAnalyses(newItems);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, false);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage, true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record from the clinical registry?')) return;
    try {
      await api.delete(`/predict/${id}`);
      setAnalyses(analyses.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const startEdit = (item) => {
    let name = item.patient_name || '';
    let age = '';
    let gender = 'male';

    if (item.notes) {
      const parts = item.notes.split('|');
      parts.forEach(p => {
        if (p.includes('Age:')) age = p.split('Age:')[1].trim();
        if (p.includes('Gender:')) gender = p.split('Gender:')[1].trim();
      });
    }

    setEditForm({ name, age, gender });
    setEditingId(item._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('patient_name', editForm.name);
      formData.append('patient_age', editForm.age);
      formData.append('patient_gender', editForm.gender);

      await api.put(`/predict/${editingId}`, formData);
      setEditingId(null);
      fetchHistory(1, false); // Reload first page
    } catch (err) {
      alert('Failed to update record');
    }
  };

  const filteredAnalyses = analyses.filter(a => 
    (a.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.prediction?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleView = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      window.open(URL.createObjectURL(file));
    } catch (err) { console.error(err); }
  };

  const handleDownload = async (predictionId) => {
    try {
      const response = await api.get(`/reports/${predictionId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${predictionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 max-w-[1440px] mx-auto min-h-screen bg-[#F8FAFC] relative">
      {/* Top Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-[1px] bg-teal-100"></span>
            Global Clinical Activity Feed
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">Recent Activity Logs</h1>
          <p className="text-slate-500 text-sm font-medium">Comprehensive diagnostic telemetry across the medical network.</p>
        </div>

        <div className="w-full md:w-[420px] relative">
          <div className="relative group">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14B8A6] transition-colors" />
            <input 
              type="text" 
              className="input-premium !bg-white border-slate-200/60 w-full pl-16 pr-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm" 
              placeholder="SEARCH ACTIVITY LOGS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
             <div className="py-40 flex flex-col items-center justify-center gap-8 bg-white rounded-[3rem] border border-slate-50 shadow-2xl">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-teal-50 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Retrieving Global Logs...</span>
             </div>
          ) : filteredAnalyses.length > 0 ? (
            filteredAnalyses.map((item, index) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 20) * 0.04 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="premium-card bg-white p-6 md:p-8 border-slate-50 hover:border-[#14B8A6] transition-all shadow-sm group"
              >
                {editingId === item._id ? (
                  <form onSubmit={handleUpdate} className="flex flex-wrap gap-8 items-end p-2">
                    <div className="flex-1 min-w-[280px]">
                      <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3 block ml-1">Patient Name</label>
                      <input 
                        type="text" 
                        className="input-premium w-full text-sm" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3 block ml-1">Age</label>
                      <input 
                        type="number" 
                        className="input-premium w-full text-sm text-center" 
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="w-14 h-14 bg-[#14B8A6] text-[#1A1A1A] rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-[#14B8A6]/20">
                        <Check size={24} />
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                        <X size={24} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all ${item.prediction.includes('Normal') ? 'bg-teal-50 text-[#14B8A6]' : 'bg-red-50 text-red-500'} group-hover:bg-[#1A1A1A] group-hover:text-white`}>
                        <Activity size={24} />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[#1A1A1A] tracking-tight group-hover:text-[#14B8A6] transition-colors mb-2">{item.patient_name || "Unknown Clinical Profile"}</div>
                        <div className="flex items-center gap-5">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest opacity-60">
                            <Calendar size={12} /> {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border shadow-sm ${item.prediction.includes('Normal') ? 'border-teal-100 text-[#14B8A6] bg-teal-50/10' : 'border-red-100 text-red-500 bg-red-50'}`}>
                            {item.prediction}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button onClick={() => handleView(item._id)} className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm hover:shadow-xl" title="View Report">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDownload(item._id)} className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm hover:shadow-xl" title="Download PDF">
                        <Download size={18} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-100 mx-4 hidden md:block"></div>
                      <button onClick={() => startEdit(item)} className="w-12 h-12 bg-white border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center hover:border-sky-400 hover:text-sky-500 transition-all shadow-sm" title="Edit Metadata">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="w-12 h-12 bg-white border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all shadow-sm" title="Delete Record">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-40 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
               <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <History size={32} />
               </div>
               <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Archive Empty</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">No activity matching your parameters found.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {hasMore && analyses.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-16">
          <button 
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-outline-premium group px-12 py-4 flex items-center gap-4 shadow-sm"
          >
            {loadingMore ? <Loader2 className="w-5 h-5 animate-spin text-[#14B8A6]" /> : <ChevronDown size={20} className="text-slate-300 group-hover:text-[#14B8A6] transition-colors" />}
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              {loadingMore ? "Updating Feed..." : "Load More Activity"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalHistoryPage;
