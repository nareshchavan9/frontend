import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FileText, Download, Activity, Calendar, Eye, ChevronDown, ChevronUp, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/predict/history');
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
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

  const filteredHistory = history.filter(item => 
    item.prediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Editorial Header - Centered */}
      <div className="flex flex-col items-center text-center mb-10 gap-3">
        <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-2">
          <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
          Clinical Diagnostic Registry
          <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight mb-2">Diagnostic History</h1>
        <p className="text-[#6B7280] text-base font-medium max-w-lg">A comprehensive registry of your heart health evaluations and neural reports.</p>
      </div>

      {/* Filters Area - Centered and Compact */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search evaluations..." 
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-[#E5E7EB] rounded-xl focus:border-[#111111] outline-none text-xs font-bold uppercase tracking-widest transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#111111] transition-all text-[#111111]">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-[2rem] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">Synchronizing Archive...</span>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-8 py-5 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Diagnostic Outcome</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Precision Index</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Registered Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filteredHistory.slice(0, visibleCount).map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item._id} 
                    className="hover:bg-[#F9FAFB]/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center ${item.prediction.toLowerCase().includes('normal') ? 'text-[#111111]' : 'text-red-500'}`}>
                          <Activity size={16} />
                        </div>
                        <span className="text-sm font-bold text-[#111111] tracking-tight">{item.prediction}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-1 bg-[#F3F4F6] rounded-full overflow-hidden shrink-0">
                          <div 
                            className={`h-full ${item.confidence > 0.9 ? 'bg-[#111111]' : 'bg-[#E8A26A]'}`} 
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#111111] tracking-widest tabular-nums">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
                        <Calendar size={14} />
                        {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleView(item._id)}
                          className="w-8 h-8 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#111111] hover:text-white transition-all flex items-center justify-center"
                          title="View Report"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleDownload(item._id)}
                          className="w-8 h-8 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#111111] hover:text-white transition-all flex items-center justify-center"
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-32 text-center">
            <div className="text-[#6B7280] mb-2 font-bold uppercase tracking-[0.2em] text-[10px]">Registry Empty</div>
            <p className="text-[#6B7280] text-[10px] font-medium">No diagnostic records match your search.</p>
          </div>
        )}
      </div>

      {filteredHistory.length > 5 && (
        <div className="flex items-center justify-center gap-6 mt-12">
          {visibleCount < filteredHistory.length ? (
            <button 
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="bg-[#111111] text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3"
            >
              Load Additional <ChevronDown size={14} />
            </button>
          ) : (
            <button 
              onClick={() => setVisibleCount(5)}
              className="border border-[#E5E7EB] text-[#111111] px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#F9FAFB] transition-all flex items-center gap-3"
            >
              Collapse Archive <ChevronUp size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
