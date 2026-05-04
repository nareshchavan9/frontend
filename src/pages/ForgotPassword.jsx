import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-healthcare-light">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-6">
            <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-healthcare-blue transition-colors text-sm font-medium">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-healthcare-dark">Reset Password</h2>
            <p className="text-slate-400 text-sm mt-1">Enter your email and a new password</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-healthcare-dark mb-2">Password Reset!</h3>
              <p className="text-slate-500">Your password has been successfully updated. Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      className="input-field pl-12 h-11" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="password" 
                      required
                      className="input-field pl-12 h-11" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="password" 
                      required
                      className="input-field pl-12 h-11" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                  >
                    {loading ? 'Processing...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
