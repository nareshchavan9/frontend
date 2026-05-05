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
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC] relative">
      {/* Home Link - Top Left */}
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-3 text-medical-dark hover:text-tan transition-colors group">
        <div className="w-10 h-10 bg-white border border-slate-100 flex items-center justify-center rounded-xl shadow-sm group-hover:border-tan transition-all">
          <Activity className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Portal Home</span>
      </Link>

      {/* Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-tan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-medical-dark/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[480px] w-full relative z-10"
      >
        <div className="bg-white p-10 sm:p-12 border border-slate-100 shadow-premium rounded-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-medical-dark tracking-tight mb-2">Access Recovery</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reset your clinical credentials</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-tan/10 text-tan flex items-center justify-center mx-auto mb-8 rounded-2xl">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-medical-dark mb-4">Credentials Updated</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Your access has been restored. Redirecting to the secure gateway...</p>
            </div>
          ) : (
            <>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-4 bg-danger/5 border-l-4 border-danger text-danger text-[10px] font-bold uppercase tracking-wider rounded-r-lg"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-medical-dark uppercase tracking-[0.3em] mb-2 ml-1">Verification Email</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white border border-slate-200 py-3 px-5 outline-none text-medical-dark font-bold text-sm focus:border-tan transition-all placeholder:text-slate-300 rounded-xl" 
                      placeholder="name@clinical.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-medical-dark uppercase tracking-[0.3em] mb-2 ml-1">New Pass-Key</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      required
                      className="w-full bg-white border border-slate-200 py-3 px-5 outline-none text-medical-dark font-bold text-sm focus:border-tan transition-all rounded-xl" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-medical-dark uppercase tracking-[0.3em] mb-2 ml-1">Confirm New Pass-Key</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      required
                      className="w-full bg-white border border-slate-200 py-3 px-5 outline-none text-medical-dark font-bold text-sm focus:border-tan transition-all rounded-xl" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-medical-dark text-white w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg rounded-xl"
                  >
                    {loading ? "Synchronizing..." : "Reset Credentials"}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Remembered? <Link to="/login" className="text-tan font-bold hover:underline underline-offset-8 transition-all">Back to Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
