import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, MessageSquare, Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-healthcare-blue p-2 rounded-xl">
                <Heart className="text-white w-6 h-6 fill-white" />
              </div>
              <span className="text-2xl font-['Outfit'] font-bold text-white">
                Arrythmia<span className="text-healthcare-blue">Detector</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Revolutionizing cardiac care through advanced Artificial Intelligence. 
              Providing instant, accurate, and accessible ECG analysis for everyone, everywhere.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Globe size={20} />} href="#" />
              <SocialLink icon={<MessageSquare size={20} />} href="#" />
              <SocialLink icon={<Share2 size={20} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-healthcare-blue transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-healthcare-blue transition-colors">About Us</Link></li>
              <li><Link to="/register" className="hover:text-healthcare-blue transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-healthcare-blue transition-colors">Patient Portal</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-healthcare-blue transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-healthcare-blue transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-healthcare-blue transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-healthcare-blue transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-healthcare-blue shrink-0" />
                <span>123 Medical Drive, Innovation Hub, Tech City, 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-healthcare-blue shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-healthcare-blue shrink-0" />
                <span>support@arrythmiadetect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ArrythmiaDetector AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-healthcare-blue hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
