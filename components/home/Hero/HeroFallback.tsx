'use client';

import React from 'react';
import { Globe, MapPin, Zap, ShieldCheck } from 'lucide-react';

export default function HeroFallback() {
  return (
    <div className="w-full h-full min-h-[400px] bg-white/60 border border-[#E8DDCC] rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-subtle">
      <div className="w-20 h-20 rounded-full bg-nova-primary/40 flex items-center justify-center text-nova-dark animate-pulse">
        <Globe className="w-10 h-10 text-nova-accent" />
      </div>
      <div>
        <span className="text-xs font-mono font-bold uppercase text-nova-accent">2D Spatial Telemetry</span>
        <h3 className="font-display font-bold text-xl text-nova-text">
          Global EV Network Active
        </h3>
        <p className="text-xs text-nova-muted max-w-sm mx-auto mt-1">
          120,000+ charging stations synchronized across 48 countries. Full 2D GIS Map available in Explore mode.
        </p>
      </div>
    </div>
  );
}
