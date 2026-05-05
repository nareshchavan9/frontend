import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Menu, 
  Plus,
  X,
  Check,
  AlertCircle,
  FileText,
  ShieldCheck,
  Clock
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Initialize Mock Notifications based on Role
  useEffect(() => {
    if (user) {
      const mockNotifications = user.role === 'doctor' 
        ? [
            { id: 1, type: 'critical', title: 'Critical Evaluation', message: 'Patient "John Doe" shows Arrhythmia. Immediate review needed.', time: '2m ago', read: false, icon: <AlertCircle size={14} className="text-red-500" /> },
            { id: 2, type: 'registration', title: 'New Registry', message: 'Sarah Jenkins has self-registered via the patient portal.', time: '1h ago', read: false, icon: <User size={14} className="text-[#111111]" /> },
            { id: 3, type: 'system', title: 'System Precision', message: 'Neural Engine updated to v4.2: Accuracy increased by 1.2%.', time: '5h ago', read: true, icon: <ShieldCheck size={14} className="text-[#111111]" /> }
          ]
        : [
            { id: 1, type: 'report', title: 'Diagnostic Report', message: 'Your AI Heart Analysis from May 4 is now available for download.', time: '10m ago', read: false, icon: <FileText size={14} className="text-[#111111]" /> },
            { id: 2, type: 'profile', title: 'Profile Updated', message: 'Your medical profile has been successfully synchronized.', time: '3h ago', read: true, icon: <Check size={14} className="text-[#111111]" /> }
          ];
      setNotifications(mockNotifications);
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (n) => {
    setNotifications(notifications.map(notif => 
      notif.id === n.id ? { ...notif, read: true } : notif
    ));
    // Logical routing could go here
    setShowNotifications(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] h-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-[#111111]" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-[#111111] hidden sm:block">Arrythmia</span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
            >
              Home
            </NavLink>
            
            {user && (
              <NavLink 
                to={user.role === 'doctor' ? '/doctor' : '/dashboard'} 
                className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
              >
                Dashboard
              </NavLink>
            )}

            <NavLink 
              to="/about" 
              className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
            >
              About Us
            </NavLink>

            <NavLink 
              to="/contact" 
              className={({ isActive }) => `text-[13px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
            >
              Contact Us
            </NavLink>
          </div>

          {/* Right: Auth & Account */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 transition-all rounded-xl relative ${showNotifications ? 'bg-[#F3F4F6] text-[#111111]' : 'text-[#6B7280] hover:text-[#111111]'}`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#111111] text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-4 w-80 bg-white border border-[#E5E7EB] shadow-2xl rounded-3xl overflow-hidden z-[70]"
                      >
                        <div className="p-5 border-b border-[#F3F4F6] flex items-center justify-between bg-white">
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]">Clinical Alerts</h3>
                          <div className="flex gap-3">
                            <button onClick={markAllAsRead} className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#111111] transition-colors">Read All</button>
                            <button onClick={clearNotifications} className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Clear</button>
                          </div>
                        </div>

                        <div className="max-h-[360px] overflow-y-auto scrollbar-hide">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <button 
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`w-full text-left p-5 border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-all relative flex items-start gap-4 ${!n.read ? 'bg-[#F9FAFB]/50' : ''}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'critical' ? 'bg-red-50' : 'bg-[#F3F4F6]'}`}>
                                  {n.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-bold text-[#111111]">{n.title}</span>
                                    <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-tighter flex items-center gap-1">
                                      <Clock size={10} /> {n.time}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2">{n.message}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-1.5 h-1.5 bg-[#111111] rounded-full absolute right-5 top-1/2 -translate-y-1/2"></div>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="p-12 text-center">
                              <div className="w-12 h-12 bg-[#F3F4F6] text-[#D1D5DB] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={24} />
                              </div>
                              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">No Active Alerts</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] text-center">
                          <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest opacity-50">Monitoring Real-time Telemetry</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative group flex items-center h-20">
                  <button className="flex items-center gap-3 py-2 pl-2 pr-4 hover:bg-[#F3F4F6] rounded-2xl transition-all">
                    <div className="w-9 h-9 bg-[#111111] text-white flex items-center justify-center rounded-xl text-xs font-bold tracking-tighter shadow-lg shadow-black/10 overflow-hidden">
                      {user?.profile_image ? (
                        <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#111111] hidden lg:block">Account</span>
                    <ChevronDown size={14} className="text-[#6B7280] transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full pt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[60]">
                    <div className="bg-white border border-[#E5E7EB] shadow-2xl py-2 rounded-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#F3F4F6]">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">{user.role}</p>
                        <p className="text-[13px] font-bold text-[#111111] truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#111111] hover:bg-[#F3F4F6] transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 transition-colors border-t border-[#F3F4F6] mt-1 font-medium"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[13px] font-bold text-[#111111] hover:text-[#6B7280] transition-colors px-4 py-2.5">Login</Link>
                <Link to="/register" className="bg-[#111111] text-[#FFFFFF] px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#333333] transition-all shadow-lg shadow-black/10">Get Started</Link>
              </div>
            )}
            
            <button className="md:hidden p-2 text-[#111111]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

