'use client';

import { Prediction } from '@/types';
import { Activity, HeartPulse, Scale, AlertCircle } from 'lucide-react';

interface Props {
  prediction?: Prediction;
}

export default function PersonalizedInsights({ prediction }: Props) {
  if (!prediction) {
    return (
      <div className="text-sm text-muted-foreground font-mono">
        Awaiting clinical data to generate insights.
      </div>
    );
  }

  const insights = [];

  // 1. BMI Analysis
  if (prediction.bmi) {
    const bmi = parseFloat(prediction.bmi.toFixed(1));
    let status = '';
    let color = '';
    let icon = Scale;

    if (bmi < 18.5) {
      status = 'Underweight';
      color = 'text-yellow-500';
    } else if (bmi >= 18.5 && bmi < 25) {
      status = 'Optimal / Normal';
      color = 'text-green-500';
    } else if (bmi >= 25 && bmi < 30) {
      status = 'Overweight';
      color = 'text-orange-500';
    } else {
      status = 'Obese';
      color = 'text-red-500';
    }

    insights.push({
      icon,
      color,
      title: 'Body Mass Index',
      text: `Your BMI of ${bmi} indicates you are in the ${status} range.`,
    });
  }

  // 2. Blood Pressure (Systolic) Analysis
  if (prediction.ap_hi) {
    const sys = prediction.ap_hi;
    let status = '';
    let color = '';

    if (sys < 120) {
      status = 'Normal';
      color = 'text-green-500';
    } else if (sys >= 120 && sys < 130) {
      status = 'Elevated';
      color = 'text-yellow-500';
    } else if (sys >= 130 && sys < 140) {
      status = 'Stage 1 Hypertension';
      color = 'text-orange-500';
    } else {
      status = 'Stage 2 Hypertension';
      color = 'text-red-500';
    }

    insights.push({
      icon: Activity,
      color,
      title: 'Systolic Pressure',
      text: `Your systolic BP of ${sys} mmHg falls into the ${status} category.`,
    });
  }

  // 3. Pulse Pressure Analysis
  if (prediction.ap_hi && prediction.ap_lo) {
    const pp = prediction.ap_hi - prediction.ap_lo;
    let status = '';
    let color = '';

    if (pp < 40) {
      status = 'low (narrow)';
      color = 'text-yellow-500';
    } else if (pp >= 40 && pp <= 60) {
      status = 'healthy and optimal';
      color = 'text-green-500';
    } else {
      status = 'elevated (wide)';
      color = 'text-orange-500';
    }

    insights.push({
      icon: HeartPulse,
      color,
      title: 'Pulse Pressure',
      text: `Your pulse pressure of ${pp} mmHg is ${status}.`,
    });
  }

  // 4. Metabolic Profile
  if (prediction.cholesterol) {
    const chol = prediction.cholesterol;
    let status = '';
    let color = '';

    if (chol === 1) {
      status = 'Normal levels';
      color = 'text-green-500';
    } else if (chol === 2) {
      status = 'Above normal';
      color = 'text-orange-500';
    } else {
      status = 'Well above normal';
      color = 'text-red-500';
    }

    insights.push({
      icon: AlertCircle,
      color,
      title: 'Cholesterol Profile',
      text: `Your clinical lipid profile indicates ${status}.`,
    });
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, i) => (
        <div key={i} className="flex items-start gap-4 group">
          <div className={`w-10 h-10 rounded-xl bg-foreground/5 border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${insight.color} shadow-sm`}>
            <insight.icon className="w-5 h-5" />
          </div>
          <div className="pt-1">
            <h4 className="text-xs font-mono tracking-widest uppercase font-bold text-muted-foreground mb-0.5">{insight.title}</h4>
            <p className="text-sm text-foreground font-medium leading-relaxed">{insight.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
