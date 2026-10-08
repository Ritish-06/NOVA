'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation, MapPin, Zap, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-nova-bg flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-lg w-full nova-card p-8 sm:p-10 bg-white text-center space-y-6 shadow-elevated">
        
        {/* Radar Icon */}
        <div className="w-16 h-16 rounded-3xl bg-nova-energy-light border border-nova-energy/30 flex items-center justify-center mx-auto text-nova-energy">
          <Zap className="w-8 h-8 text-nova-accent animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-nova-accent tracking-widest block">
            404 — ROUTE OFFLINE
          </span>
          <h1 className="font-display font-bold text-3xl text-nova-text">
            Charging Station Not Found
          </h1>
          <p className="text-sm text-nova-muted leading-relaxed font-light">
            The requested charging station, route, or page URL could not be located in NOVA&apos;s global telemetry matrix.
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="pt-4 border-t border-[#E8DDCC] flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/explore"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-nova-dark text-white font-semibold text-xs hover:bg-nova-dark/90 transition-all flex items-center justify-center gap-2 shadow-subtle"
          >
            <MapPin className="w-4 h-4 text-nova-primary" />
            <span>Explore Global Map</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-nova-bg text-nova-dark font-semibold text-xs border border-[#E8DDCC] hover:border-nova-accent transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-nova-muted" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
