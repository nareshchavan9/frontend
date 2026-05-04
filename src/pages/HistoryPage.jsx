import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, Activity, Calendar, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const HistoryPage = () => {
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

  const filteredHistory = history.filter(item => 
    item.prediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-healthcare-dark">Prediction History</h1>
          <p className="text-slate-500 mt-1">Review and manage your past ECG analyses</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by diagnosis..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-healthcare-blue/20 focus:border-healthcare-blue outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-healthcare-blue"></div>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider">Diagnosis</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.slice(0, visibleCount).map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item._id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.prediction.toLowerCase().includes('normal') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800">{item.prediction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.confidence > 0.9 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleView(item._id)}
                          className="p-2 bg-healthcare-blue/5 text-healthcare-blue rounded-lg hover:bg-healthcare-blue/10 transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownload(item._id)}
                          className="p-2 bg-healthcare-blue/5 text-healthcare-blue rounded-lg hover:bg-healthcare-blue/10 transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-slate-400">
            No history records found.
          </div>
        )}
      </div>

      {filteredHistory.length > 5 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          {visibleCount < filteredHistory.length && (
            <button 
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="flex items-center gap-2 px-6 py-3 bg-healthcare-blue text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
            >
              Show More <ChevronDown size={18} />
            </button>
          )}
          {visibleCount > 5 && (
            <button 
              onClick={() => setVisibleCount(5)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Show Less <ChevronUp size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
