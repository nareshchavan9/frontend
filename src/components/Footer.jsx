import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Activity, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-12 font-sans border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center">
        
        {/* Logo in Footer */}
        <div className="flex items-center gap-3 mb-6 opacity-80">
          <Activity className="text-[#14B8A6]" size={28} />
          <span className="text-xl font-bold tracking-tight">Arrythmia<span className="text-[#14B8A6]">.</span></span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 mb-8">
          <SocialIcon icon={<Globe size={18} />} href="#" />
          <SocialIcon icon={<Share2 size={18} />} href="#" />
          <SocialIcon icon={<Activity size={18} />} href="#" />
          <SocialIcon icon={<MessageSquare size={18} />} href="#" />
        </div>

        {/* Primary Nav */}
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#14B8A6] transition-colors">Home</Link>
          <Link to="/upload" className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#14B8A6] transition-colors">Diagnostics</Link>
          <Link to="/history" className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#14B8A6] transition-colors">History</Link>
          <Link to="/ai-assistant" className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#14B8A6] transition-colors">Assistant</Link>
          <Link to="/about" className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#14B8A6] transition-colors">About</Link>
        </div>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-white/10 mb-6"></div>

        {/* Secondary Nav */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="bg-[#14B8A6] py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 50 Q 25 40, 50 50 T 100 50" fill="none" stroke="black" strokeWidth="0.5" />
           </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A] mb-3">
            Advanced Neural Diagnostics, Crafted for Clinical Excellence
          </p>
          <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50">
            <span>© {new Date().getFullYear()} HeartSync Neural Systems</span>
            <span className="w-1 h-1 bg-black/20 rounded-full"></span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#14B8A6] hover:text-[#1A1A1A] hover:shadow-[0_10px_20px_rgba(20,184,166,0.3)] hover:-translate-y-1 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
