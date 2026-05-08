import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  ChevronRight,
  Heart,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      if (response?.access_token) {
        const userRole = response?.user?.role || response?.role;
        navigate(userRole === 'doctor' || userRole === 'admin' ? '/doctor' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6 font-['Inter']">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[850px] w-full bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]"
      >
        {/* Left Side: Branding & Trust */}
        <div className="md:w-[40%] bg-[#1A1A1A] p-8 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#14B8A6]/10 blur-[80px] -mr-40 -mt-40 rounded-full" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 group w-fit mb-12">
              <div className="w-9 h-9 bg-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight font-['Poppins']">HeartSync</span>
            </Link>
            
            <div className="mt-4">
              <h1 className="text-2xl text-[#14B8A6] lg:text-3xl font-bold leading-[1.1] mb-4 font-['Poppins'] tracking-tight">
                Your Health, <br />
                <span className="text-[#14B8A6]">Our Priority</span>.
              </h1>
              <p className="text-slate-400 text-xs font-medium max-w-xs leading-relaxed mb-8">
                Log in to access your clinical diagnostic hub and neural telemetry reports.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-[#14B8A6]" />
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest">AES-256 Encrypted</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Heart size={16} className="text-red-400" />
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest">HIPAA Compliant</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Clinical Precision v4.2</div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-10 lg:px-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Security Badge */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full animate-pulse"></div>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Session Active</span>
              </div>
              <div className="text-[7px] font-bold text-slate-300 uppercase tracking-widest italic">Registry Sync</div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 font-['Poppins']">Welcome Back</h2>
              <p className="text-xs text-slate-400 font-medium">New? <Link to="/register" className="text-[#14B8A6] font-bold">Create Account</Link></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 text-[10px] font-bold border-l-4 border-red-500">
                  <Activity size={14} /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#14B8A6] transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-xs font-medium focus:bg-white focus:border-[#14B8A6] transition-all outline-none" 
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[9px] font-bold text-[#14B8A6] uppercase tracking-widest hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#14B8A6] transition-colors" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    required
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl pl-11 pr-11 py-3 text-xs font-medium focus:bg-white focus:border-[#14B8A6] transition-all outline-none" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#14B8A6]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({...formData, rememberMe: !formData.rememberMe})}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.rememberMe ? 'bg-[#14B8A6] border-[#14B8A6]' : 'border-slate-200 group-hover:border-[#14B8A6]'}`}>
                    {formData.rememberMe && <Check size={10} className="text-white" />}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Remember Me</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-premium-teal w-full py-4 text-[11px] font-bold uppercase tracking-[0.3em] shadow-lg group"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2">Login Now <ChevronRight size={16} /></span>}
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-bold text-[9px] text-slate-500 uppercase tracking-widest">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3.5 h-3.5" alt="G" /> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-bold text-[9px] text-slate-500 uppercase tracking-widest">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05 1.72-3.23 1.72-1.15 0-1.63-.73-2.99-.73-1.35 0-1.92.71-3 .71-1.15 0-2.2-.77-3.26-1.72C2.47 18.23 1 14.7 1 11.23c0-3.6 2.34-5.5 4.61-5.5 1.2 0 2.2.78 3 1.28.65.41 1.23.85 1.95.85.67 0 1.27-.45 1.95-.87.88-.55 2.07-1.26 3.39-1.26 2.15 0 4.1 1.48 5.09 3.53-4.52 1.7-3.79 7.61.41 9.02zM12.03 5.07c0-2.3 1.88-4.07 4.07-4.07.1 0 .21 0 .31.01-.12 2.45-2.12 4.41-4.38 4.06z"/></svg> Apple
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
