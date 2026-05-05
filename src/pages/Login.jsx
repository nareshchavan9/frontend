import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      // Determine redirect path based on role
      const userRole = response?.user?.role || response?.role;
      if (userRole === 'doctor' || userRole === 'admin') {
        navigate('/doctor');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Identity verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC] relative overflow-hidden">
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
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[460px] w-full relative z-10"
      >
        <div className="bg-white p-10 md:p-14 border border-[#E5E7EB] shadow-2xl rounded-[2.5rem]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#111111] tracking-tight mb-2">Welcome Back</h2>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Continue with your clinical credentials</p>
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
            <div className="group">
              <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-widest mb-3 ml-1">Clinical Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#111111] transition-colors" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] py-4 pl-14 pr-6 outline-none text-[#111111] font-bold text-sm focus:border-[#111111] focus:bg-white transition-all rounded-2xl placeholder:text-slate-300" 
                  placeholder="name@clinical.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-3 ml-1">
                <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-widest">Pass-Key</label>
                <Link to="/forgot-password" size="sm" className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest hover:text-[#111111] transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#111111] transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] py-4 pl-14 pr-6 outline-none text-[#111111] font-bold text-sm focus:border-[#111111] focus:bg-white transition-all rounded-2xl placeholder:text-slate-300" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#111111] text-white w-full py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10 rounded-2xl active:scale-[0.98]"
              >
                {loading ? "Authenticating..." : "Establish Secure Access"}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
            No account? <Link to="/register" className="text-[#111111] font-bold hover:underline underline-offset-8 transition-all">Request access</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
