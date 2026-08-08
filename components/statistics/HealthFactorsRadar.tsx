'use client';
import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateBMI } from '@/lib/utils';

export default function HealthFactorsRadar({ prediction }: { prediction: any }) {
  const data = useMemo(() => {
    if (!prediction) return [];
    
    // Normalize factors to 0-100 scale for radar representation
    
    // BP: Ideal is < 120/80. High is bad. We'll invert it so 100 = perfect health.
    const bpScore = Math.max(0, 100 - (prediction.ap_hi - 120) * 0.5 - (prediction.ap_lo - 80) * 0.5);
    
    // BMI: Ideal 18.5 - 25. 
    let bmiScore = 100;
    if (prediction.height && prediction.weight) {
      const bmi = calculateBMI(prediction.height, prediction.weight);
      if (bmi > 25) bmiScore = Math.max(0, 100 - (bmi - 25) * 5);
      else if (bmi < 18.5) bmiScore = Math.max(0, 100 - (18.5 - bmi) * 5);
    }
    
    // Cholesterol (1 normal, 2 above, 3 well above) -> 100, 50, 0
    const cholScore = prediction.cholesterol === 1 ? 100 : prediction.cholesterol === 2 ? 50 : 0;
    
    // Glucose (1 normal, 2 above, 3 well above) -> 100, 50, 0
    const glucScore = prediction.gluc === 1 ? 100 : prediction.gluc === 2 ? 50 : 0;
    
    // Lifestyle
    const activeScore = prediction.active === 1 ? 100 : 0;
    const smokeScore = prediction.smoke === 0 ? 100 : 0;
    
    return [
      { subject: 'Blood Pressure', A: Math.min(100, bpScore) },
      { subject: 'BMI Health', A: Math.min(100, bmiScore) },
      { subject: 'Cholesterol', A: cholScore },
      { subject: 'Glucose', A: glucScore },
      { subject: 'Physical Activity', A: activeScore },
      { subject: 'Non-Smoker', A: smokeScore },
    ];
  }, [prediction]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs uppercase">No Data Available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }} 
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
          itemStyle={{ color: 'hsl(var(--primary))', fontSize: '14px', fontWeight: 'bold' }}
          labelStyle={{ display: 'none' }}
        />
        <Radar 
          name="Health Score" 
          dataKey="A" 
          stroke="hsl(var(--primary))" 
          fill="hsl(var(--primary))" 
          fillOpacity={0.3} 
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
