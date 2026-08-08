"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, ShieldAlert, HeartPulse, CheckCircle2 } from "lucide-react";

const RISK_LEVELS = [
  {
    id: "low",
    label: "Low Risk",
    title: "Keep up your healthy habits",
    description: "Your biometric data indicates a low probability of cardiovascular disease within our timeframe. Continue monitoring your vitals regularly to maintain this healthy baseline.",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
    glowClass: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    icon: CheckCircle2,
    scoreRange: "0% - 39%"
  },
  {
    id: "medium",
    label: "Medium Risk",
    title: "Time for a checkup",
    description: "Our gradient boosting model has flagged moderate deviations in your vitals, such as elevated systolic BP or cholesterol. We recommend scheduling a routine checkup.",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500",
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    icon: Activity,
    scoreRange: "40% - 69%"
  },
  {
    id: "high",
    label: "High Risk",
    title: "Consult a cardiologist soon",
    description: "Critical biometric thresholds have been triggered. The model predicts a highly elevated risk probability based on trailing 7-day variance. Immediate clinical consultation is advised.",
    colorClass: "text-destructive",
    bgClass: "bg-destructive",
    glowClass: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    icon: ShieldAlert,
    scoreRange: "70% - 100%"
  }
];

export function RiskGauge({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLevel = RISK_LEVELS[activeIndex];

  return (
    <div className={cn("w-full max-w-4xl mx-auto rounded-[2rem] bg-gradient-to-br from-background to-primary/5 border border-primary/20 p-8 shadow-[0_20px_60px_-15px_rgba(0,93,172,0.15)] relative overflow-hidden backdrop-blur-sm", className)}>
      
      {/* Dynamic Background Glow based on active level (very subtle) */}
      <div 
        className={cn(
          "absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000 -z-10",
          activeIndex === 0 ? "bg-emerald-500/10" : activeIndex === 1 ? "bg-amber-500/10" : "bg-destructive/10"
        )}
      />

      {/* Segmented Controls */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
        {RISK_LEVELS.map((level, idx) => (
          <button
            key={level.id}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-2",
              activeIndex === idx 
                ? "bg-background shadow-md border-border text-foreground" 
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full transition-all duration-300", activeIndex === idx ? level.bgClass + " " + level.glowClass : "bg-muted-foreground")} />
            {level.label}
          </button>
        ))}
      </div>

      {/* Main Content Area (Cross-fading) */}
      <div className="min-h-[250px] flex items-center justify-center text-center px-4 relative">
        {RISK_LEVELS.map((level, idx) => {
          const isActive = activeIndex === idx;
          const Icon = level.icon;
          return (
            <div
              key={level.id}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out",
                isActive ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
              )}
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-background border border-border shadow-lg transition-colors duration-500", level.colorClass, level.glowClass)}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">{level.title}</h3>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-6">
                {level.description}
              </p>
              
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-background border border-border/50 text-sm font-mono text-muted-foreground">
                <HeartPulse className="w-4 h-4 text-primary" />
                Model Inference Range: <span className={cn("font-bold text-base", level.colorClass)}>{level.scoreRange}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
