import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, BrainCircuit, Globe, Award, ChevronRight } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-28 pb-20 px-6 lg:px-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-5">
            <span className="w-6 h-[1px] bg-teal-100"></span>
            Scientific Narrative
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-[-0.03em] mb-8">
            Pioneering <br />
            Cardiac <br />
            <span className="text-[#14B8A6] relative">
              Intelligence
              <div className="absolute -bottom-1.5 left-0 w-16 h-1 bg-teal-100 rounded-full" />
            </span>.
          </h1>
          <p className="text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
            Merging high-fidelity neural classification with clinical expertise to redefine cardiac diagnostic benchmarks.
          </p>
        </motion.div>

        {/* Narrative Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-[#1A1A1A] tracking-tight leading-tight">Closing the <br /> Diagnostic Gap.</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-10 font-medium max-w-lg">
              Cardiovascular pathologies often remain silent due to limited access to specialized telemetry. Our mission is to democratize precision ECG analysis through neural architectures.
            </p>
            <div className="space-y-6">
              <MissionItem icon={<ShieldCheck className="text-[#14B8A6]" />} title="Clinical Reliability" text="Benchmarked against MIT-BIH clinical databases." />
              <MissionItem icon={<Zap className="text-teal-500" />} title="Instant Informatics" text="Diagnostic report generation in under 2 seconds." />
              <MissionItem icon={<Globe className="text-sky-500" />} title="Enterprise Sync" text="HIPAA-compliant, cloud-native telemetry synchronization." />
            </div>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop" 
                alt="Healthcare Technology" 
                className="w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
            </motion.div>
            {/* Background Decorative element */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal-50 rounded-full blur-3xl -z-10 animate-pulse" />
          </div>
        </div>

        {/* Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard 
            icon={<BrainCircuit />} 
            title="DCNN Architecture" 
            description="Deep Convolutional Neural Networks optimized for cardiac classification."
          />
          <InfoCard 
            icon={<Activity />} 
            title="Classification Precision" 
            description="Maintaining a verified 98.5% accuracy rate across major categories."
          />
          <InfoCard 
            icon={<Award />} 
            title="Clinical Integrity" 
            description="End-to-end medical data encryption meeting global standards."
          />
        </div>
      </div>
    </div>
  );
};

const MissionItem = ({ icon, title, text }) => (
  <div className="flex gap-5 items-start group">
    <div className="w-12 h-12 bg-slate-50 text-[#1A1A1A] flex items-center justify-center rounded-xl flex-shrink-0 group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <div className="font-bold text-[#1A1A1A] text-base mb-0.5">{title}</div>
      <p className="text-slate-500 text-xs leading-relaxed font-medium">{text}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, description }) => (
  <div className="premium-card group cursor-default p-6">
    <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <h3 className="text-lg font-bold mb-3 text-[#1A1A1A] tracking-tight">{title}</h3>
    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-8">{description}</p>
    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] group-hover:text-[#14B8A6] transition-colors">
      Clinical Protocol V4.2 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default About;
