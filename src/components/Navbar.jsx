
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check,
  AlertCircle,
  FileText,
  ShieldCheck,
  Clock,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const mockNotifications =
      user.role === 'doctor'
        ? [
            {
              id: 1,
              type: 'critical',
              title: 'Critical Evaluation',
              message:
                'Patient John Doe shows Arrhythmia. Immediate review needed.',
              time: '2m ago',
              read: false,
              icon: <AlertCircle size={14} className="text-red-500" />,
            },
            {
              id: 2,
              type: 'registration',
              title: 'New Registry',
              message:
                'Sarah Jenkins has self-registered via the patient portal.',
              time: '1h ago',
              read: false,
              icon: <User size={14} className="text-[#111111]" />,
            },
            {
              id: 3,
              type: 'system',
              title: 'System Precision',
              message:
                'Neural Engine updated to v4.2: Accuracy increased by 1.2%.',
              time: '5h ago',
              read: true,
              icon: <ShieldCheck size={14} className="text-[#111111]" />,
            },
          ]
        : [
            {
              id: 1,
              type: 'report',
              title: 'Diagnostic Report',
              message:
                'Your AI Heart Analysis is now available for download.',
              time: '10m ago',
              read: false,
              icon: <FileText size={14} className="text-[#111111]" />,
            },
            {
              id: 2,
              type: 'profile',
              title: 'Profile Updated',
              message:
                'Your medical profile has been successfully synchronized.',
              time: '3h ago',
              read: true,
              icon: <Check size={14} className="text-[#111111]" />,
            },
          ];

    setNotifications(mockNotifications);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    setShowNotifications(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
      isActive
        ? 'text-[#14B8A6]'
        : 'text-slate-500 hover:text-[#14B8A6]'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] h-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Activity
                className="w-8 h-8 text-[#14B8A6] group-hover:scale-110 transition-transform duration-500"
                strokeWidth={2.5}
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#14B8A6]/20 rounded-full blur-md -z-10"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A] hidden sm:block">
              Arrhythmia<span className="text-[#14B8A6]">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#14B8A6] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>

            {user && (
              <NavLink
                to={user.role === 'doctor' ? '/doctor' : '/dashboard'}
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    Dashboard
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#14B8A6] rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            )}

            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  About Us
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#14B8A6] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  Contact Us
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#14B8A6] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() =>
                      setShowNotifications(!showNotifications)
                    }
                    className="p-2 rounded-xl relative text-[#6B7280] hover:text-[#111111] hover:bg-[#F3F4F6]"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-[#111111] text-white text-[9px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 w-80 bg-white border border-[#E5E7EB] rounded-3xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b flex justify-between items-center">
                          <h3 className="text-xs font-bold uppercase">
                            Clinical Alerts
                          </h3>
                          <div className="flex gap-2 text-[10px] font-bold">
                            <button onClick={markAllAsRead}>
                              Read All
                            </button>
                            <button
                              onClick={clearNotifications}
                              className="text-red-500"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length ? (
                            notifications.map((n) => (
                              <button
                                key={n.id}
                                onClick={() =>
                                  handleNotificationClick(n)
                                }
                                className="w-full p-4 flex gap-3 text-left border-b hover:bg-gray-50"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                  {n.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm">
                                      {n.title}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <Clock size={10} />
                                      {n.time}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {n.message}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-8 text-center text-gray-400">
                              No Active Alerts
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative group">
                  <button className="flex items-center gap-3 py-2 px-3 rounded-2xl hover:bg-[#F3F4F6]">
                    <div className="w-9 h-9 bg-[#111111] text-white rounded-xl flex items-center justify-center text-xs font-bold overflow-hidden">
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <span className="hidden lg:block font-bold text-sm">
                      Account
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-4 py-3 border-b">
                      <p className="text-xs uppercase text-gray-500 font-bold">
                        {user.role}
                      </p>
                      <p className="text-sm font-semibold truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#4B5563] hover:text-[#14B8A6] hover:bg-teal-50 transition-all duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ y: -1, shadow: "0 10px 25px -5px rgba(20,184,166,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-[#14B8A6] text-white shadow-[0_10px_20px_-5px_rgba(20,184,166,0.3)] hover:bg-[#0D9488] transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

