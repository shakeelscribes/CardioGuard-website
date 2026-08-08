'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Activity } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden border-b border-outline-variant">
      
      {/* Structural micro-grid lines (Left Side) */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Left Content Area (Thesis) */}
      <div className="relative w-full lg:w-1/2 flex items-center px-8 lg:px-16 xl:px-24 pt-32 pb-20 z-10 border-r border-outline-variant bg-background">
        <div className="max-w-xl">
          {/* Clinical Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-3 px-3 py-1 border border-outline-variant bg-surface mb-8 rounded-sm shadow-sm"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-on-surface-variant text-xs font-mono tracking-widest uppercase">System Active / ML-09</span>
          </motion.div>

          {/* Headline (Instrument Serif) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-6xl md:text-8xl text-on-surface leading-[0.9] mb-8"
          >
            Predictive<br />
            <span className="italic text-primary">Cardiology.</span>
          </motion.h1>

          {/* Subheadline (Inter) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-on-surface-variant text-lg md:text-xl leading-relaxed mb-10 max-w-md font-sans"
          >
            CardioGuard processes your physiological data through a clinical-grade neural network to identify cardiovascular risks before they escalate.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              href="/auth?mode=signup"
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white text-sm font-medium tracking-wide uppercase transition-all hover:bg-primary-container shadow-[0_4px_14px_0_rgba(67,56,202,0.39)] hover:shadow-[0_6px_20px_rgba(67,56,202,0.23)] hover:-translate-y-0.5"
            >
              Analyze Vitals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-6 py-4 border border-outline-variant text-on-surface text-sm font-medium tracking-wide uppercase hover:bg-surface-container transition-colors"
            >
              Access Records
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-8 border-t border-outline-variant pt-8"
          >
            <div className="flex flex-col gap-1">
              <Shield className="w-5 h-5 text-on-surface-variant mb-1" />
              <span className="text-on-surface font-mono text-sm font-semibold">HIPAA</span>
              <span className="text-on-surface-variant text-xs">Compliant Storage</span>
            </div>
            <div className="flex flex-col gap-1">
              <Activity className="w-5 h-5 text-on-surface-variant mb-1" />
              <span className="text-on-surface font-mono text-sm font-semibold">95.2%</span>
              <span className="text-on-surface-variant text-xs">Model Accuracy</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side (Visual/Data Area) */}
      <div className="relative w-full lg:w-1/2 bg-surface hidden lg:flex items-center justify-center overflow-hidden">
        {/* Crisp grid lines on the right side */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(to right, rgba(67,56,202,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(67,56,202,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />
        
        {/* A minimalist animated medical scan / data viz UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-full max-w-lg p-8 bg-white border border-outline-variant shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
            <span className="font-mono text-xs text-on-surface-variant">Live Analysis Engine</span>
            <span className="font-mono text-xs text-primary font-bold">Awaiting Data...</span>
          </div>

          {/* Synthetic EKG representation */}
          <div className="h-32 w-full relative mb-8">
            {/* Base line */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-outline-variant" />
            
            {/* Animated EKG line */}
            <motion.svg viewBox="0 0 400 100" className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
              <motion.path
                d="M 0,50 L 50,50 L 60,30 L 70,70 L 80,10 L 90,90 L 100,50 L 250,50 L 260,30 L 270,70 L 280,10 L 290,90 L 300,50 L 400,50"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="square"
                initial={{ pathLength: 0, opacity: 0.5 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.svg>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-outline-variant pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">BPM</div>
              <div className="font-mono text-lg text-on-surface">--</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">SYS/DIA</div>
              <div className="font-mono text-lg text-on-surface">---/--</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Chol</div>
              <div className="font-mono text-lg text-on-surface">---</div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
