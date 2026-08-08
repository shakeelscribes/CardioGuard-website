'use client';

import { Prediction } from '@/types';
import { Activity, Scale, Droplet } from 'lucide-react';

interface Props {
  prediction?: Prediction;
}

export default function RiskFactorsBar({ prediction }: Props) {
  if (!prediction) {
    return null;
  }

  const calcSeverity = (val: number, min: number, max: number) => {
    if (!val) return 0;
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const safeBmi = prediction.bmi || (prediction.weight && prediction.height ? (prediction.weight / Math.pow(prediction.height / 100, 2)) : 0);

  // Same calculation logic to keep it synchronized with the radar
  const sysSev = calcSeverity(prediction.ap_hi, 100, 160);
  const bmiSev = calcSeverity(safeBmi, 20, 35);
  const cholSev = calcSeverity(prediction.cholesterol, 1, 3);
  
  // Calculate average BP severity
  const bpSev = sysSev; 

  const factors = [
    {
      label: 'Blood Pressure',
      icon: Activity,
      severity: bpSev,
      displayVal: `${prediction.ap_hi || '--'} / ${prediction.ap_lo || '--'}`,
    },
    {
      label: 'Body Mass Index',
      icon: Scale,
      severity: bmiSev,
      displayVal: safeBmi ? safeBmi.toFixed(1) : '--',
    },
    {
      label: 'Lipid Profile',
      icon: Droplet,
      severity: cholSev,
      displayVal: `Level ${prediction.cholesterol || '--'}`,
    }
  ];

  const getColor = (sev: number) => {
    if (sev < 30) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
    if (sev < 70) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  };

  return (
    <div className="space-y-6">
      {factors.map((factor, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <factor.icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-foreground">{factor.label}</span>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">{factor.displayVal}</span>
          </div>
          
          <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden flex">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${getColor(factor.severity)}`}
              style={{ width: `${Math.max(5, factor.severity)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
