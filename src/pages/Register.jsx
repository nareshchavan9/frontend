import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, User, Mail, Lock, ChevronDown, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#F8FAFC] relative overflow-hidden">
      {/* Home Link - Top Left */}
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-3 text-[#111111] hover:text-[#6B7280] transition-colors group">
        <div className="w-10 h-10 bg-white border border-[#E5E7EB] flex items-center justify-center rounded-xl shadow-sm group-hover:border-[#111111] transition-all">
          <Activity className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Portal Home</span>
      </Link>

      {/* Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E8A26A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#111111]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[700px] w-full relative z-10"
      >
        <div className="bg-white p-10 md:p-14 border border-[#E5E7EB] shadow-2xl rounded-[2rem]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#111111] tracking-tight mb-2">Clinical Registry</h2>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Initialize your professional profile</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-r-xl"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[9px] font-bold text-[#111111] uppercase tracking-widest mb-2.5 ml-1">Full Identity Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#111111] transition-colors" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] py-3.5 pl-12 pr-6 outline-none text-[#111111] font-bold text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl" 
                    placeholder="e.g. Dr. Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-bold text-[#111111] uppercase tracking-widest mb-2.5 ml-1">Clinical Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#111111] transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] py-3.5 pl-12 pr-6 outline-none text-[#111111] font-bold text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl" 
                    placeholder="name@clinical.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[9px] font-bold text-[#111111] uppercase tracking-widest mb-2.5 ml-1">Secure Pass-Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#111111] transition-colors" />
                  <input 
                    type="password" 
                    name="password"
                    required
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] py-3.5 pl-12 pr-6 outline-none text-[#111111] font-bold text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-bold text-[#111111] uppercase tracking-widest mb-2.5 ml-1">Access Role</label>
                <div className="relative">
                  <select 
                    name="role"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] py-3.5 px-6 outline-none text-[#111111] font-bold text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl appearance-none"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="patient">General Patient</option>
                    <option value="doctor">Medical Specialist</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#111111] text-white w-full py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                {loading ? "Processing..." : "Create Account"} <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">
              Already registered? <Link to="/login" className="text-[#111111] hover:underline underline-offset-8 decoration-2 transition-all font-bold">Sign In Here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
