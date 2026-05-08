import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Activity, 
  Users, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  MessageSquare, 
  Calendar, 
  FileText, 
  ChevronDown, 
  Download, 
  CheckCircle2, 
  Star,
  Play,
  ArrowUpRight,
  PhoneCall,
  Plus,
  ArrowLeft
} from 'lucide-react';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="pt-20 overflow-hidden bg-[#F8FAFC] font-['Inter']">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-6 lg:px-10 py-12 lg:py-20 min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1440px] pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[70%] bg-[#14B8A6]/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[70%] bg-blue-500/5 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-teal-200/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1280px] mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm mb-8"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="doctor" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">Trusted by 500+ Medical Institutions</span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-[#1A1A1A] leading-[1.05] mb-8 tracking-tighter">
              AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">Healthcare</span> for Better Heart Monitoring.
            </h1>
            
            <p className="text-base text-slate-500 mb-8 max-w-sm leading-relaxed font-medium">
              Next-gen cardiac diagnostics with 98.5% neural precision in seconds.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Link 
                to="/register" 
                className="px-10 py-4.5 bg-[#14B8A6]  text-[#14B8A6] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#1d4ed8] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center gap-3 group shadow-2xl"
              >
                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/upload" className="btn-outline-premium px-10 py-4.5 rounded-2xl border-slate-200 hover:border-[#14B8A6] flex items-center gap-3 group">
                <Activity size={18} className="text-[#14B8A6]" /> Upload ECG
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-10">
              <Link to="/contact" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Need help?</p>
                  <p className="text-xs font-bold text-[#1A1A1A]">Book Consultation</p>
                </div>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="relative"
          >
            {/* Dashboard Mockup Preview */}
            <div className="relative z-20 max-w-[480px] ml-auto">
              <div className="bg-white rounded-[2.5rem] p-3 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden group">
                 <div className="rounded-[2rem] overflow-hidden aspect-video bg-slate-50 relative">
                   <img 
                     src="/assets/images/dashboard_preview.png" 
                     alt="AI Medical Dashboard" 
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent" />
                   
                   {/* Overlay Analysis UI */}
                   <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl">
                         <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Neural Prediction</p>
                         <h4 className="text-xl font-bold text-white">Normal Sinus Rhythm</h4>
                      </div>
                      <div className="bg-[#14B8A6] text-white p-4 rounded-2xl shadow-xl">
                         <TrendingUp size={24} />
                      </div>
                   </div>
                 </div>
              </div>

              {/* Floating Stat Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white p-5 rounded-[1.5rem] shadow-2xl border border-slate-50 z-30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center">
                    <Activity size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current HR</p>
                    <p className="text-xl font-black text-[#1A1A1A]">72 BPM</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-[#1A1A1A] p-5 rounded-[1.5rem] shadow-2xl z-30 text-white border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#14B8A6]/20 text-[#14B8A6] rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Status</p>
                    <p className="text-sm font-bold text-white">HIPAA Secure</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Background Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-slate-50 rounded-full -z-10 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-32 px-6 lg:px-10 relative bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#2563EB] rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Core Capabilities
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tighter mb-6">Advanced Tools for Modern Cardiology</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              We provide a comprehensive suite of AI-driven diagnostic tools designed for clinical precision and high-speed telemetry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap />}
              title="Arrhythmia Detection"
              description="Real-time rhythm classification including AFib and PVC."
              color="blue"
            />
            <FeatureCard 
              icon={<Activity />}
              title="ECG Analysis"
              description="Instant neural mapping of clinical ECG strips."
              color="teal"
            />
            <FeatureCard 
              icon={<MessageSquare />}
              title="AI Assistant"
              description="Interactive diagnostic support via medical LLMs."
              color="sky"
            />
            <FeatureCard 
              icon={<Calendar />}
              title="Easy Booking"
              description="Schedule specialist consultations in clicks."
              color="indigo"
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title="Secure Records"
              description="HIPAA-compliant encrypted data residency."
              color="teal"
            />
            <FeatureCard 
              icon={<Users />}
              title="Doctor Consult"
              description="HD video care with synced data sharing."
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-32 px-6 lg:px-10 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div>
               <h2 className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tighter mb-12 leading-[1.1]">The Precision Diagnostic Workflow in <span className="text-[#14B8A6]">3 Steps</span>.</h2>
               <div className="space-y-12">
                 <StepItem 
                   number="01" 
                   title="Upload Data" 
                   desc="Import ECG strips or wearable telemetry." 
                 />
                 <StepItem 
                   number="02" 
                   title="Neural Analysis" 
                   desc="AI maps points to identify rhythm patterns." 
                 />
                 <StepItem 
                   number="03" 
                   title="Get Results" 
                   desc="Receive detailed reports and recommendations." 
                 />
               </div>
             </div>
             
             <div className="relative">
                <div className="bg-[#1A1A1A] rounded-[3rem] p-10 text-white shadow-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6]/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                   <div className="flex items-center gap-4 mb-10">
                     <div className="w-10 h-10 bg-[#14B8A6] rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Neural Lab v4.2</p>
                   </div>
                   <div className="space-y-6 mb-12">
                     <div className="h-2 bg-white/5 rounded-full w-full relative overflow-hidden">
                       <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} className="absolute inset-0 bg-[#14B8A6]" />
                     </div>
                     <div className="h-2 bg-white/5 rounded-full w-3/4 relative overflow-hidden">
                       <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2 }} className="absolute inset-0 bg-[#14B8A6]" />
                     </div>
                     <div className="h-2 bg-white/5 rounded-full w-1/2 relative overflow-hidden">
                       <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4 }} className="absolute inset-0 bg-blue-500" />
                     </div>
                   </div>
                   <h4 className="text-2xl font-bold mb-4">Real-time Telemetry Synchronization</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">Experience zero-latency classification as our cloud-native architecture scales to your diagnostic needs.</p>
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Explore Processing Engine</button>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 4. TRUST INDICATORS */}
      <section className="py-32 px-6 lg:px-10 bg-white border-y border-slate-50">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-4 gap-12 text-center">
          <TrustStat icon={<ShieldCheck className="text-[#14B8A6]" />} value="HIPAA" label="Data Security" />
          <TrustStat icon={<Activity className="text-blue-500" />} value="98.5%" label="Detection Accuracy" />
          <TrustStat icon={<Users className="text-indigo-500" />} value="500+" label="Certified Doctors" />
          <TrustStat icon={<Star className="text-orange-400" />} value="4.9/5" label="Patient Satisfaction" />
        </div>
      </section>

      {/* 5. DASHBOARD PREVIEW */}
      <section className="py-20 px-6 lg:px-10 bg-[#1A1A1A] relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#2563EB]/5 blur-[120px] pointer-events-none" />
         <div className="max-w-[1280px] mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-4">Seamless Clinical Operations</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto font-medium">Intuitive dashboards for patients and providers.</p>
         </div>
         
         <div className="max-w-[440px] mx-auto px-6">
            <div className="relative group cursor-zoom-in">
               <motion.div 
                 initial={{ opacity: 0, y: 30 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }}
                 className="bg-[#2A2A2A] rounded-[2rem] p-6 lg:p-10 border border-white/5 shadow-3xl overflow-hidden"
               >
                 <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-400/20 rounded-full" />
                    <div className="w-3 h-3 bg-orange-400/20 rounded-full" />
                    <div className="w-3 h-3 bg-teal-400/20 rounded-full" />
                 </div>
                 <img 
                   src="/assets/images/dashboard_preview.png" 
                   alt="Software Interface" 
                   className="w-full h-auto rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity"
                 />
               </motion.div>
               {/* Hover Label */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <div className="bg-[#14B8A6] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl">
                    View Prototype
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-32 px-6 lg:px-10 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="text-[#2563EB] font-black text-[10px] uppercase tracking-[0.4em] mb-5">Patient Voices</div>
              <h2 className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tighter">Real Stories from our Global Clinical Network.</h2>
            </div>
            <div className="hidden lg:flex gap-4">
              <button className="w-14 h-14 bg-slate-50 text-[#1A1A1A] rounded-2xl flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-all"><ArrowLeft size={20} /></button>
              <button className="w-14 h-14 bg-slate-50 text-[#1A1A1A] rounded-2xl flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-all"><ArrowRight size={20} /></button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The diagnostic accuracy changed how I manage my hypertension. The reports are incredibly detailed."
              author="Sarah Jenkins"
              role="Patient since 2023"
              img="https://i.pravatar.cc/100?img=32"
            />
            <TestimonialCard 
              quote="As a cardiologist, this is the most intuitive ECG classification tool I've used in a clinical setting."
              author="Dr. Robert Carter"
              role="Lead Cardiologist"
              img="https://i.pravatar.cc/100?img=11"
            />
            <TestimonialCard 
              quote="I finally feel in control of my heart health. The AI Assistant explains everything so clearly."
              author="Michael Thompson"
              role="Marathon Runner"
              img="https://i.pravatar.cc/100?img=68"
            />
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-32 px-6 lg:px-10 bg-[#F8FAFC]">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium">Everything you need to know about our heart monitoring system.</p>
          </div>
          
          <div className="space-y-4">
            <FaqItem 
              id={1}
              active={activeFaq}
              setActive={setActiveFaq}
              q="Is my diagnostic data secure?" 
              a="Absolutely. We use end-to-end AES-256 encryption. Your data is stored on HIPAA-compliant cloud servers with multiple layers of biometric and neural security protocols."
            />
            <FaqItem 
              id={2}
              active={activeFaq}
              setActive={setActiveFaq}
              q="How accurate is the AI detection?" 
              a="Our neural engine has been trained on millions of clinical ECG samples and currently maintains a 98.5% precision index for common arrhythmias like AFib and PVC."
            />
            <FaqItem 
              id={3}
              active={activeFaq}
              setActive={setActiveFaq}
              q="Can I book a consultation immediately?" 
              a="Yes. Once your analysis is complete, you can click 'Book Consultation' to see available slots for our certified cardiologists and schedule a virtual visit."
            />
            <FaqItem 
              id={4}
              active={activeFaq}
              setActive={setActiveFaq}
              q="What is the billing process?" 
              a="We offer per-analysis credits or subscription plans for chronic monitoring. We also work with major insurance providers for clinical diagnostic coverage."
            />
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="py-24 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2563EB] z-0">
           <div className="absolute top-0 right-0 w-full h-full bg-[#14B8A6] opacity-30 mix-blend-overlay rotate-12 translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-[1280px] mx-auto relative z-10 text-center text-white">
           <h2 className="text-3xl lg:text-5xl font-black mb-8 tracking-tighter">Ready to Take Control of Your Heart Health?</h2>
           <p className="text-lg text-white/80 max-w-xl mx-auto mb-12 font-medium">Join thousands using AI to bridge the gap in cardiac diagnostics.</p>
           <div className="flex flex-wrap justify-center gap-6">
             <Link to="/register" className="px-12 py-5 bg-white text-[#2563EB] rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-[#F8FAFC] hover:scale-105 transition-all shadow-2xl">Create Account</Link>
             <Link to="/contact" className="px-12 py-5 bg-transparent border-2 border-white/30 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all">Talk to Specialist</Link>
           </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---

const FeatureCard = ({ icon, title, description, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-[#2563EB]',
    teal: 'bg-teal-50 text-[#14B8A6]',
    sky: 'bg-sky-50 text-sky-500',
    indigo: 'bg-indigo-50 text-indigo-500',
  };
  
  return (
    <div className="premium-card group p-6 hover:border-[#2563EB] transition-all">
      <div className={`w-10 h-10 ${colorMap[color]} flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <h3 className="text-lg font-bold mb-2 text-[#1A1A1A] tracking-tight">{title}</h3>
      <p className="text-slate-500 text-[12px] leading-relaxed font-medium mb-6">{description}</p>
      <div className="flex items-center gap-2 text-[8px] font-black text-[#2563EB] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
        Details <ArrowUpRight size={12} />
      </div>
    </div>
  );
};

const StepItem = ({ number, title, desc }) => (
  <div className="flex gap-8 group">
    <div className="text-4xl font-black text-slate-100 group-hover:text-[#14B8A6] transition-colors leading-none">{number}</div>
    <div>
      <h4 className="text-xl font-bold text-[#1A1A1A] mb-2">{title}</h4>
      <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">{desc}</p>
    </div>
  </div>
);

const TrustStat = ({ icon, value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm border border-slate-50">{icon}</div>
    <div className="text-3xl font-black text-[#1A1A1A] mb-1 tracking-tight">{value}</div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const TestimonialCard = ({ quote, author, role, img }) => (
  <div className="premium-card p-6 bg-[#F8FAFC]/50 hover:bg-white transition-all border-slate-50 hover:border-blue-100 group">
    <div className="flex gap-1 mb-4">
      {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-orange-400 text-orange-400" />)}
    </div>
    <p className="text-[13px] text-[#1A1A1A] font-bold leading-relaxed mb-6 tracking-tight group-hover:text-[#2563EB] transition-colors">"{quote}"</p>
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-md">
        <img src={img} alt={author} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-[11px] font-black text-[#1A1A1A]">{author}</div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{role}</div>
      </div>
    </div>
  </div>
);

const FaqItem = ({ id, q, a, active, setActive }) => {
  const isOpen = active === id;
  return (
    <div className={`bg-white rounded-[1.5rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'border-[#2563EB] shadow-2xl' : 'border-slate-100 shadow-sm'}`}>
      <button 
        onClick={() => setActive(isOpen ? null : id)}
        className="w-full px-7 py-6 flex items-center justify-between text-left"
      >
        <span className={`text-[14px] font-bold transition-colors ${isOpen ? 'text-[#2563EB]' : 'text-[#1A1A1A]'}`}>{q}</span>
        <ChevronDown size={18} className={`text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-7 pb-6"
          >
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
