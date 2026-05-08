import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FileText, Download, Activity, Calendar, Eye, ChevronDown, ChevronUp, ArrowRight, ChevronLeft, ChevronRight, Loader2, History } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const HistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('q') || '';
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = async (pageNumber = 1, isAppend = false) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const response = await api.get(`/predict/history?page=${pageNumber}&limit=20&search=${encodeURIComponent(searchTerm)}`);
      const newItems = response.data;
      
      if (newItems.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (isAppend) {
        setHistory(prev => [...prev, ...newItems]);
      } else {
        setHistory(newItems);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchHistory(1, false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage, true);
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



  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center mb-12 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-2"
        >
          <span className="w-8 h-[1px] bg-teal-100"></span>
          Clinical Diagnostic Registry
          <span className="w-8 h-[1px] bg-teal-100"></span>
        </motion.div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">Diagnostic History</h1>
        <p className="text-slate-500 text-sm font-medium max-w-xl">Comprehensive archive of cardiac evaluations and neural diagnostic reports.</p>
      </div>

      {/* Filters Area */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14B8A6] transition-colors" />
          <input 
            type="text" 
            placeholder="Search evaluations or outcome types..." 
            className="input-premium !bg-white border-slate-200/60 w-full pl-14 pr-6 py-4 text-[11px] font-bold uppercase tracking-widest shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="premium-card bg-white overflow-hidden border-slate-50 shadow-2xl">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-teal-50 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Synchronizing Archive...</span>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Diagnostic Outcome</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Precision Index</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Registry Date</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % 20) * 0.03 }}
                    key={item._id} 
                    className="hover:bg-slate-50/30 transition-colors group cursor-default"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm transition-colors ${item.prediction.toLowerCase().includes('normal') ? 'bg-teal-50 border-teal-100 text-[#14B8A6]' : 'bg-red-50 border-red-100 text-red-500'}`}>
                          <Activity size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-[#1A1A1A] tracking-tight group-hover:text-[#14B8A6] transition-colors">{item.prediction}</span>
                          {item.patient_name && (
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.patient_name}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                          <div 
                            className={`h-full ${item.confidence > 0.9 ? 'bg-[#14B8A6]' : 'bg-red-400'}`} 
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#1A1A1A] tracking-[0.1em] tabular-nums">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={14} className="text-teal-500 opacity-60" />
                        {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleView(item._id)}
                          className="w-9 h-9 rounded-xl border border-slate-100 text-slate-400 hover:bg-[#14B8A6] hover:text-white hover:border-[#14B8A6] transition-all flex items-center justify-center shadow-sm"
                          title="View PDF"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDownload(item._id)}
                          className="w-9 h-9 rounded-xl border border-slate-100 text-slate-400 hover:bg-[#14B8A6] hover:text-white hover:border-[#14B8A6] transition-all flex items-center justify-center shadow-sm"
                          title="Export Report"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <History size={32} />
            </div>
            <div className="text-slate-400 mb-2 font-bold uppercase tracking-[0.3em] text-[10px]">No telemetry records found</div>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Initialize a new diagnostic analysis to populate registry.</p>
          </div>
        )}
      </div>

      {hasMore && history.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-12">
          <button 
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-outline-premium group px-10 py-3.5 flex items-center gap-3"
          >
            {loadingMore ? <Loader2 className="w-4 h-4 animate-spin text-[#14B8A6]" /> : <ChevronDown size={18} className="text-slate-300 group-hover:text-[#14B8A6] transition-colors" />}
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              {loadingMore ? "Synchronizing Archive..." : "Load Additional Records"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
