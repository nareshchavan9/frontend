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
  ChevronLeft
} from 'lucide-react';
import api from '../services/api';

const GlobalHistoryPage = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', age: '', gender: 'male' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/predict/all');
      setAnalyses(response.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
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
      fetchHistory();
    } catch (err) {
      alert('Failed to update record');
    }
  };

  const filteredAnalyses = analyses.filter(a => 
    (a.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
    <div className="pt-24 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F5F5F5] relative">
      {/* Top Right Search Bar - Absolute Positioning */}
      <div className="absolute top-24 right-6 lg:right-10 w-full md:w-72 z-20">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input 
            type="text" 
            className="w-full pl-12 pr-6 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:border-[#111111] outline-none text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm" 
            placeholder="Search activity records..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Editorial Header - Centered */}
      <div className="flex flex-col items-center text-center mb-16 mt-16 md:mt-0 gap-4">
        <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-2">
          <span className="w-6 h-[1px] bg-[#E5E7EB]"></span>
          Global Clinical Feed
        </div>
        <h1 className="text-4xl font-bold text-[#111111] tracking-tight mb-2">Recent Activity</h1>
        <p className="text-[#6B7280] text-base font-medium max-w-lg leading-relaxed">
          Comprehensive log of all diagnostic evaluations and patient telemetry across the clinical hub.
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAnalyses.map((item) => (
            <motion.div 
              key={item._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-[1.5rem] border border-[#E5E7EB] hover:border-[#111111] transition-all shadow-sm group"
            >
              {editingId === item._id ? (
                <form onSubmit={handleUpdate} className="flex flex-wrap gap-6 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 block">Patient Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#111111]" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 block">Age</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#111111]" 
                      value={editForm.age}
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="w-10 h-10 bg-[#111111] text-white rounded-lg flex items-center justify-center hover:bg-black transition-all">
                      <Check size={18} />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="w-10 h-10 bg-[#F3F4F6] text-[#111111] rounded-lg flex items-center justify-center hover:bg-[#E5E7EB] transition-all">
                      <X size={18} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.prediction === 'Normal' ? 'bg-[#F3F4F6] text-[#111111]' : 'bg-red-50 text-red-500'} group-hover:bg-[#111111] group-hover:text-white transition-all`}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#111111] leading-tight mb-1">{item.patient_name || "Unknown Profile"}</div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold text-[#6B7280] flex items-center gap-1 uppercase tracking-widest">
                          <Clock size={12} /> {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${item.prediction === 'Normal' ? 'border-[#E5E7EB] text-[#111111]' : 'border-red-100 text-red-500 bg-red-50'}`}>
                          {item.prediction}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button onClick={() => handleView(item._id)} className="w-10 h-10 bg-white border border-[#E5E7EB] text-[#111111] rounded-xl flex items-center justify-center hover:bg-[#111111] hover:text-white transition-all" title="View Report">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDownload(item._id)} className="w-10 h-10 bg-[#111111] text-white rounded-xl flex items-center justify-center hover:bg-black transition-all" title="Download PDF">
                      <Download size={16} />
                    </button>
                    <div className="w-[1px] h-6 bg-[#E5E7EB] mx-2"></div>
                    <button onClick={() => startEdit(item)} className="w-10 h-10 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-xl flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-all" title="Edit Clinical Metadata">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="w-10 h-10 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-xl flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all" title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlobalHistoryPage;
