import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Editorial Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-5">
          <span className="w-8 h-[1px] bg-teal-100"></span>
          Clinical Inquiry
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-[1.1] tracking-[-0.03em] mb-6">
          Connect with <br />
          <span className="text-[#14B8A6]">Intelligence.</span>
        </h1>
        <p className="text-base text-slate-500 max-w-xl leading-relaxed font-medium">
          Have questions about our neural diagnostic models or clinical integration? 
          Our specialized support team is available for technical and medical inquiries.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-4">
          <ContactCard 
            icon={<Mail className="text-[#14B8A6]" />}
            label="Support Desk"
            value="clinical@heartsync.ai"
            subValue="Average Response: 2 Hours"
          />
          <ContactCard 
            icon={<Phone className="text-sky-500" />}
            label="Emergency Support"
            value="+91 98765 43210"
            subValue="24/7 Priority Line"
          />
          <ContactCard 
            icon={<MapPin className="text-teal-500" />}
            label="Diagnostic Hub"
            value="Bengaluru, KA"
            subValue="Innovation District, V4.2"
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="premium-card h-full bg-white">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 tracking-tight">Transmission Portal</h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Identity Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      className="input-premium w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Clinical Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@clinical.com"
                      className="input-premium w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Department Inquiry</label>
                  <select className="input-premium w-full appearance-none pr-10">
                    <option>Technical Support</option>
                    <option>Diagnostic Methodology</option>
                    <option>Clinical Partnership</option>
                    <option>Data Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Message Content</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Provide details regarding your inquiry..."
                    className="input-premium w-full resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-premium-teal w-full py-4 text-[11px] uppercase tracking-[0.4em] shadow-xl active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
                    ) : (
                      <>Initialize Transmission <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-teal-50 text-[#14B8A6] rounded-3xl flex items-center justify-center mb-2 animate-pulse shadow-inner">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Transmission Successful</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">Your data has been synchronized with our support infrastructure. A specialist will contact you shortly.</p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn-outline-premium px-8 py-3 text-[10px] uppercase tracking-[0.2em]"
                >
                  New Transmission
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, label, value, subValue }) => (
  <div className="premium-card group cursor-default p-6 bg-white">
    <div className="w-12 h-12 bg-slate-50 text-[#1A1A1A] flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-transparent">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="mt-auto">
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</div>
      <div className="text-lg font-bold text-[#1A1A1A] mb-1 group-hover:text-[#14B8A6] transition-colors">{value}</div>
      <div className="text-[9px] font-medium text-slate-400 uppercase tracking-widest opacity-80">{subValue}</div>
    </div>
  </div>
);

export default Contact;
