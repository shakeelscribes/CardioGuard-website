'use client';
import { useEffect, useRef, useState } from 'react';
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
import { Activity } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface Props {
  prediction?: Prediction;
}

export default function BiometricRadar({ prediction }: Props) {
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

  if (!prediction) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-primary opacity-50" />
          </div>
          <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase font-bold text-[10px]">Awaiting Biometrics</p>
        </div>
      </div>
    );
  }

  // Normalize inputs to a 0-100 Severity Scale
  const calcSeverity = (val: number, min: number, max: number) => {
    if (!val) return 0;
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const safeBmi = prediction.bmi || (prediction.weight && prediction.height ? (prediction.weight / Math.pow(prediction.height / 100, 2)) : 0);

  const sysSev = calcSeverity(prediction.ap_hi, 100, 160);
  const diaSev = calcSeverity(prediction.ap_lo, 60, 100);
  const bmiSev = calcSeverity(safeBmi, 20, 35);
  const cholSev = calcSeverity(prediction.cholesterol, 1, 3);
  const glucSev = calcSeverity(prediction.gluc, 1, 3);

  const data = {
    labels: ['Systolic BP', 'Diastolic BP', 'BMI', 'Cholesterol', 'Glucose'],
    datasets: [
      {
        label: 'Patient Metrics',
        data: [sysSev, diaSev, bmiSev, cholSev, glucSev],
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red tint for danger
        borderColor: '#ef4444',
        borderWidth: 2,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: theme === 'dark' ? '#000' : '#fff',
        pointHoverBackgroundColor: theme === 'dark' ? '#000' : '#fff',
        pointHoverBorderColor: '#ef4444',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Optimal Baseline',
        data: [20, 20, 20, 0, 0], // The healthy inner polygon
        backgroundColor: 'rgba(34, 197, 94, 0.15)', // Green tint
        borderColor: '#22c55e',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false, // hide the numbers (0, 20, 40...)
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          circular: true,
        },
        angleLines: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: {
            family: 'monospace',
            size: 11,
            weight: 'bold' as const,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: theme === 'dark' ? '#fff' : '#000',
        bodyColor: '#ef4444',
        bodyFont: {
          family: 'monospace',
          weight: 'bold' as const,
        },
        titleFont: {
          family: 'monospace'
        },
        padding: 12,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 1) return 'Optimal Healthy Range';
            return `Severity: ${Math.round(context.parsed.r)}%`;
          }
        }
      }
    },
  };

  // Canvas plugin for drawing the glowing shadow
  const glowPlugin = {
    id: 'glowPlugin',
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;
      ctx.save();
      ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
      ctx.shadowBlur = 15;
    },
    afterDatasetsDraw(chart: any) {
      chart.ctx.restore();
    }
  };

  return (
    <div className="w-full h-full min-h-[350px] relative">
      <div className="absolute inset-0 bg-red-500/5 rounded-3xl blur-3xl -z-10" />
      <Radar
        ref={chartRef}
        options={options}
        data={data}
        plugins={[glowPlugin]}
      />
      
      {/* Custom Legend */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-muted-foreground">Your Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500 border-dashed" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-muted-foreground">Optimal Target</span>
        </div>
      </div>
    </div>
  );
}
