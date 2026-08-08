'use client';
import { useState, useEffect } from 'react';
import { Prediction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Wine, Dumbbell, HeartPulse, Scale } from 'lucide-react';

interface Props {
  basePrediction: Prediction;
}

export default function WhatIfSimulator({ basePrediction }: Props) {
  const initialBmi = basePrediction.weight && basePrediction.height ? (basePrediction.weight / Math.pow(basePrediction.height / 100, 2)) : 22;

  const [simData, setSimData] = useState({
    bmi: Math.round(initialBmi),
    ap_hi: basePrediction.ap_hi || 120,
    ap_lo: basePrediction.ap_lo || 80,
    smoke: basePrediction.smoke === 1,
    alco: basePrediction.alco === 1,
    active: basePrediction.active === 1,
  });
  
  const [simRisk, setSimRisk] = useState(basePrediction.probability || 0);

  // Simple local simulation logic (since actual /predict API might be heavy to spam on slider drag)
  // We'll create a local heuristic based on the original probability
  useEffect(() => {
    let delta = 0;
    
    // BMI impact
    const bmiDiff = simData.bmi - Math.round(initialBmi);
    delta += bmiDiff * 1.5; 
    
    // BP impact
    const sysDiff = simData.ap_hi - (basePrediction.ap_hi || 120);
    const diaDiff = simData.ap_lo - (basePrediction.ap_lo || 80);
    delta += (sysDiff > 0 ? sysDiff * 0.6 : sysDiff * 0.3);
    delta += (diaDiff > 0 ? diaDiff * 0.5 : diaDiff * 0.2);
    
    // Lifestyle impacts
    if (simData.smoke && basePrediction.smoke !== 1) delta += 15;
    if (!simData.smoke && basePrediction.smoke === 1) delta -= 15;
    
    if (simData.alco && basePrediction.alco !== 1) delta += 5;
    if (!simData.alco && basePrediction.alco === 1) delta -= 5;
    
    if (simData.active && basePrediction.active !== 1) delta -= 10;
    if (!simData.active && basePrediction.active === 1) delta += 10;

    const baseRisk = basePrediction.probability || 0;
    let newRisk = baseRisk + delta;
    if (newRisk < 1) newRisk = 1;
    if (newRisk > 99) newRisk = 99;
    
    setSimRisk(newRisk);
  }, [simData, basePrediction]);

  // SVG Gauge Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  const dashoffset = halfCircumference - (simRisk / 100) * halfCircumference;
  
  const getColor = (r: number) => {
    if (r < 40) return '#22c55e'; // Green
    if (r < 70) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };
  const color = getColor(simRisk);

  return (
    <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
      <CardContent className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-bold">What-If Simulator</h3>
        </div>
        
        <div className="flex-1 flex flex-col gap-10 items-center justify-center">
          
          {/* Gauge Section */}
          <div className="flex flex-col items-center justify-center w-full relative">
            <div className="relative w-64 h-32 overflow-hidden mb-4">
              <svg className="w-64 h-64 absolute top-0 transform rotate-180 drop-shadow-md" viewBox="0 0 140 140">
                <circle
                  cx="70" cy="70" r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted/20"
                  strokeDasharray={`${halfCircumference} ${circumference}`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="70" cy="70" r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                  strokeDasharray={`${halfCircumference} ${circumference}`}
                  strokeDashoffset={dashoffset}
                />
              </svg>
            </div>
            
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-5xl font-heading font-bold" style={{ color }}>
                {Math.round(simRisk)}%
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest font-bold text-muted-foreground mt-1">
                {simRisk < 40 ? 'Low Risk' : simRisk < 70 ? 'Medium Risk' : 'High Risk'}
              </span>
            </div>
          </div>

          {/* Controls Section */}
          <div className="w-full flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="flex flex-col w-full">
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Scale className="w-3.5 h-3.5"/> BMI</span>
                  <span className="text-sm font-bold text-foreground bg-muted/50 px-2 rounded-md">{simData.bmi}</span>
                </div>
                <input 
                  type="range" min="15" max="45" 
                  value={simData.bmi} 
                  onChange={e => setSimData({...simData, bmi: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5"/> Systolic</span>
                  <span className="text-sm font-bold text-foreground bg-muted/50 px-2 rounded-md">{simData.ap_hi}</span>
                </div>
                <input 
                  type="range" min="90" max="200" 
                  value={simData.ap_hi} 
                  onChange={e => setSimData({...simData, ap_hi: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5"/> Diastolic</span>
                  <span className="text-sm font-bold text-foreground bg-muted/50 px-2 rounded-md">{simData.ap_lo}</span>
                </div>
                <input 
                  type="range" min="50" max="130" 
                  value={simData.ap_lo} 
                  onChange={e => setSimData({...simData, ap_lo: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
              <button 
                onClick={() => setSimData({...simData, smoke: !simData.smoke})}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${simData.smoke ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-sm' : 'bg-background border-border text-muted-foreground/50 hover:bg-muted/30 hover:text-muted-foreground'}`}
              >
                <Wind className="w-6 h-6 mb-2" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-center">Smoker</span>
              </button>
              <button 
                onClick={() => setSimData({...simData, alco: !simData.alco})}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${simData.alco ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-sm' : 'bg-background border-border text-muted-foreground/50 hover:bg-muted/30 hover:text-muted-foreground'}`}
              >
                <Wine className="w-6 h-6 mb-2" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-center">Alcohol</span>
              </button>
              <button 
                onClick={() => setSimData({...simData, active: !simData.active})}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${simData.active ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-sm' : 'bg-background border-border text-muted-foreground/50 hover:bg-muted/30 hover:text-muted-foreground'}`}
              >
                <Dumbbell className="w-6 h-6 mb-2" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-center">Active</span>
              </button>
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
