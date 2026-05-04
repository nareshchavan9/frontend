import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Activity, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-healthcare-blue/10 text-healthcare-blue rounded-full mb-6">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">AI-POWERED HEART HEALTH</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-['Outfit'] font-bold text-healthcare-dark leading-tight mb-8">
              Detect Arrhythmia with <span className="gradient-text">AI Precision</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Upload your ECG images and get instant, accurate classifications powered by deep learning. A professional tool for patients and healthcare providers.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Start Detection <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-healthcare-blue/20 blur-[100px] rounded-full"></div>
            <div className="glass-card p-4 relative z-10 animate-float">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop" 
                alt="ECG Analysis" 
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 glass-card p-6 flex items-center gap-4 border-l-4 border-l-healthcare-blue">
                <div className="bg-healthcare-blue/10 p-3 rounded-full text-healthcare-blue">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-2xl font-bold">98.5%</div>
                  <div className="text-sm text-slate-500">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ArrythmiaDetector?</h2>
            <p className="text-slate-500 text-lg">Harnessing advanced technology for better healthcare outcomes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Instant Results"
              description="Get your ECG classification in seconds with our optimized deep learning model."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Private"
              description="Your data is encrypted and handled with the highest healthcare security standards."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Role-Based Access"
              description="Tailored dashboards for patients, doctors, and administrators."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-3xl bg-healthcare-light border border-slate-100 hover:shadow-xl transition-all duration-300 group">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-healthcare-blue mb-6 shadow-sm group-hover:bg-healthcare-blue group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default Home;
