import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, Activity } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, password: newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC] relative overflow-hidden">
      {/* Home Link */}
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-3 text-[#1A1A1A] hover:text-[#14B8A6] transition-all group">
        <div className="w-11 h-11 bg-white border border-slate-100 flex items-center justify-center rounded-xl shadow-sm group-hover:border-[#14B8A6] group-hover:scale-105 transition-all">
          <Activity className="w-5 h-5 text-[#14B8A6]" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Home</span>
      </Link>

      {/* Soft Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-50/30 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-sky-50/30 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="max-w-[480px] w-full relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 sm:p-14 border border-white shadow-3xl rounded-[3rem]">
          <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-[1.5rem] mb-6 shadow-inner">
                <Lock className="w-8 h-8 text-[#14B8A6]" />
             </div>
            <h2 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">Reset Password</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Enter your new password</p>
          </div>

          {success ? (
            <div className="text-center py-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-teal-50 text-[#14B8A6] flex items-center justify-center mx-auto mb-10 rounded-[2rem] shadow-xl"
              >
                <CheckCircle size={40} />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Password Updated</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">Your password has been changed. Taking you to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-10 p-5 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-r-2xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em] mb-3 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="input-premium w-full" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em] mb-3 ml-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    className="input-premium w-full" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em] mb-3 ml-2">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    className="input-premium w-full" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-premium-teal w-full py-5 text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-[#14B8A6]/20"
                  >
                    {loading ? "Saving..." : "Save Password"}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
            Remembered? <Link to="/login" className="text-[#14B8A6] font-black hover:underline underline-offset-8 transition-all">Login</Link>
          </div>
        </div>
      </motion.div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 w-full text-center opacity-10">
         <div className="text-[9px] font-black uppercase tracking-[0.5em] text-[#1A1A1A]">HeartSync Neural Intelligence • v4.2.0</div>
      </div>
    </div>
  );
};

export default ForgotPassword;
