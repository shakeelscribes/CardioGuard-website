'use client';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, TrendingUp, BarChart2 } from 'lucide-react';
import RiskTrendChart from '@/components/dashboard/RiskTrendChart';
import WhatIfSimulator from '@/components/statistics/WhatIfSimulator';
import BeforeAfterChart from '@/components/statistics/BeforeAfterChart';
import VitalsTimelineChart from '@/components/statistics/VitalsTimelineChart';
import RiskSpiderChart from '@/components/statistics/RiskSpiderChart';

export default function StatisticsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { predictions, loading: predLoading } = usePredictions(user?.id);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  useGSAP(() => {
    if (authLoading || predLoading) return;
    
    gsap.from('.stats-header', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' });
    gsap.from('.stats-card', { 
      opacity: 0, 
      y: 30, 
      duration: 0.6, 
      stagger: 0.1, 
      ease: 'power2.out',
      delay: 0.2
    });
  }, { scope: container, dependencies: [authLoading, predLoading] });

  if (authLoading) return <UnifiedLayout><div /></UnifiedLayout>;

  return (
    <UnifiedLayout>
      <div className="max-w-[1400px] mx-auto pb-12 px-4 md:px-8" ref={container}>
        <div className="stats-header border-b border-border/50 pb-6 mb-8 mt-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>

            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
              Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Dashboard</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-sans">
              Personal Risk & Telemetry Engine
            </p>
          </div>
        </div>

        {predLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-primary">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-muted-foreground" />
            <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-muted-foreground">Compiling Telemetry...</span>
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <BarChart2 className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">Insufficient Data</h3>
            <p className="text-muted-foreground font-sans text-[10px] tracking-widest uppercase max-w-sm font-bold">
              Execute a diagnostic scan to populate the analytics engine.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Top Row: Simulator & Hero Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Simulator */}
              <div className="xl:col-span-1 stats-card">
                <WhatIfSimulator basePrediction={predictions[0]} />
              </div>
              
              {/* Risk Trajectory Hero Chart */}
              <div className="xl:col-span-1 stats-card">
                <Card className="rounded-[2rem] border border-border shadow-sm bg-card h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Longitudinal Risk Trajectory</h3>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                      <RiskTrendChart predictions={predictions} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Row: 3 Column Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              <div className="stats-card h-[400px]">
                <BeforeAfterChart predictions={predictions} />
              </div>

              <div className="stats-card h-[400px]">
                <VitalsTimelineChart predictions={predictions} />
              </div>

              <div className="stats-card h-[400px] xl:col-span-2">
                <RiskSpiderChart prediction={predictions[0]} />
              </div>

            </div>

          </div>
        )}
      </div>
    </UnifiedLayout>
  );
}
