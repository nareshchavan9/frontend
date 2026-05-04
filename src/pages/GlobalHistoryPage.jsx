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
  Check
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
    // Parse name from notes if possible
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
      fetchHistory(); // Refresh
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
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor')} className="p-2 hover:bg-slate-100 rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark flex items-center gap-2">
              <History className="text-healthcare-blue" /> Global Clinical History
            </h1>
            <p className="text-slate-500">Manage all clinical analyses and patient metadata</p>
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            className="input-field pl-10" 
            placeholder="Search by patient name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredAnalyses.map((item) => (
            <motion.div 
              key={item._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 border border-slate-100 hover:shadow-lg transition-all"
            >
              {editingId === item._id ? (
                <form onSubmit={handleUpdate} className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-bold text-slate-400 uppercase">Patient Name</label>
                    <input 
                      type="text" 
                      className="input-field py-2" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
                    <input 
                      type="number" 
                      className="input-field py-2" 
                      value={editForm.age}
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      <Check size={20} />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                      <X size={20} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={`p-4 rounded-2xl ${item.prediction === 'Normal' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      <Activity size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-healthcare-dark">{item.patient_name || "Unknown Patient"}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={14} /> {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${item.prediction === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.prediction}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button onClick={() => handleView(item._id)} className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-healthcare-blue/10 hover:text-healthcare-blue transition-all" title="View">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDownload(item._id)} className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-healthcare-blue/10 hover:text-healthcare-blue transition-all" title="Download">
                      <Download size={18} />
                    </button>
                    <div className="w-px h-8 bg-slate-100 mx-1"></div>
                    <button onClick={() => startEdit(item)} className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all" title="Edit Metadata">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all" title="Delete Record">
                      <Trash2 size={18} />
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
