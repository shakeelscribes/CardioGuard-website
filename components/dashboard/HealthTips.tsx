// components/dashboard/HealthTips.tsx
import { RiskLevel } from '@/types';
import { Apple, Dumbbell, Moon, Wind, Droplets, Utensils } from 'lucide-react';

const tipsByRisk: Record<string, Array<{ icon: any; tip: string; color: string }>> = {
  low: [
    { icon: Dumbbell, tip: 'Keep up your 30min daily exercise routine', color: 'text-emerald-500' },
    { icon: Apple, tip: 'Maintain a heart-healthy Mediterranean diet', color: 'text-orange-500' },
    { icon: Moon, tip: 'Continue prioritizing 7-8 hours of quality sleep', color: 'text-violet-500' },
    { icon: Wind, tip: 'Practice mindfulness to keep stress low', color: 'text-blue-500' },
  ],
  medium: [
    { icon: Dumbbell, tip: 'Increase exercise to 45min, 5x per week', color: 'text-orange-500' },
    { icon: Utensils, tip: 'Reduce sodium intake below 2,300mg/day', color: 'text-rose-500' },
    { icon: Droplets, tip: 'Drink at least 8 glasses of water daily', color: 'text-cyan-500' },
    { icon: Wind, tip: 'Add stress management techniques to your routine', color: 'text-violet-500' },
  ],
  high: [
    { icon: Apple, tip: 'Consult a cardiologist immediately', color: 'text-red-500' },
    { icon: Utensils, tip: 'Follow a strict low-sodium, low-fat diet', color: 'text-rose-500' },
    { icon: Dumbbell, tip: 'Start with light, supervised exercise only', color: 'text-orange-500' },
    { icon: Moon, tip: 'Stress reduction is critical — explore therapy', color: 'text-violet-500' },
  ],
  default: [
    { icon: Dumbbell, tip: 'Aim for 150 min of moderate exercise weekly', color: 'text-blue-500' },
    { icon: Apple, tip: 'Eat 5+ servings of fruits and vegetables daily', color: 'text-emerald-500' },
    { icon: Moon, tip: 'Sleep 7-9 hours for optimal heart health', color: 'text-violet-500' },
    { icon: Wind, tip: 'Practice deep breathing to manage stress', color: 'text-cyan-500' },
  ],
};

interface Props {
  riskLevel?: RiskLevel;
}

export default function HealthTips({ riskLevel }: Props) {
  const tips = tipsByRisk[riskLevel || 'default'] || tipsByRisk.default;

  return (
    <div className="space-y-4">
      {tips.map(({ icon: Icon, tip, color }, i) => (
        <div key={i} className="flex items-start gap-4 group">
          <div className={`w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${color} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-sm text-foreground font-medium leading-relaxed pt-2">{tip}</p>
        </div>
      ))}
    </div>
  );
}
