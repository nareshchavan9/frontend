import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Loader2,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    gender: '',
    age: '',
    blood_group: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone_number: formData.phone_number,
        gender: formData.gender,
        age: formData.age ? parseInt(formData.age) : null,
        blood_group: formData.blood_group
      };

      await api.post('/auth/register', submitData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6 font-['Inter']">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1000px] w-full bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[720px]"
      >
        {/* Left Side: Branding & Welcome */}
        <div className="md:w-[40%] bg-[#1A1A1A] p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#14B8A6]/10 blur-[80px] -mr-40 -mt-40 rounded-full" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 bg-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight font-['Poppins']">HeartSync</span>
            </Link>
            
            <div className="mt-16">
              <h1 className="text-3xl font-bold leading-[1.1] mb-4 font-['Poppins'] tracking-tight">
                Join the <br />
                <span className="text-[#14B8A6]">Neural Network</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed mb-8">
                Join thousands of clinicians redefining heart health through AI.
              </p>

              <div className="space-y-6">
                <FeatureItem icon={<ShieldCheck size={18} className="text-[#14B8A6]" />} title="Secure Data" />
                <FeatureItem icon={<UserCheck size={18} className="text-[#14B8A6]" />} title="Clinical Grade" />
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 flex items-center justify-between">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">HIPAA COMPLIANT STACK</p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 p-8 md:p-10 lg:px-12 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="max-w-md mx-auto w-full pt-4">
            {/* Top Status Bar to utilize space */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#14B8A6] rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Security Sync</span>
              </div>
              <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">v4.2.0-stable</div>
            </div>

            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 font-['Poppins']">Create Account</h2>
                <p className="text-xs text-slate-400 font-medium">Have an account? <Link to="/login" className="text-[#14B8A6] font-bold">Log in</Link></p>
              </div>
              <div className="flex gap-2">
                <SocialMini icon={<img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" />} />
                <SocialMini icon={<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05 1.72-3.23 1.72-1.15 0-1.63-.73-2.99-.73-1.35 0-1.92.71-3 .71-1.15 0-2.2-.77-3.26-1.72C2.47 18.23 1 14.7 1 11.23c0-3.6 2.34-5.5 4.61-5.5 1.2 0 2.2.78 3 1.28.65.41 1.23.85 1.95.85.67 0 1.27-.45 1.95-.87.88-.55 2.07-1.26 3.39-1.26 2.15 0 4.1 1.48 5.09 3.53-4.52 1.7-3.79 7.61.41 9.02zM12.03 5.07c0-2.3 1.88-4.07 4.07-4.07.1 0 .21 0 .31.01-.12 2.45-2.12 4.41-4.38 4.06z"/></svg>} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 text-[10px] font-bold border-l-4 border-red-500">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Compact Role Selection */}
              <div className="flex gap-3 mb-6">
                <RoleTab 
                  active={formData.role === 'patient'} 
                  onClick={() => setFormData({...formData, role: 'patient'})}
                  icon={<User size={14} />}
                  label="Patient"
                />
                <RoleTab 
                  active={formData.role === 'doctor'} 
                  onClick={() => setFormData({...formData, role: 'doctor'})}
                  icon={<Stethoscope size={14} />}
                  label="Doctor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CompactInput label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                <CompactInput label="Email Address" name="email" type="email" placeholder="john@email.com" value={formData.email} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CompactInput label="Phone Number" name="phone_number" placeholder="+1..." value={formData.phone_number} onChange={handleChange} />
                <CompactInput label="Age" name="age" type="number" placeholder="25" value={formData.age} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CompactSelect 
                  label="Gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  options={['Male', 'Female', 'Other']}
                />
                <CompactSelect 
                  label="Blood Group" 
                  name="blood_group" 
                  value={formData.blood_group} 
                  onChange={handleChange}
                  options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <CompactInput label="Password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••" value={formData.password} onChange={handleChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 text-slate-300 hover:text-[#14B8A6]">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative">
                  <CompactInput label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••" value={formData.confirmPassword} onChange={handleChange} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 bottom-3 text-slate-300 hover:text-[#14B8A6]">
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Ultra Compact Strength */}
              {formData.password && (
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-full flex-1 transition-all ${i <= passwordStrength ? (passwordStrength > 2 ? 'bg-[#14B8A6]' : 'bg-orange-400') : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter w-12 text-right">Security</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-[#14B8A6] border-[#14B8A6]' : 'border-slate-200 group-hover:border-[#14B8A6]'}`}>
                  {agreed && <Check size={10} className="text-white" />}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">I agree to the <span className="text-[#14B8A6] font-bold">Terms & Privacy</span></p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-premium-teal w-full py-4 text-[11px] font-bold uppercase tracking-[0.3em] shadow-lg group mt-4"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2">Sign Up <ChevronRight size={14} /></span>}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ icon, title }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">{icon}</div>
    <div className="font-bold text-[11px] uppercase tracking-widest">{title}</div>
  </div>
);

const SocialMini = ({ icon }) => (
  <button type="button" className="w-10 h-10 border border-slate-100 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-all shadow-sm">
    {icon}
  </button>
);

const RoleTab = ({ active, onClick, icon, label }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all ${active ? 'border-[#14B8A6] bg-teal-50/10 text-[#14B8A6]' : 'border-slate-50 bg-white text-slate-400 hover:border-slate-100'}`}
  >
    {icon} <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const CompactInput = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-teal-500/5 transition-all outline-none" 
      {...props} 
    />
  </div>
);

const CompactSelect = ({ label, options, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-teal-500/5 transition-all outline-none appearance-none" 
      {...props} 
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Register;
