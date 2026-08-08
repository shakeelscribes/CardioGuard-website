'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { predictCVD } from '@/lib/api';
import { 
  Activity, ArrowRight, ArrowLeft, Loader2, CircleCheck as CheckCircle2, 
  User, HeartPulse, TestTubeDiagonal as TestTube2, Cigarette, Wine, Dumbbell, 
  Droplet, ShieldAlert, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { calculateBMI } from '@/lib/utils';
import Link from 'next/link';

type Step = 'demographics' | 'vitals' | 'labs' | 'lifestyle';

const STEPS = [
  { id: 'demographics', label: 'Demographics', icon: User, desc: 'Biological baselines' },
  { id: 'vitals', label: 'Physical Vitals', icon: Activity, desc: 'Current measurements' },
  { id: 'labs', label: 'Laboratory Data', icon: TestTube2, desc: 'Bloodwork results' },
  { id: 'lifestyle', label: 'Lifestyle Factors', icon: HeartPulse, desc: 'Behavioral modifiers' },
] as const;

export default function PredictPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { savePrediction } = usePredictions(user?.id);
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [currentStep, setCurrentStep] = useState<Step>('demographics');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '1',
    height: '',
    weight: '',
    ap_hi: '',
    ap_lo: '',
    cholesterol: '1',
    gluc: '1',
    smoke: '0',
    alco: '0',
    active: '1'
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
    if (profile) {
      setFormData(prev => ({
        ...prev,
        age: profile.age ? String(profile.age) : prev.age,
        gender: profile.gender === 'Female' ? '2' : '1',
        height: profile.height ? String(profile.height) : prev.height,
        weight: profile.weight ? String(profile.weight) : prev.weight
      }));
    }
  }, [authLoading, user, router, profile]);

  useGSAP(() => {
    if (authLoading) return;
    // Initial page load animations
    gsap.fromTo('.tracker-panel', 
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );
    
    gsap.fromTo('.form-panel', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: container, dependencies: [authLoading] });

  useGSAP(() => {
    if (authLoading) return;
    // Step transition animations
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, { scope: container, dependencies: [currentStep, authLoading] });

  const getContextForStep = (step: Step) => {
    switch (step) {
      case 'demographics': return "Biological age and sex are fundamental risk multipliers. Cardiovascular risk models heavily weight age as arterial stiffness naturally increases over time.";
      case 'vitals': return "Excess adiposity (BMI > 25) significantly increases myocardial workload and alters systemic vascular resistance. Height and weight are crucial baselines.";
      case 'labs': return "Systolic pressure and lipid concentrations are direct causal agents in the development of atherosclerotic plaques and arterial stenosis.";
      case 'lifestyle': return "Behavioral choices are the most critical modifiable risk factors. Smoking induces immediate endothelial dysfunction and clotting risks.";
    }
  }

  const handleNext = (nextStep: Step) => {
    if (currentStep === 'demographics' && (!formData.age || !formData.gender)) {
      toast.error('Please enter your age');
      return;
    }
    if (currentStep === 'vitals' && (!formData.height || !formData.weight)) {
      toast.error('Please enter your height and weight');
      return;
    }
    if (currentStep === 'labs' && (!formData.ap_hi || !formData.ap_lo)) {
      toast.error('Please enter your blood pressure');
      return;
    }
    setCurrentStep(nextStep);
  };

  const handleBack = (prevStep: Step) => {
    setCurrentStep(prevStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const mlPayload = {
        age_years: parseInt(formData.age) || 45,
        gender: parseInt(formData.gender) || 1,
        height: parseFloat(formData.height) || 170.0,
        weight: parseFloat(formData.weight) || 70.0,
        ap_hi: parseInt(formData.ap_hi) || 120,
        ap_lo: parseInt(formData.ap_lo) || 80,
        cholesterol: parseInt(formData.cholesterol) || 1,
        gluc: parseInt(formData.gluc) || 1,
        smoke: parseInt(formData.smoke) || 0,
        alco: parseInt(formData.alco) || 0,
        active: parseInt(formData.active) || 1,
      };

      const mlResult = await predictCVD(mlPayload);

      const payload = {
        user_id: user.id,
        ...mlPayload,
        probability: mlResult.probability,
        risk_level: mlResult.risk_level,
        date: new Date().toISOString()
      };

      const result = await savePrediction(payload);
      if (result.error) throw result.error;
      
      toast.custom((t) => (
        <div className="bg-background border border-border shadow-[0_0_50px_rgba(var(--primary),0.2)] rounded-3xl p-8 flex flex-col items-center max-w-sm w-full gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <CheckCircle2 className="w-10 h-10 relative z-10" />
          </div>
          <div className="text-center">
            <h3 className="font-heading font-bold text-2xl text-foreground">Scan Complete</h3>
            <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest mt-2 font-bold">
              Risk Index: {Math.round(mlResult.probability)}%
            </p>
          </div>
        </div>
      ), { duration: 5000 });
      
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('Diagnostic generation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <UnifiedLayout><div /></UnifiedLayout>;

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <UnifiedLayout>
      <div className="relative min-h-[85vh] w-full pt-8 pb-20" ref={container}>
        
        {/* Ambient Glows */}
        <div className="ambient-glow absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="ambient-glow absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto w-full px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10">
            
            {/* LEFT COLUMN: Tracker & Context */}
            <div className="tracker-panel lg:col-span-4 flex flex-col gap-8">
              
              <div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase font-bold text-muted-foreground hover:text-primary transition-colors mb-6">
                  <ArrowLeft className="w-3 h-3" /> Abort Protocol
                </Link>

                <h1 className="text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
                  Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Terminal</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground font-sans">
                  Please provide accurate biological and lifestyle telemetry for the cardiovascular prediction model.
                </p>
              </div>

              {/* Vertical Step Tracker */}
              <div className="space-y-6 mt-4">
                {STEPS.map((step, idx) => {
                  const isActive = step.id === currentStep;
                  const isPast = idx < currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-start gap-4 relative">
                      {/* Connector Line */}
                      {idx !== STEPS.length - 1 && (
                        <div className={`absolute top-10 left-6 w-[2px] h-10 -ml-px transition-colors duration-500 ${isPast ? 'bg-primary' : 'bg-border'}`} />
                      )}
                      
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                        isActive ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-110' : 
                        isPast ? 'bg-primary border-primary text-primary-foreground' : 
                        'bg-card border-border text-muted-foreground'
                      }`}>
                        {isPast ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      
                      <div className="pt-2">
                        <div className={`font-mono text-sm tracking-widest uppercase font-bold transition-colors ${isActive ? 'text-primary' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 font-sans">{step.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Clinical Context Box */}
              <Card className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-md mt-auto">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-primary">Clinical Context</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                    {getContextForStep(currentStep)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Glassmorphic Intake Form */}
            <div className="form-panel lg:col-span-8">
              <Card className="h-full min-h-[600px] rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative">
                
                {/* Top Progress Bar */}
                <div className="h-1.5 w-full bg-muted absolute top-0 left-0">
                  <div 
                    className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                    style={{ width: `${((currentStepIndex + 1) / 4) * 100}%` }}
                  />
                </div>

                <CardContent className="p-8 md:p-12 flex-1 flex flex-col justify-center relative z-10">
                  <form onSubmit={handleSubmit} ref={formRef} className="flex-1 flex flex-col">
                    
                    {currentStep === 'demographics' && (
                      <div className="space-y-10 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-heading font-bold text-foreground">Demographics</h2>
                          <p className="text-muted-foreground">Confirm patient biological metrics.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1">Patient Age</Label>
                            <Input
                              type="number"
                              value={formData.age}
                              onChange={(e) => setFormData({...formData, age: e.target.value})}
                              className="h-20 rounded-2xl bg-background/50 border-border/50 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/30 text-3xl font-heading font-bold px-6 shadow-inner transition-all"
                              placeholder="Years"
                              required
                              min="1"
                              max="120"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1">Biological Sex</Label>
                            <RadioGroup 
                              value={formData.gender} 
                              onValueChange={(val) => setFormData({...formData, gender: val})}
                              className="flex gap-4 h-20"
                            >
                              <Label className={`flex-1 flex items-center justify-center rounded-2xl border-2 cursor-pointer transition-all ${formData.gender === '1' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="1" className="sr-only" />
                                <span className="font-heading font-bold text-xl">Male</span>
                              </Label>
                              <Label className={`flex-1 flex items-center justify-center rounded-2xl border-2 cursor-pointer transition-all ${formData.gender === '2' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="2" className="sr-only" />
                                <span className="font-heading font-bold text-xl">Female</span>
                              </Label>
                            </RadioGroup>
                          </div>
                        </div>

                        <div className="flex justify-end pt-10 mt-auto">
                          <Button type="button" onClick={() => handleNext('vitals')} className="h-14 px-8 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-0.5 transition-all">
                            Next Phase <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentStep === 'vitals' && (
                      <div className="space-y-10 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-heading font-bold text-foreground">Physical Vitals</h2>
                          <p className="text-muted-foreground">Input current physical measurements.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1">Height (cm)</Label>
                            <Input
                              type="number"
                              value={formData.height}
                              onChange={(e) => setFormData({...formData, height: e.target.value})}
                              className="h-20 rounded-2xl bg-background/50 border-border/50 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/30 text-3xl font-heading font-bold px-6 shadow-inner transition-all"
                              placeholder="175"
                              required
                              min="50"
                              max="300"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1">Weight (kg)</Label>
                            <Input
                              type="number"
                              value={formData.weight}
                              onChange={(e) => setFormData({...formData, weight: e.target.value})}
                              className="h-20 rounded-2xl bg-background/50 border-border/50 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/30 text-3xl font-heading font-bold px-6 shadow-inner transition-all"
                              placeholder="70"
                              required
                              min="10"
                              max="300"
                              step="0.1"
                            />
                          </div>
                        </div>

                        {formData.height && formData.weight && (
                          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between mt-4">
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">Live Calculation</span>
                              <span className="text-sm text-foreground/80 font-bold">Body Mass Index (BMI)</span>
                            </div>
                            <span className="font-heading font-bold text-4xl text-foreground bg-background/50 px-4 py-2 rounded-xl border border-border/50">
                              {calculateBMI(parseFloat(formData.weight), parseFloat(formData.height)).toFixed(1)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between pt-10 mt-auto">
                          <Button type="button" variant="outline" onClick={() => handleBack('demographics')} className="h-14 px-6 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold border-border hover:bg-muted transition-all">
                            <ArrowLeft className="w-4 h-4" /> Previous
                          </Button>
                          <Button type="button" onClick={() => handleNext('labs')} className="h-14 px-8 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-0.5 transition-all">
                            Next Phase <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentStep === 'labs' && (
                      <div className="space-y-10 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-heading font-bold text-foreground">Laboratory Results</h2>
                          <p className="text-muted-foreground">Enter latest blood pressure and bloodwork analysis.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1">Systolic BP</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={formData.ap_hi}
                                onChange={(e) => setFormData({...formData, ap_hi: e.target.value})}
                                className="h-16 rounded-2xl bg-background/50 border-border/50 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/30 text-2xl font-heading font-bold pl-6 pr-20 shadow-inner transition-all"
                                placeholder="120"
                                required
                                min="50"
                                max="250"
                              />
                              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground font-bold">mmHg</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1">Diastolic BP</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={formData.ap_lo}
                                onChange={(e) => setFormData({...formData, ap_lo: e.target.value})}
                                className="h-16 rounded-2xl bg-background/50 border-border/50 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/30 text-2xl font-heading font-bold pl-6 pr-20 shadow-inner transition-all"
                                placeholder="80"
                                required
                                min="30"
                                max="150"
                              />
                              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground font-bold">mmHg</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4 md:col-span-2">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1 flex items-center gap-2"><Droplet className="w-4 h-4 text-primary" /> Cholesterol Profile</Label>
                            <RadioGroup value={formData.cholesterol} onValueChange={(val) => setFormData({...formData, cholesterol: val})} className="grid grid-cols-3 gap-4">
                              {[
                                { val: '1', label: 'Normal', desc: 'Optimal levels' },
                                { val: '2', label: 'Elevated', desc: 'Above baseline' },
                                { val: '3', label: 'Critical', desc: 'High risk' }
                              ].map((opt) => (
                                <Label key={opt.val} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.cholesterol === opt.val ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                  <RadioGroupItem value={opt.val} className="sr-only" />
                                  <span className="font-heading font-bold text-lg">{opt.label}</span>
                                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1 opacity-70">{opt.desc}</span>
                                </Label>
                              ))}
                            </RadioGroup>
                          </div>

                          <div className="space-y-4 md:col-span-2">
                            <Label className="font-mono text-xs uppercase tracking-widest font-bold text-muted-foreground ml-1 flex items-center gap-2"><Droplet className="w-4 h-4 text-primary" /> Glucose Levels</Label>
                            <RadioGroup value={formData.gluc} onValueChange={(val) => setFormData({...formData, gluc: val})} className="grid grid-cols-3 gap-4">
                              {[
                                { val: '1', label: 'Normal', desc: 'Optimal levels' },
                                { val: '2', label: 'Elevated', desc: 'Above baseline' },
                                { val: '3', label: 'Critical', desc: 'High risk' }
                              ].map((opt) => (
                                <Label key={opt.val} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.gluc === opt.val ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                  <RadioGroupItem value={opt.val} className="sr-only" />
                                  <span className="font-heading font-bold text-lg">{opt.label}</span>
                                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1 opacity-70">{opt.desc}</span>
                                </Label>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>

                        <div className="flex justify-between pt-10 mt-auto">
                          <Button type="button" variant="outline" onClick={() => handleBack('vitals')} className="h-14 px-6 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold border-border hover:bg-muted transition-all">
                            <ArrowLeft className="w-4 h-4" /> Previous
                          </Button>
                          <Button type="button" onClick={() => handleNext('lifestyle')} className="h-14 px-8 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-0.5 transition-all">
                            Next Phase <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentStep === 'lifestyle' && (
                      <div className="space-y-10 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-heading font-bold text-foreground">Lifestyle Factors</h2>
                          <p className="text-muted-foreground">Finalize protocol with behavioral indicators.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Smoking */}
                          <div className="space-y-4">
                            <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center block">Smoker</Label>
                            <RadioGroup value={formData.smoke} onValueChange={(val) => setFormData({...formData, smoke: val})} className="flex flex-col gap-3">
                              <Label className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.smoke === '1' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="1" className="sr-only" />
                                <Cigarette className="w-8 h-8 mb-2" />
                                <span className="font-heading font-bold text-lg">Yes</span>
                              </Label>
                              <Label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.smoke === '0' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="0" className="sr-only" />
                                <span className="font-heading font-bold">No</span>
                              </Label>
                            </RadioGroup>
                          </div>

                          {/* Alcohol */}
                          <div className="space-y-4">
                            <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center block">Alcohol Consumption</Label>
                            <RadioGroup value={formData.alco} onValueChange={(val) => setFormData({...formData, alco: val})} className="flex flex-col gap-3">
                              <Label className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.alco === '1' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="1" className="sr-only" />
                                <Wine className="w-8 h-8 mb-2" />
                                <span className="font-heading font-bold text-lg">Yes</span>
                              </Label>
                              <Label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.alco === '0' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="0" className="sr-only" />
                                <span className="font-heading font-bold">No</span>
                              </Label>
                            </RadioGroup>
                          </div>

                          {/* Activity */}
                          <div className="space-y-4">
                            <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center block">Physically Active</Label>
                            <RadioGroup value={formData.active} onValueChange={(val) => setFormData({...formData, active: val})} className="flex flex-col gap-3">
                              <Label className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.active === '1' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="1" className="sr-only" />
                                <Dumbbell className="w-8 h-8 mb-2" />
                                <span className="font-heading font-bold text-lg">Yes</span>
                              </Label>
                              <Label className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.active === '0' ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]' : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background shadow-inner'}`}>
                                <RadioGroupItem value="0" className="sr-only" />
                                <span className="font-heading font-bold">No</span>
                              </Label>
                            </RadioGroup>
                          </div>

                        </div>

                        <div className="flex justify-between pt-10 mt-auto">
                          <Button type="button" variant="outline" onClick={() => handleBack('labs')} className="h-14 px-6 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold border-border hover:bg-muted transition-all">
                            <ArrowLeft className="w-4 h-4" /> Previous
                          </Button>
                          <Button type="submit" disabled={loading} className="relative overflow-hidden h-14 px-10 rounded-full gap-3 font-mono text-xs uppercase tracking-widest font-bold bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all group">
                            {loading ? (
                              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <Heart className="w-5 h-5 mr-2 animate-pulse" /> 
                                Execute Scan Protocol
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}
