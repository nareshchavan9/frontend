import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle, ChevronRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    age: '',
    gender: 'male'
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
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-2 px-4 bg-healthcare-light pt-20 pb-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="glass-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-healthcare-dark">Create Account</h2>
            <p className="text-slate-500 text-sm mt-1">Join our AI-powered healthcare platform</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  name="name"
                  required
                  className="input-field py-2.5 pl-12 text-sm" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="email" 
                  name="email"
                  required
                  className="input-field py-2.5 pl-12 text-sm" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="input-field py-2.5 pl-12 text-sm" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
              <select 
                name="role"
                className="input-field py-2.5 text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                name="age"
                className="input-field py-2.5 text-sm"
                placeholder="25"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select 
                name="gender"
                className="input-field py-2.5 text-sm"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-center">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-fit max-w-xs py-3 flex items-center justify-center gap-2 mt-2 text-base"
              >
                {loading ? 'Creating Account...' : <><UserPlus className="w-5 h-5" /> Create Account</>}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-healthcare-blue font-semibold hover:underline">Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>

  );
};

export default Register;
