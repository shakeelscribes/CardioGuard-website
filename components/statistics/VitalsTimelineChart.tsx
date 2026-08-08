'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Prediction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface Props {
  predictions: Prediction[];
}

export default function VitalsTimelineChart({ predictions }: Props) {
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

  if (predictions.length === 0) return null;

  const dataPoints = [...predictions].reverse().map(p => ({
    date: formatDate(p.date).split(' ')[0],
    sys: p.ap_hi || 0,
    dia: p.ap_lo || 0,
    bmi: p.weight && p.height ? p.weight / ((p.height/100)**2) : 0
  }));

  const chartData = {
    labels: dataPoints.map(d => d.date),
    datasets: [
      {
        label: 'Systolic BP',
        data: dataPoints.map(d => d.sys),
        borderColor: 'rgba(239, 68, 68, 1)', 
        backgroundColor: 'rgba(239, 68, 68, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Diastolic BP',
        data: dataPoints.map(d => d.dia),
        borderColor: 'rgba(59, 130, 246, 1)', 
        backgroundColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'BMI',
        data: dataPoints.map(d => d.bmi),
        borderColor: 'rgba(168, 85, 247, 1)', 
        backgroundColor: 'rgba(168, 85, 247, 1)',
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: theme === 'dark' ? '#fff' : '#000',
        bodyColor: theme === 'dark' ? '#fff' : '#000',
        titleFont: { family: 'sans-serif', size: 10, weight: 'bold' as const },
        bodyFont: { family: 'sans-serif', size: 14, weight: 'bold' as const },
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            let val = context.parsed.y;
            if (context.datasetIndex === 2) val = val.toFixed(1);
            return ` ${context.dataset.label}: ${val}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: 'sans-serif', size: 10 }, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', maxTicksLimit: 6 }
      },
      y: {
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: { font: { family: 'sans-serif', size: 10 }, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }
      }
    }
  };

  return (
    <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
      <CardContent className="p-8 flex-1 flex flex-col">
        <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">Vital Signs Driver Timeline</h3>
        <div className="flex-1 w-full relative min-h-[200px]">
          <Line options={options} data={chartData} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Systolic BP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Diastolic BP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">BMI</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
