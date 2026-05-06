import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ChevronRight, ArrowRight } from 'lucide-react';

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
    }, 1200);
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Editorial Header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[9px] uppercase tracking-widest mb-5">
          <span className="w-5 h-[1px] bg-[#E5E7EB]"></span>
          Reach out
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-[#111111] leading-[0.9] tracking-tighter mb-8">
          Get in <br />
          <span className="text-[#6B7280]">Touch.</span>
        </h1>
        <p className="text-lg text-[#6B7280] max-w-xl leading-relaxed font-medium">
          Have questions about our clinical methodology or need technical support? 
          Our team is ready to assist you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-5">
          <ContactCard 
            icon={<Mail />}
            label="Clinical Support"
            value="support@arrythmia.ai"
            subValue="24/7 Response Time"
          />
          <ContactCard 
            icon={<Phone />}
            label="Emergency Hotline"
            value="+91 98765 43210"
            subValue="Priority Line (India)"
          />
          <ContactCard 
            icon={<MapPin />}
            label="Headquarters"
            value="Bengaluru, India"
            subValue="Bana  Complex"
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[1.5rem] border border-[#E5E7EB] shadow-lg h-full">
            <h2 className="text-2xl font-bold text-[#111111] mb-8 tracking-tight">Send a Message</h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2.5 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-[#F3F4F6] border border-transparent py-3.5 px-5 outline-none text-[#111111] font-medium text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2.5 ml-1">Work Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@clinic.com"
                      className="w-full bg-[#F3F4F6] border border-transparent py-3.5 px-5 outline-none text-[#111111] font-medium text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2.5 ml-1">Department</label>
                  <select className="w-full bg-[#F3F4F6] border border-transparent py-3.5 px-5 outline-none text-[#111111] font-medium text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl appearance-none">
                    <option>Cardiology</option>
                    <option>Emergency Medicine</option>
                    <option>Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-2.5 ml-1">Message</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="How can we assist?"
                    className="w-full bg-[#F3F4F6] border border-transparent py-3.5 px-5 outline-none text-[#111111] font-medium text-sm focus:border-[#111111] focus:bg-white transition-all rounded-xl resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#111111] text-white w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 group hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Dispatching..." : (
                      <>Dispatch Message <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-2">
                  <Mail size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#111111]">Message Dispatched</h3>
                <p className="text-sm text-[#6B7280] max-w-sm">Our clinical support team in Mumbai has received your request and will respond within 24 hours.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-[10px] font-bold text-[#111111] uppercase tracking-widest hover:underline underline-offset-4"
                >
                  Send another message
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
  <div className="bg-[#F9FAFB] p-8 rounded-[1.25rem] border border-[#E5E7EB] hover:border-[#111111] transition-all duration-500 group">
    <div className="w-10 h-10 bg-white text-[#111111] border border-[#E5E7EB] flex items-center justify-center rounded-xl mb-6 group-hover:bg-[#111111] group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div className="mt-auto">
      <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">{label}</div>
      <div className="text-lg font-bold text-[#111111] mb-0.5 group-hover:text-[#111111] transition-colors">{value}</div>
      <div className="text-[9px] font-medium text-[#6B7280]">{subValue}</div>
    </div>
  </div>
);

export default Contact;
