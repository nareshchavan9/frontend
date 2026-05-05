import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Activity, Users, ArrowRight, TrendingUp, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-20 overflow-hidden bg-[#F5F5F5]">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-10 py-10 lg:py-16 min-h-[70vh] flex items-center">
        <div className="max-w-[1280px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 text-[#6B7280] font-bold text-[9px] uppercase tracking-widest mb-5">
              <span className="w-5 h-[1px] bg-[#E5E7EB]"></span>
              Next-Gen Medical Intelligence
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-[#111111] leading-[1] mb-6 tracking-tighter">
              Precision <br />
              Arrhythmia <br />
              <span className="text-[#6B7280]">Portal.</span>
            </h1>
            
            <p className="text-base text-[#6B7280] mb-8 max-w-sm leading-relaxed font-medium">
              Advanced neural classification system designed for clinical professionals. 
              Empowering healthcare with accurate, real-time heart health intelligence.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-[#111111] text-white px-7 py-3 rounded-xl font-bold text-[13px] transition-all hover:bg-black flex items-center gap-3 group">
                Enter Portal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="border border-[#111111] text-[#111111] px-7 py-3 rounded-xl font-bold text-[13px] transition-all hover:bg-slate-50">
                Methodology
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#111111]">98.5%</span>
                <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest">Accuracy</span>
              </div>
              <div className="w-[1px] h-6 bg-[#E5E7EB]"></div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#111111]">2k+</span>
                <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest">Specialists</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="rounded-[1.5rem] overflow-hidden border border-[#E5E7EB] shadow-lg bg-white p-2.5 max-w-sm">
                <img 
                  src="/assets/images/modern_healthcare_hero.png" 
                  alt="Clinical AI Analysis" 
                  className="w-full h-auto object-cover rounded-[1.25rem] grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              {/* Floating Element - Repositioned to Top-Right for better alignment as per 'above image' request */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-[#111111] p-5 rounded-[1.25rem] text-white shadow-xl hidden xl:block border border-white/10 z-20"
              >
                <Activity className="text-[#E8A26A] mb-2" size={20} />
                <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Status</div>
                <div className="text-base font-bold">Neural Active</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-10 bg-white">
        <div className="max-w-[1140px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 mb-12 items-end">
            <div>
              <div className="text-[#E8A26A] font-bold text-[9px] uppercase tracking-widest mb-3">Capabilities</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight leading-none">Clinical Excellence.</h2>
            </div>
            <p className="text-base text-[#6B7280] max-w-sm leading-relaxed">
              State-of-the-art AI combined with intuitive medical workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 pb-20">
            <FeatureCard 
              icon={<Zap />}
              title="Neural Analysis"
              description="Keras models provide classification results in under 2 seconds."
            />
            <FeatureCard 
              icon={<Shield />}
              title="Enterprise Grade"
              description="Bank-grade encryption and HIPAA-compliant data handling."
            />
            <FeatureCard 
              icon={<Users />}
              title="Collaborative"
              description="Seamless data sharing between patients and physicians."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#F9FAFB] p-6 rounded-[1.25rem] border border-[#E5E7EB] hover:border-[#111111] transition-all duration-300 group">
    <div className="w-10 h-10 bg-white text-[#111111] flex items-center justify-center rounded-lg mb-6 border border-[#E5E7EB] group-hover:bg-[#111111] group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <h3 className="text-lg font-bold mb-2 text-[#111111] tracking-tight">{title}</h3>
    <p className="text-[#6B7280] text-xs leading-relaxed font-medium mb-6">{description}</p>
    <div className="flex items-center gap-2 text-[8px] font-bold text-[#6B7280] uppercase tracking-widest group-hover:text-[#111111] transition-colors">
      Details <ChevronRight size={12} />
    </div>
  </div>
);

export default Home;
