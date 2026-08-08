'use client';
import { useEffect, useRef, useState } from 'react';
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
import { formatDate } from '@/lib/utils';
import { Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface Props {
  predictions: Prediction[];
}

export default function RiskTrendChart({ predictions }: Props) {
  const chartRef = useRef<any>(null);
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

  if (predictions.length === 0) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-primary opacity-50" />
          </div>
          <p className="text-muted-foreground text-[10px] font-sans tracking-widest uppercase font-bold">No telemetry data yet</p>
        </div>
      </div>
    );
  }

  const dataPoints = [...predictions]
    .reverse()
    .slice(-20)
    .map((p) => {
      const fullDate = formatDate(p.date || (p as any).created_at || new Date().toISOString());
      return {
        date: fullDate.split(' ')[0],
        fullDate: fullDate,
        risk: Math.round(p.probability || (p as any).risk_score || 0),
      };
    });

  const chartData = {
    labels: dataPoints.map(d => d.date),
    datasets: [
      {
        label: 'Risk Score',
        data: dataPoints.map(d => d.risk),
        backgroundColor: (context: any) => {
          const val = context.raw;
          if (val < 40) return 'rgba(34, 197, 94, 0.8)'; // Green
          if (val < 70) return 'rgba(59, 130, 246, 0.8)'; // Blue
          return 'rgba(239, 68, 68, 0.8)'; // Red
        },
        hoverBackgroundColor: (context: any) => {
          const val = context.raw;
          if (val < 40) return 'rgba(34, 197, 94, 1)'; 
          if (val < 70) return 'rgba(59, 130, 246, 1)'; 
          return 'rgba(239, 68, 68, 1)'; 
        },
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
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
        bodyFont: { size: 18, weight: 'bold' as const, family: 'sans-serif' },
        titleFont: { family: 'sans-serif', size: 10, weight: 'bold' as const },
        padding: 16,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return dataPoints[context[0].dataIndex].fullDate;
          },
          label: function(context: any) {
            return `Risk: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: 'sans-serif', size: 10, weight: 'bold' as const }, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', maxTicksLimit: 8 }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', drawBorder: false, borderDash: [5, 5] },
        ticks: { font: { family: 'sans-serif', size: 10, weight: 'bold' as const }, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }
      }
    },
  };

  return (
    <div className="w-full h-full min-h-[300px] relative">
      <Bar ref={chartRef} options={options} data={chartData} />
    </div>
  );
}
