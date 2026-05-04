import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, Zap, BrainCircuit, Globe, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl lg:text-6xl font-bold text-healthcare-dark mb-6">About the Project</h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto">
          Combining cutting-edge artificial intelligence with clinical expertise to provide accessible heart health monitoring for everyone, everywhere.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            Arrhythmias are often silent and hard to detect without specialized equipment. Our mission is to bridge this gap by providing a digital platform that can classify ECG patterns with hospital-grade accuracy.
          </p>
          <div className="space-y-4">
            <MissionItem icon={<ShieldCheck className="text-green-500" />} text="Providing reliable AI classifications verified by medical data." />
            <MissionItem icon={<Zap className="text-yellow-500" />} text="Reducing diagnosis time from days to seconds." />
            <MissionItem icon={<Globe className="text-blue-500" />} text="Making heart health monitoring accessible globally." />
          </div>
        </div>
        <div className="glass-card p-2 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop" 
            alt="Healthcare Technology" 
            className="rounded-2xl w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoCard 
          icon={<BrainCircuit />} 
          title="Advanced AI" 
          description="Powered by Convolutional Neural Networks trained on thousands of validated ECG records."
        />
        <InfoCard 
          icon={<HeartPulse />} 
          title="Clinical Accuracy" 
          description="Our models achieve over 98% accuracy in identifying major arrhythmia types."
        />
        <InfoCard 
          icon={<Award />} 
          title="Research Driven" 
          description="Developed using state-of-the-art medical research and machine learning techniques."
        />
      </div>
    </div>
  );
};

const MissionItem = ({ icon, text }) => (
  <div className="flex gap-4 items-center">
    <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    <span className="text-slate-700 font-medium">{text}</span>
  </div>
);

const InfoCard = ({ icon, title, description }) => (
  <div className="glass-card p-8 hover:bg-healthcare-blue hover:text-white transition-all duration-300 group">
    <div className="w-14 h-14 bg-healthcare-blue/10 rounded-xl flex items-center justify-center text-healthcare-blue mb-6 group-hover:bg-white/20 group-hover:text-white">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 group-hover:text-blue-50 leading-relaxed">{description}</p>
  </div>
);

export default About;
