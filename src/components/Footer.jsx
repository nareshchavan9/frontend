import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Activity, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Social Icons */}
        <div className="flex gap-4 mb-10">
          <SocialIcon icon={<Globe size={14} />} href="#" />
          <SocialIcon icon={<Share2 size={14} />} href="#" />
          <SocialIcon icon={<Activity size={14} />} href="#" />
          <SocialIcon icon={<MessageSquare size={14} />} href="#" />
        </div>

        {/* Primary Nav */}
        <div className="flex flex-wrap justify-center gap-10 mb-8">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">Home</Link>
          <Link to="/upload" className="text-sm font-black uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">Diagnostics</Link>
          <Link to="/history" className="text-sm font-black uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">History</Link>
          <Link to="/ai-assistant" className="text-sm font-black uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">Assistant</Link>
          <Link to="/about" className="text-sm font-black uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">About</Link>
        </div>

        {/* Secondary Nav */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <Link to="/mission" className="hover:text-white transition-colors">Mission</Link>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>

      {/* Bottom Green Bar */}
      <div className="bg-[#10B981] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1A1A1A] mb-2">
            Advanced Neural Diagnostics, Crafted for Clinical Excellence
          </p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
            © {new Date().getFullYear()} HeartSync Neural Systems | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
  >
    {icon}
  </a>
);

export default Footer;
