"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Activity } from "lucide-react";

export function VitalsMonitorCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-3xl p-5 w-full max-w-[280px] shadow-sm", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-heading font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Systolic BP <span className="text-[10px] text-muted-foreground font-mono mt-1">(ap_hi)</span>
        </span>
        <button className="flex items-center gap-1 bg-background border border-border hover:bg-muted transition-colors rounded-md px-2.5 py-1 text-[10px] font-bold text-foreground group">
          Full stats <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="mb-1">
        <span className="text-3xl font-bold font-mono tracking-tighter text-foreground">110-180</span>
        <span className="text-xl font-light text-muted-foreground ml-1">mmHg</span>
      </div>
      
      <div className="text-[11px] text-muted-foreground font-medium mb-6">
        Trailing 7-Day Variance
      </div>
      
      <div className="relative h-[90px] mb-6">
        <div className="absolute left-0 right-0 top-[45%] h-[1.5px] bg-border z-10" />
        <div className="absolute -top-[15%] right-0 bg-foreground text-background px-2 py-1 rounded-md text-[10px] font-bold z-20 shadow-md">
          Avg. 132
        </div>
        
        <div className="flex items-end justify-around h-full relative px-2">
          {/* Monday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[32px] mb-2 bg-gradient-to-b from-primary to-primary/60 rounded-full hover:scale-105 transition-transform relative" />
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Mo</div>
          </div>
          
          {/* Tuesday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[44px] mb-[14px] bg-gradient-to-b from-primary to-primary/60 rounded-full hover:scale-105 transition-transform relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-[1.5px] border-primary rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Tu</div>
          </div>
          
          {/* Wednesday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[25px] mb-3 bg-gradient-to-b from-primary to-primary/60 rounded-full hover:scale-105 transition-transform relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-[1.5px] border-primary rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">We</div>
          </div>
          
          {/* Thursday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[32px] mb-2.5 bg-gradient-to-b from-primary to-primary/60 rounded-full hover:scale-105 transition-transform relative" />
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Th</div>
          </div>
          
          {/* Friday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[50px] mb-[14px] bg-gradient-to-b from-destructive to-destructive/60 rounded-full hover:scale-105 transition-transform relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-[1.5px] border-destructive rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider text-destructive">Fr</div>
          </div>
          
          {/* Saturday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[38px] mb-3 bg-gradient-to-b from-primary to-primary/60 rounded-full hover:scale-105 transition-transform relative" />
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Sa</div>
          </div>
          
          {/* Sunday */}
          <div className="flex flex-col items-center gap-2 flex-1 z-20">
            <div className="flex flex-col items-center w-full">
              <div className="w-5 h-[28px] mb-[13px] bg-gradient-to-b from-primary to-primary/60 rounded-full hover:scale-105 transition-transform relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-[1.5px] border-primary rounded-full" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-[1.5px] border-primary rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Su</div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border pt-3">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-[10px] font-medium text-destructive">Spike Detected (Friday)</span>
          <span className="text-xs font-bold font-mono text-destructive">180</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[10px] font-medium text-muted-foreground">Normal Baseline</span>
          <span className="text-xs font-bold font-mono text-foreground">115</span>
        </div>
      </div>
    </div>
  );
}
