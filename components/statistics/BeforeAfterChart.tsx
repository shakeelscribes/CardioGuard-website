'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Prediction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MoveRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface Props {
  predictions: Prediction[];
}

export default function BeforeAfterChart({ predictions }: Props) {
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

  if (predictions.length < 2) {
    return (
      <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full">
        <CardContent className="p-8 h-full flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-[10px] font-sans tracking-widest uppercase font-bold text-center">Not enough data.<br/>Run a second scan to see momentum.</p>
        </CardContent>
      </Card>
    );
  }

  // Ensure sorted by date descending to get the latest 2
  const sorted = [...predictions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const current = sorted[0];
  const previous = sorted[1];

  const prevBmi = previous.weight && previous.height ? (previous.weight / ((previous.height/100)**2)) : 0;
  const currBmi = current.weight && current.height ? (current.weight / ((current.height/100)**2)) : 0;

  const chartData = {
    labels: ['Risk %', 'Systolic', 'BMI'],
    datasets: [
      {
        label: 'Previous Scan',
        data: [previous.probability || 0, previous.ap_hi || 0, prevBmi],
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        borderWidth: 0,
        barPercentage: 0.7,
        categoryPercentage: 0.4,
      },
      {
        label: 'Current Scan',
        data: [current.probability || 0, current.ap_hi || 0, currBmi],
        backgroundColor: (ctx: any) => {
          const index = ctx.dataIndex;
          if (ctx.dataset.data[index] === undefined) return 'rgba(59, 130, 246, 0.8)';
          const curr = ctx.dataset.data[index] as number;
          const prev = chartData.datasets[0].data[index] as number;
          // If lower is better (Risk, Systolic, BMI usually)
          if (curr < prev) return 'rgba(34, 197, 94, 0.8)'; // Green (improved)
          if (curr > prev) return 'rgba(239, 68, 68, 0.8)'; // Red (worsened)
          return 'rgba(59, 130, 246, 0.8)'; // Blue (unchanged)
        },
        borderRadius: 8,
        borderWidth: 0,
        barPercentage: 0.7,
        categoryPercentage: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            let val = context.parsed.y;
            if (context.dataIndex === 2) val = val.toFixed(1); // BMI
            else val = Math.round(val);
            return `${context.dataset.label}: ${val}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: 'sans-serif', size: 10, weight: 'bold' as const }, color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
      },
      y: {
        display: false,
        grid: { display: false }
      }
    }
  };

  return (
    <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
      <CardContent className="p-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Health Momentum</h3>
          <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-muted-foreground tracking-widest uppercase">
            <span className="opacity-50">{formatDate(previous.date).split(' ')[0]}</span>
            <MoveRight className="w-3 h-3" />
            <span className="text-foreground">{formatDate(current.date).split(' ')[0]}</span>
          </div>
        </div>
        <div className="flex-1 w-full relative min-h-[200px]">
          <Bar options={options} data={chartData as any} />
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/20"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Previous</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500/80"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Improved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500/80"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Worsened</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
