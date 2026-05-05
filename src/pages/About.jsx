import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, BrainCircuit, Globe, Award, ChevronRight } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-[1280px] mx-auto min-h-screen bg-[#F5F5F5]">
      {/* Editorial Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[9px] uppercase tracking-widest mb-5">
          <span className="w-5 h-[1px] bg-[#E5E7EB]"></span>
          Scientific Narrative
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-[#111111] leading-[0.95] tracking-tighter mb-8">
          Pioneering <br />
          Cardiac <br />
          <span className="text-[#6B7280]">Intelligence.</span>
        </h1>
        <p className="text-lg text-[#6B7280] max-w-2xl leading-relaxed font-medium">
          Combining cutting-edge artificial intelligence with clinical expertise to provide accessible heart health monitoring.
        </p>
      </motion.div>

      {/* Narrative Section */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-[#111111] tracking-tight leading-none">Diagnostic Gap.</h2>
          <p className="text-[#6B7280] text-base leading-relaxed mb-10 font-medium max-w-lg">
            Many conditions go undetected because access to high-fidelity ECG analysis is limited by cost and clinical availability. We are solving this through neural-based classification.
          </p>
          <div className="space-y-6">
            <MissionItem icon={<ShieldCheck />} title="Clinical Reliability" text="Trained on the MIT-BIH clinical databases." />
            <MissionItem icon={<Zap />} title="Instant Informatics" text="Reducing report time to less than 2 seconds." />
            <MissionItem icon={<Globe />} title="Universal Access" text="Cloud-native infrastructure for any device." />
          </div>
        </motion.div>
        
        <div className="relative flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[1.5rem] overflow-hidden border border-[#E5E7EB] shadow-lg bg-white p-2.5 max-w-md"
          >
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop" 
              alt="Healthcare Technology" 
              className="w-full grayscale-[0.4] hover:grayscale-0 transition-all duration-1000 rounded-[1.25rem]"
            />
          </motion.div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard 
          icon={<BrainCircuit />} 
          title="Architecture" 
          description="Deep Convolutional Neural Networks for multi-class arrhythmia classification."
        />
        <InfoCard 
          icon={<Activity />} 
          title="Precision" 
          description="Maintaining a 98.5% accuracy rate across major cardiac categories."
        />
        <InfoCard 
          icon={<Award />} 
          title="Security" 
          description="Built with HIPAA-compliant data handling and end-to-end encryption."
        />
      </div>
    </div>
  );
};

const MissionItem = ({ icon, title, text }) => (
  <div className="flex gap-4 items-start group">
    <div className="w-10 h-10 bg-white text-[#111111] border border-[#E5E7EB] flex items-center justify-center rounded-xl flex-shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-all shadow-sm">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <div className="font-bold text-[#111111] text-base mb-0.5">{title}</div>
      <p className="text-[#6B7280] text-xs leading-relaxed font-medium">{text}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, description }) => (
  <div className="bg-white p-7 rounded-[1.25rem] border border-[#E5E7EB] hover:border-[#111111] transition-all duration-300 group">
    <div className="w-10 h-10 bg-[#F3F4F6] text-[#111111] flex items-center justify-center rounded-lg mb-6 group-hover:bg-[#111111] group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <h3 className="text-lg font-bold mb-3 text-[#111111] tracking-tight">{title}</h3>
    <p className="text-[#6B7280] text-xs leading-relaxed font-medium mb-6">{description}</p>
    <div className="flex items-center gap-2 text-[8px] font-bold text-[#6B7280] uppercase tracking-widest group-hover:text-[#111111] transition-colors">
      Protocol V4.2 <ChevronRight size={12} />
    </div>
  </div>
);

export default About;
