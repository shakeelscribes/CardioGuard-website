'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Prediction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props {
  prediction: Prediction;
}

export default function RiskSpiderChart({ prediction }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!prediction) return null;

  // Normalize all factors to a 0-100 scale for the radar chart
  const p = prediction;
  
  // BP: 120/80 is 50%, higher is 100%, lower is 0%
  const bpScore = Math.min(100, Math.max(0, ((p.ap_hi || 120) - 90) * 1.5));
  
  // BMI: 22 is 50%. 
  const bmi = p.weight && p.height ? p.weight / ((p.height/100)**2) : 22;
  const bmiScore = Math.min(100, Math.max(0, (bmi - 15) * 3.3));
  
  // Age: 40 is 30%, 80 is 100%
  const ageScore = Math.min(100, Math.max(0, ((p.age_years || 40) - 20) * 1.6));
  
  // Cholesterol: 1=20%, 2=60%, 3=100%
  const cholScore = p.cholesterol === 1 ? 20 : p.cholesterol === 2 ? 60 : 100;
  
  // Glucose: 1=20%, 2=60%, 3=100%
  const glucScore = p.gluc === 1 ? 20 : p.gluc === 2 ? 60 : 100;
  
  // Lifestyle (Smoking/Alco/Active). Bad habits increase score (since Radar shows outward spikes as bad)
  let lifeScore = 20;
  if (p.smoke === 1) lifeScore += 40;
  if (p.alco === 1) lifeScore += 20;
  if (p.active !== 1) lifeScore += 20;

  const chartData = {
    labels: ['Blood Pressure', 'BMI', 'Age', 'Cholesterol', 'Glucose', 'Lifestyle Risk'],
    datasets: [
      {
        label: 'Healthy Reference',
        data: [50, 40, 40, 20, 20, 20],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
      },
      {
        label: 'Your Latest Scan',
        data: [bpScore, bmiScore, ageScore, cholScore, glucScore, lifeScore],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
        pointLabels: {
          font: { family: 'sans-serif', size: 9, weight: 'bold' as const },
          color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: theme === 'dark' ? '#fff' : '#000',
        bodyColor: theme === 'dark' ? '#fff' : '#000',
        bodyFont: { family: 'sans-serif', size: 12, weight: 'bold' as const },
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
             return ` ${context.dataset.label}`;
          }
        }
      }
    }
  };

  return (
    <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
      <CardContent className="p-8 flex-1 flex flex-col">
        <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 text-center">Risk Factor Overlap</h3>
        <p className="text-[10px] text-muted-foreground text-center mb-4 max-w-[200px] mx-auto leading-relaxed">Spikes outside the green polygon indicate problem areas.</p>
        <div className="flex-1 w-full relative min-h-[220px]">
          <Radar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
