'use client';
// components/ui/RiskGauge.tsx - Animated circular risk gauge
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
  level?: RiskLevel;
}

const RISK_COLORS: Record<RiskLevel, { stroke: string; bg: string; text: string }> = {
  low: { stroke: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', text: 'text-green-500' },
  medium: { stroke: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', text: 'text-orange-500' },
  high: { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'text-red-500' },
};

export default function RiskGauge({
  score,
  size = 200,
  strokeWidth = 16,
  label = 'Risk Score',
  showLabel = true,
  level,
}: RiskGaugeProps) {
  const container = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // half circle
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  const riskLevel: RiskLevel = 
    (level?.toLowerCase() as RiskLevel) || 
    (score < 30 ? 'low' : score < 60 ? 'medium' : 'high');
  const colors = RISK_COLORS[riskLevel];

  const riskLabels = { low: 'Low Risk', medium: 'Moderate Risk', high: 'High Risk' };

  useGSAP(() => {
    gsap.fromTo(pathRef.current, 
      { strokeDashoffset: circumference },
      { strokeDashoffset: offset, duration: 1.8, ease: 'power3.out', delay: 0.3 }
    );
    
    gsap.fromTo(textRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.5 }
    );
    
    if (showLabel && badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.8 }
      );
    }
  }, { scope: container, dependencies: [score, level] });

  return (
    <div ref={container} className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size / 2 + strokeWidth }}>
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        >
          {/* Background track */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
          />
          {/* Animated fill */}
          <path
            ref={pathRef}
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>

        {/* Center score */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ bottom: strokeWidth / 2 }}
        >
          <span
            ref={textRef}
            className={cn("text-4xl font-bold font-heading", colors.text)}
          >
            {Math.round(progress)}
          </span>
          <span className="text-xs text-muted-foreground font-medium">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center gap-2">
          <div
            ref={badgeRef}
            className="px-3 py-1 rounded-full text-sm font-semibold opacity-0"
            style={{ backgroundColor: colors.bg, color: colors.stroke }}
          >
            {riskLabels[riskLevel]}
          </div>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      )}
    </div>
  );
}
