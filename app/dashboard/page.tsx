'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { Activity, ShieldAlert, HeartPulse, ArrowRight, Clock, Info, History } from 'lucide-react';
import Link from 'next/link';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import RiskTrendChart from '@/components/dashboard/RiskTrendChart';
import RiskFactorsBar from '@/components/dashboard/RiskFactorsBar';
import RiskGauge from '@/components/ui/RiskGauge';
import { formatDate, getRiskLabel } from '@/lib/utils';
import PersonalizedInsights from '@/components/dashboard/PersonalizedInsights';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { predictions, loading: predLoading, stats } = usePredictions(user?.id);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  useGSAP(() => {
    if (authLoading || predLoading) return;

    const tl = gsap.timeline();
    
    // Ambient glow pulse
    tl.to('.ambient-glow', {
      opacity: 0.8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // Simulated EKG line background
    gsap.to('.ekg-line', {
      xPercent: -100,
      duration: 5,
      ease: 'linear',
      repeat: -1
    });

    gsap.fromTo('.dash-header', 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
    
    // Left Telemetry Panel
    gsap.fromTo('.telemetry-panel', 
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );

    // Right Analytics Grid
    gsap.fromTo('.analytics-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    );

  }, { scope: container, dependencies: [authLoading, predLoading] });

  const latestPrediction = stats?.latest;

  const safeBmi = latestPrediction?.bmi || (latestPrediction?.weight && latestPrediction?.height ? (latestPrediction.weight / Math.pow(latestPrediction.height / 100, 2)) : 0);

  const metricCards = [
    { label: 'Clinical Scans', value: stats?.total || 0, icon: Activity },
    { label: 'Mean Risk Index', value: Math.round(stats?.avgRisk || 0), suffix: '%', icon: HeartPulse },
    { label: 'Critical Alerts', value: stats?.highRiskCount || 0, icon: ShieldAlert },
    { 
      label: 'Days Active', 
      value: predictions?.length > 0
        ? Math.ceil((Date.now() - new Date(predictions[predictions.length - 1]?.date || (predictions[predictions.length - 1] as any)?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
        : 0, 
      suffix: 'd', 
      icon: Clock 
    },
  ];

  return (
    <UnifiedLayout>
      <div className="relative min-h-[80vh] w-full" ref={container}>
        {(authLoading || predLoading) ? (
          <div className="flex items-center justify-center h-[60vh] absolute inset-0 z-50">
            <div className="flex flex-col items-center gap-4 text-primary">
              <Activity className="w-12 h-12 animate-pulse" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold">Synchronizing Telemetry...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            {/* Ambient Background Glows */}
            <div className="ambient-glow absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="ambient-glow absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />

            {/* Header Section */}
            <div className="dash-header flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-6 relative z-10 opacity-0">
              <div>

                <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
                  Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Center</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground font-sans">
                  {latestPrediction 
                    ? `Last Scan Protocol executed on ${formatDate(latestPrediction.date)}` 
                    : "System Ready. Awaiting initial scan telemetry."}
                </p>
              </div>
              <Link href="/predict">
                <Button className="h-12 px-8 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:-translate-y-0.5 transition-all font-mono text-xs tracking-widest uppercase font-bold">
                  <Activity className="w-4 h-4 mr-2" />
                  Initialize Scan
                </Button>
              </Link>
            </div>

            {/* Main Grid Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              
              {/* LEFT: Live Telemetry Panel (col-span-4) */}
              <div className="telemetry-panel lg:col-span-4 h-full opacity-0">
                <Card className="h-full rounded-3xl border border-border/50 bg-gradient-to-b from-card/80 to-primary/5 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_50px_-12px_rgba(var(--primary),0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
                  {/* EKG Background Animation */}
                  <div className="absolute inset-0 opacity-[0.03] overflow-hidden -z-10 flex">
                     <div className="ekg-line whitespace-nowrap text-[150px] font-bold text-primary flex">
                        /\/\___/\/\___/\/\___/\/\___/\/\___/\/\___/\/\___
                     </div>
                  </div>
                  
                  <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <span className="font-mono text-xs uppercase tracking-widest font-bold text-foreground flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary" /> Live Telemetry
                        </span>
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold border border-primary/20">
                          ID: {user?.id?.substring(0,6) || 'SYS'}
                        </span>
                      </div>

                      {latestPrediction ? (
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                            <div className="bg-muted/80 backdrop-blur-xl border border-border/50 rounded-full p-6 shadow-2xl relative">
                              <RiskGauge
                                score={Math.round(latestPrediction.probability || 0)}
                                level={latestPrediction.risk_level as any}
                                size={200}
                              />
                            </div>
                          </div>
                          <div className="text-center mt-6 w-full">
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-background/60 border border-border/60 backdrop-blur-md shadow-sm">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${
                                latestPrediction.risk_level === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
                                latestPrediction.risk_level === 'medium' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 
                                'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                              }`} />
                              <span className="text-sm uppercase tracking-widest font-mono font-bold text-foreground">
                                {getRiskLabel(latestPrediction.risk_level as any)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Activity className="w-8 h-8 text-primary opacity-50" />
                          </div>
                          <p className="text-sm opacity-80 font-mono text-muted-foreground">Awaiting initial stream.</p>
                        </div>
                      )}
                    </div>

                    {/* Patient Vitals Factor Breakdown */}
                    {latestPrediction && (
                      <div className="mt-8 pt-6 border-t border-border/50">
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-mono text-xs tracking-widest uppercase font-bold text-foreground">Risk Decomposition</span>
                        </div>
                        <RiskFactorsBar prediction={latestPrediction} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT: Analytics Grid (col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Top Row: Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {metricCards.map((card, idx) => (
                    <Card key={idx} className="analytics-card opacity-0 rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group">
                      <CardContent className="p-5 h-full flex flex-col justify-between gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
                        
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] border border-primary/20 relative z-10">
                          <card.icon className="w-5 h-5" />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="text-3xl font-heading font-bold text-foreground">
                            <AnimatedCounter end={card.value} suffix={card.suffix} />
                          </div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-foreground font-bold mt-1">
                            {card.label}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Middle Row: Massive Trend Chart */}
                <Card className="analytics-card opacity-0 rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-2xl shadow-lg hover:shadow-[0_0_40px_rgba(var(--primary),0.15)] transition-all duration-500 flex flex-col">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-mono text-xs tracking-widest uppercase font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-3 h-3 text-primary" /> Risk Trajectory Analysis
                      </span>
                      <Link href="/statistics" className="text-primary text-[10px] font-mono uppercase tracking-widest hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        Full Analytics <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                      <RiskTrendChart predictions={predictions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Row: Directives & Recent Logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <Card className="analytics-card opacity-0 rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all duration-500 flex flex-col">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Info className="w-3 h-3 text-primary" />
                        </div>
                        <span className="font-mono text-xs tracking-widest uppercase font-bold text-foreground">Clinical Directives</span>
                      </div>
                      <PersonalizedInsights prediction={latestPrediction} />
                    </CardContent>
                  </Card>

                  <Card className="analytics-card opacity-0 rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all duration-500 flex flex-col">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                            <History className="w-3 h-3 text-primary" />
                          </div>
                          <span className="font-mono text-xs tracking-widest uppercase font-bold text-foreground">Recent Scans</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-3">
                        {predictions.length > 0 ? (
                          predictions.slice(0, 4).map((pred) => (
                            <div key={pred.id} className="group flex items-center justify-between p-3 rounded-xl bg-foreground/5 border border-border/30 hover:border-primary/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                                  pred.risk_level?.toLowerCase() === 'low' ? 'text-green-500 bg-green-500' :
                                  pred.risk_level?.toLowerCase() === 'medium' ? 'text-yellow-500 bg-yellow-500' : 'text-red-500 bg-red-500'
                                }`} />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-foreground">{formatDate(pred.date)}</span>
                                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-muted-foreground">
                                    {getRiskLabel(pred.risk_level as any)}
                                  </span>
                                </div>
                              </div>
                              <span className="font-heading font-bold text-lg text-primary">{Math.round(pred.probability || 0)}%</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground font-mono text-xs">
                            No records found.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
}
