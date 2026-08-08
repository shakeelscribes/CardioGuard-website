'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, ShieldCheck, HeartPulse, Stethoscope, Lock, Database, 
  Zap, Binary, Activity, ActivitySquare, AlertCircle, Scale, Droplet, 
  Smartphone, Monitor, Apple, Play 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingNav from '@/components/layout/LandingNav';
import { AnimatedCard, CardBody, CardDescription, CardTitle, CardVisual, Visual3 } from '@/components/ui/animated-card-chart';
import { VitalsMonitorCard } from '@/components/ui/vitals-monitor-card';
import { RiskGauge } from '@/components/ui/risk-gauge';
import { Marquee } from '@/components/ui/marquee';
import { TechMarquee } from '@/components/landing/TechMarquee';
import toast from 'react-hot-toast';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ML_STATS = [
  { value: "68,645", label: "Patient Records", description: "Sourced from diverse cardiovascular clinical trials for high-variance generalization.", icon: Database },
  { value: "80.17%", label: "ROC-AUC Accuracy", description: "Industry-leading Area Under Curve performance via Gradient Boosting.", icon: Activity },
  { value: "14", label: "Biometric Points", description: "Including derived metrics like Mean Arterial & Pulse Pressure.", icon: Binary },
  { value: "0.2s", label: "Real-Time Inference", description: "Instantaneous predictions powered by FastAPI and cloud edge computing.", icon: Zap }
];

const RISK_FACTORS = [
  "Systolic BP (mmHg)", "Diastolic BP (mmHg)", "Cholesterol Levels", "Glucose Levels", 
  "Body Mass Index (BMI)", "Mean Arterial Pressure", "Pulse Pressure", "Age in Years", "Physical Activity",
  "Systolic BP (mmHg)", "Diastolic BP (mmHg)", "Cholesterol Levels", "Glucose Levels", 
  "Body Mass Index (BMI)", "Mean Arterial Pressure", "Pulse Pressure", "Age in Years", "Physical Activity"
];

const PROCESS_STEPS = [
  { step: '01', title: 'Enter Your Details', desc: 'Fill in basic vitals like blood pressure, age, weight, and cholesterol level.', icon: Stethoscope },
  { step: '02', title: 'AI Analyzes Your Risk', desc: 'Our model trained on 68,000+ patient records calculates your CVD risk.', icon: ActivitySquare },
  { step: '03', title: 'Get Your Result Instantly', desc: 'Receive a Low / Medium / High risk score with actionable advice.', icon: Zap }
];

const MEASURE_CARDS = [
  { title: 'Blood Pressure', desc: 'Systolic & Diastolic readings (ap_hi & ap_lo).', icon: HeartPulse },
  { title: 'Age & BMI', desc: 'Auto-calculated from height & weight.', icon: Scale },
  { title: 'Cholesterol & Glucose', desc: 'Crucial biomarkers for plaque buildup.', icon: Droplet },
  { title: 'Lifestyle Factors', desc: 'Smoking, alcohol, and physical activity.', icon: Activity }
];

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "mailto:ahamedshakeel2205@gmail.com";
    } else {
      window.open("https://mail.google.com/mail/?view=cm&fs=1&to=ahamedshakeel2205@gmail.com", "_blank");
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hero-title-line', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
      .from('.hero-visual', { x: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');

    gsap.to('.ekg-path', { strokeDashoffset: 0, duration: 3, ease: 'linear', repeat: -1 });

    gsap.from('.vitals-dash', { scrollTrigger: { trigger: '#vitals-dashboard', start: 'top 75%', toggleActions: 'play reverse play reverse' }, y: 40, opacity: 0, duration: 0.8, ease: 'back.out(1.2)' });
    gsap.from('.process-step', { scrollTrigger: { trigger: '#how-it-works', start: 'top 75%', toggleActions: 'play reverse play reverse' }, y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)' });
    gsap.from('.risk-gauge-container', { scrollTrigger: { trigger: '#risk-levels', start: 'top 80%', toggleActions: 'play reverse play reverse' }, y: 40, scale: 0.95, opacity: 0, duration: 1, ease: 'back.out(1.2)' });
    gsap.from('.cross-platform-anim', { scrollTrigger: { trigger: '#cross-platform', start: 'top 75%', toggleActions: 'play reverse play reverse' }, x: -40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
    gsap.from('.security-box', { scrollTrigger: { trigger: '#security', start: 'top 75%', toggleActions: 'play reverse play reverse' }, scale: 0.95, opacity: 0, duration: 1, ease: 'back.out(1.2)' });
    gsap.to('.bg-parallax', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: true } });
  }, { scope: container });

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden" ref={container}>
      {/* SEO Optimized Screen Reader Text */}
      <h1 className="sr-only">
        CardioGuard - AI-Powered Cardiovascular Disease Prediction, Heart Health AI, and Clinical-Grade Risk Assessment
      </h1>
      <p className="sr-only">
        CardioGuard is a clinical-grade machine learning model designed for preventative cardiology. 
        It functions as a highly accurate heart disease risk calculator and heart attack prevention tool 
        by analyzing complex medical biometrics.
      </p>
      
      <LandingNav />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden min-h-[85vh] flex items-center">
        <div className="bg-parallax absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="bg-parallax absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 z-10">
          <div className="flex-1 text-left">
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] uppercase tracking-widest font-bold mb-8">
              <HeartPulse className="w-4 h-4 animate-pulse" /> Machine Learning Scoring Engine
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-[1.05] mb-6" aria-label="Precision Cardiovascular Intelligence">
              <div className="hero-title-line overflow-hidden" aria-hidden="true">Precision</div>
              <div className="hero-title-line overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60" aria-hidden="true">Cardiovascular</div>
              <div className="hero-title-line overflow-hidden" aria-hidden="true">Intelligence.</div>
            </h2>
            
            <p className="hero-desc text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-medium">
              Predict cardiovascular disease with industry-leading precision. A real-time inference engine trained on 68,000+ clinical records, deployed for immediate patient health assessment.
            </p>
            
            <div className="hero-cta flex flex-wrap gap-4">
              <Link href="/auth">
                <Button size="lg" className="rounded-full h-16 px-10 text-sm font-mono uppercase tracking-widest gap-3 shadow-[0_0_40px_-10px_rgba(0,93,172,0.4)] hover:shadow-[0_0_60px_-10px_rgba(0,93,172,0.6)] hover:-translate-y-1 transition-all">
                  Initialize Console <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="hero-visual flex-1 relative w-full flex justify-center lg:justify-end perspective-[1000px]">
            <div className="relative z-20 hover:-translate-y-4 transition-transform duration-700 ease-out shadow-2xl">
              <AnimatedCard>
                <CardVisual>
                  <Visual3 mainColor="#005dac" secondaryColor="#3385c6" gridColor="#005dac15" />
                </CardVisual>
                <CardBody>
                  <CardTitle>Gradient Boosting Inference</CardTitle>
                  <CardDescription>Real-time risk scoring across 14 biometric data points.</CardDescription>
                </CardBody>
              </AnimatedCard>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[600px] h-[300px] -z-10 opacity-30 pointer-events-none">
              <svg viewBox="0 0 500 150" className="w-full h-full text-primary" preserveAspectRatio="none">
                <path
                  className="ekg-path"
                  d="M0,75 L100,75 L125,75 L140,25 L160,125 L175,75 L200,75 L250,75 L275,75 L290,25 L310,125 L325,75 L500,75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Authority Banner (Moved to directly below Hero) */}
      <section className="py-8 border-y border-border bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                 <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                 <h3 className="text-lg font-heading font-bold">Clinically Validated Engine</h3>
                 <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mt-1">Processing in under 2 seconds</p>
              </div>
           </div>
           
           <div className="flex flex-wrap justify-center md:justify-end items-center gap-6">
              <div className="text-center md:text-right">
                 <div className="text-sm font-bold text-foreground">Trained on Real Data</div>
                 <div className="text-xs text-primary font-mono uppercase tracking-widest mt-1">68,000+ Records</div>
              </div>
              <div className="w-[1px] h-10 bg-border hidden md:block" />
              <div className="text-center md:text-left">
                 <div className="text-sm font-bold text-foreground">Industry Leading Accuracy</div>
                 <div className="text-xs text-emerald-500 font-mono uppercase tracking-widest flex items-center justify-center md:justify-start gap-1 mt-1">
                    <Activity className="w-3 h-3" /> 80% ROC-AUC Score
                 </div>
              </div>
           </div>
        </div>
      </section>


      {/* Live Vitals Dashboard Section */}
      <section id="vitals-dashboard" className="py-24 border-b border-border bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
           
           <div className="vitals-dash flex-1 relative order-2 lg:order-1 flex justify-center lg:justify-start perspective-[1000px]">
              <div className="relative hover:rotate-2 hover:-translate-y-4 transition-all duration-700 ease-out origin-bottom-left group">
                <VitalsMonitorCard className="scale-110 shadow-2xl relative z-20 group-hover:shadow-[0_0_60px_-15px_rgba(0,93,172,0.4)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
           </div>

           <div className="vitals-dash flex-1 order-1 lg:order-2 text-center lg:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-destructive/10 text-destructive font-mono text-[10px] uppercase font-bold mb-6">
                <AlertCircle className="w-3 h-3" /> Hypertension Tracking
             </div>
             <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Track Live Vitals & <br className="hidden md:block"/> Blood Pressure Spikes.</h2>
             <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
               Our model ingests critical metrics like <strong>Systolic Blood Pressure (ap_hi)</strong>. Watch your biometric data fluctuate over time. High variance and unexpected spikes are instantly flagged by the gradient boosting algorithm to recalculate your risk score.
             </p>
             <ul className="space-y-4 font-medium text-foreground">
               <li className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Activity className="w-3 h-3" /></div>
                 Real-time data ingestion pipeline
               </li>
               <li className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Activity className="w-3 h-3" /></div>
                 Detects irregular arterial pressure ranges
               </li>
               <li className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Activity className="w-3 h-3" /></div>
                 Flags trailing 7-day variance
               </li>
             </ul>
           </div>
        </div>
      </section>

      {/* How it Works Section (3 Steps) */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">3 simple steps to actionable intelligence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-primary/10 -translate-y-1/2 -z-10">
              <div className="w-full h-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 animate-pulse" />
            </div>

            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="process-step flex flex-col items-center text-center group relative p-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary/5 to-transparent -z-10 select-none group-hover:from-primary/10 transition-all duration-500 font-heading">
                  {step.step}
                </div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_-5px_rgba(0,93,172,0.4)] transition-all duration-500">
                  <step.icon className="w-8 h-8 text-primary group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Measure Section */}
      <section id="measures" className="py-24 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div>
               <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">What We Measure</h2>
               <p className="text-muted-foreground max-w-xl text-lg">Short, high-density data points form the backbone of our gradient boosting model.</p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {MEASURE_CARDS.map((measure, i) => (
               <div key={i} className="measure-card group p-8 rounded-[2rem] bg-gradient-to-br from-background to-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,93,172,0.3)] hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                   <measure.icon className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 relative z-10">{measure.title}</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{measure.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* ML Engine Stats Grid */}
      <section id="ml-engine" className="py-24 md:py-32 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">The Engine Behind The Intelligence</h2>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest max-w-2xl mx-auto">
              Our Gradient Boosting Classifier outperforms Logistic Regression and Random Forests by capturing complex, non-linear interactions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ML_STATS.map((stat, i) => (
              <div key={i} className="stat-card relative overflow-hidden rounded-[2rem] bg-background border border-border p-8 hover:border-primary/30 hover:shadow-[0_8px_30px_-10px_rgba(0,93,172,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-default group">
                <stat.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-5xl font-heading font-bold mb-3">{stat.value}</h3>
                <h4 className="text-lg font-bold mb-2">{stat.label}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Levels Explained */}
      <section id="risk-levels" className="py-24 md:py-32 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Risk Levels Explained</h2>
            <p className="text-muted-foreground text-lg">Understand your clinical output instantly.</p>
          </div>

          <div className="risk-gauge-container">
            <RiskGauge />
          </div>
        </div>
      </section>

      {/* Cross-Platform Section */}
      <section id="cross-platform" className="py-24 border-y border-border overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left cross-platform-anim">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Available Everywhere<br/>You Are.</h2>
            <ul className="space-y-5 mb-10 text-muted-foreground text-lg font-medium inline-block text-left">
              <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center"><ArrowRight className="w-3 h-3" /></div> Use it on the web — no download needed</li>
              <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center"><ArrowRight className="w-3 h-3" /></div> Use it on your phone — iOS & Android</li>
              <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center"><ArrowRight className="w-3 h-3" /></div> Same account, same history, zero friction</li>
            </ul>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Button onClick={() => toast.success("📱 Our mobile apps are currently in active development! Join our Slack community for early access.", { duration: 4000 })} size="lg" className="h-14 px-6 gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-[0_0_30px_-5px_rgba(0,93,172,0.6)] hover:-translate-y-1 transition-all border-none relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> 
                <span className="flex flex-col items-start leading-none"><span className="text-[10px] opacity-80 mb-0.5">Coming soon to</span>App Store</span>
              </Button>
              <Button onClick={() => toast.success("📱 Our mobile apps are currently in active development! Join our Slack community for early access.", { duration: 4000 })} size="lg" className="h-14 px-6 gap-3 rounded-xl bg-background border-2 border-primary text-primary hover:bg-primary/5 hover:-translate-y-1 transition-all relative group overflow-hidden">
                <svg viewBox="0 0 512 512" className="w-5 h-5"><path fill="#4caf50" d="M47 38.3C40 45 35 55.4 35 69.4v373.2c0 14 5 24.4 12 31.1L49 476l225.2-220V254L49 34.1z"/><path fill="#ffeb3b" d="M344.4 329.1L274.2 256l-70.2-73.1 228.1-131c15-8.7 32-5.7 44.1 2.3l48.8 35.8c6.6 4.8 11.2 11.4 13 18.9l-193.6 220.2z"/><path fill="#f44336" d="M344.4 329.1L405.3 394l94.5-54.8c15.2-8.8 23.3-23.7 23.3-40.4 0-14.7-6.2-28-16.7-36.9l-162-132.8z"/><path fill="#2196f3" d="M344.4 329.1L125 456.9c-12.7 7.4-27.3 11-41.9 10.4l191.1-138.2z"/></svg> 
                <span className="flex flex-col items-start leading-none"><span className="text-[10px] opacity-80 mb-0.5">Coming soon to</span>Google Play</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 relative flex justify-center items-center h-[450px] perspective-[1000px] w-full cross-platform-anim">
             {/* Abstract Monitor */}
             <div className="absolute right-4 md:right-12 top-0 md:top-10 w-[280px] h-[180px] bg-gradient-to-br from-background to-primary/10 border border-primary/20 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,93,172,0.2)] flex flex-col items-center justify-center text-primary -rotate-6 hover:rotate-0 transition-transform duration-500 z-10 backdrop-blur-sm">
               <Monitor className="w-16 h-16 mb-4 opacity-80" />
               <div className="font-mono text-xs tracking-widest uppercase font-bold">Web Portal</div>
             </div>
             
             {/* Abstract Smartphone */}
             <div className="absolute left-4 md:left-12 bottom-0 md:bottom-10 w-[140px] h-[280px] bg-gradient-to-tr from-background to-primary/10 border border-primary/20 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,93,172,0.3)] flex flex-col items-center justify-center text-primary rotate-12 hover:rotate-0 transition-transform duration-500 z-20 backdrop-blur-sm">
               <Smartphone className="w-16 h-16 mb-4 opacity-80" />
               <div className="font-mono text-[10px] tracking-widest uppercase font-bold">Mobile App</div>
               <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(0,93,172,0.5)]">
                  <div className="w-6 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(0,93,172,0.8)]" />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Security & Auth Section */}
      <section id="security" className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="security-box bg-gradient-to-br from-background to-primary/5 text-foreground rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,93,172,0.15)] border border-primary/20">
            
            {/* Animated Vault Rings Background */}
            <div className="absolute top-1/2 right-0 md:right-1/4 -translate-y-1/2 opacity-40 pointer-events-none">
               <div className="w-[500px] h-[500px] border border-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]" />
               <div className="w-[400px] h-[400px] border border-primary/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]" />
               <div className="w-[300px] h-[300px] border border-primary/50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]" />
               <div className="w-32 h-32 bg-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(0,93,172,0.2)]">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Clinical-Grade <br/> Data Security.</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
                    Your biometric data is encrypted at rest and in transit. Your data syncs across web and mobile automatically, protected by HIPAA-inspired isolation protocols.
                  </p>
               </div>

               <div className="flex-1 w-full max-w-sm bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 relative shadow-2xl">
                  <h3 className="text-xl font-bold mb-6 text-center">Initialize Account</h3>
                  <div className="space-y-4">
                     <Link href="/auth" className="block">
                       <Button size="lg" className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 gap-3 rounded-xl font-bold text-sm shadow-md hover:-translate-y-1 transition-transform">
                         <div className="w-5 h-5 bg-background rounded-full flex items-center justify-center p-[2px]">
                            <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                         </div>
                         Continue with Google
                       </Button>
                     </Link>
                     <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-widest font-mono font-bold">Or Email</span>
                        <div className="flex-grow border-t border-border"></div>
                     </div>
                     <Link href="/auth" className="block">
                       <Button size="lg" className="w-full h-14 bg-primary/10 text-primary hover:bg-primary/20 gap-3 rounded-xl border border-primary/20 font-bold text-sm hover:-translate-y-1 transition-transform">
                         Register Securely
                       </Button>
                     </Link>
                  </div>
                  <p className="text-center text-muted-foreground text-xs mt-6 font-medium">
                    Already have an account? <Link href="/auth" className="text-primary hover:underline font-bold">Log in</Link>
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee Section */}
      <TechMarquee />

      {/* Fat Footer */}
      <footer className="border-t border-border bg-background pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
             <div className="md:col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-heading font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                    CardioGuard
                  </span>
                </Link>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  Predict cardiovascular disease with industry-leading precision. A real-time inference engine for immediate patient health assessment.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => toast.success("📱 Our mobile apps are currently in active development! Join our Slack community for early access.", { duration: 4000 })} variant="outline" size="sm" className="gap-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground">
                    <svg viewBox="0 0 384 512" className="w-3.5 h-3.5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> App Store
                  </Button>
                  <Button onClick={() => toast.success("📱 Our mobile apps are currently in active development! Join our Slack community for early access.", { duration: 4000 })} variant="outline" size="sm" className="gap-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground">
                    <svg viewBox="0 0 512 512" className="w-3.5 h-3.5"><path fill="#4caf50" d="M47 38.3C40 45 35 55.4 35 69.4v373.2c0 14 5 24.4 12 31.1L49 476l225.2-220V254L49 34.1z"/><path fill="#ffeb3b" d="M344.4 329.1L274.2 256l-70.2-73.1 228.1-131c15-8.7 32-5.7 44.1 2.3l48.8 35.8c6.6 4.8 11.2 11.4 13 18.9l-193.6 220.2z"/><path fill="#f44336" d="M344.4 329.1L405.3 394l94.5-54.8c15.2-8.8 23.3-23.7 23.3-40.4 0-14.7-6.2-28-16.7-36.9l-162-132.8z"/><path fill="#2196f3" d="M344.4 329.1L125 456.9c-12.7 7.4-27.3 11-41.9 10.4l191.1-138.2z"/></svg> Google Play
                  </Button>
                </div>
             </div>

             <div>
                <h4 className="font-bold text-foreground mb-6 font-sans tracking-wider uppercase text-sm">Legal</h4>
                <ul className="space-y-4">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); toast("Our Privacy Policy is currently being drafted.", { icon: '📝' }); }} className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">Privacy Policy</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); toast("Our Terms of Service are currently being drafted.", { icon: '⚖️' }); }} className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">Terms of Service</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); toast("Cookie preferences will be available soon.", { icon: '🍪' }); }} className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">Cookie Preferences</a></li>
                </ul>
             </div>

             <div>
                <h4 className="font-bold text-foreground mb-6 font-sans tracking-wider uppercase text-sm">Connect</h4>
                <ul className="space-y-4">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); toast.success("We are CardioGuard, actively building the future of cardiovascular AI prediction!", { duration: 4000 }); }} className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">About Us</a></li>
                  <li><Link href="https://join.slack.com/t/shakeelscob/shared_invite/zt-4322dkwtt-IYvOwUdR5A5dtUzFwD6xhQ" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Support (Slack)</Link></li>
                  <li><a href="#" onClick={handleEmailClick} className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">Provide Feedback (Email)</a></li>
                </ul>
             </div>

             <div>
                <h4 className="font-bold text-foreground mb-6 font-sans tracking-wider uppercase text-sm">Socials</h4>
                <div className="flex gap-4">
                  <Link href="https://linkedin.com/in/mohamed-shakeel-720b2a29b" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:bg-primary/5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </Link>
                  <Link href="https://github.com/shakeelscribes" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:bg-primary/5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </Link>
                  <Link href="https://instagram.com/shakeelscribes" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:bg-primary/5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </Link>
                  <a href="#" onClick={handleEmailClick} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:bg-primary/5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </a>
                </div>
             </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground/50 font-medium">
               © {new Date().getFullYear()} CardioGuard AI. All rights reserved.
             </p>
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-xs font-medium max-w-lg text-left md:text-right">
               <AlertCircle className="w-4 h-4 shrink-0" />
               This is a screening tool, not a medical diagnosis. Always consult a doctor.
             </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
