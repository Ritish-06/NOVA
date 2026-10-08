'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NovaEnergyFlow3D from '@/components/3d/Charging/NovaEnergyFlow3D';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { Zap, Activity, Clock, DollarSign, StopCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ChargingSessionPage() {
  const params = useParams();
  const router = useRouter();

  const activeSession = useNovaStore((state) => state.activeSession);
  const updateChargingProgress = useNovaStore((state) => state.updateChargingProgress);
  const stopChargingSession = useNovaStore((state) => state.stopChargingSession);

  // Interval simulation for charging progression
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'ACTIVE') return;

    const interval = setInterval(() => {
      const nextPct = Math.min(100, activeSession.currentBatteryPct + 1);
      const nextEnergy = Number((activeSession.energyAddedKwh + 0.35).toFixed(1));
      const nextCost = Number((activeSession.currentCost + 0.22).toFixed(2));
      const nextRemaining = Math.max(0, activeSession.estimatedRemainingMins - 1);

      updateChargingProgress(nextEnergy, nextPct, nextCost, nextRemaining);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeSession, updateChargingProgress]);

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-nova-bg flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-nova-text">No Active Charging Session</h2>
        <p className="text-sm text-nova-muted max-w-sm">
          Select a station from the Explore map to initialize a live charging session.
        </p>
        <button
          onClick={() => router.push('/explore')}
          className="px-6 py-3 rounded-full bg-nova-dark text-white font-semibold text-sm"
        >
          Go to Explore Map
        </button>
      </div>
    );
  }

  const handleStop = () => {
    stopChargingSession();
    router.push('/history');
  };

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/explore')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-nova-muted hover:text-nova-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Map</span>
          </button>

          {/* DEMO SESSION Tag */}
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            activeSession.isDemo ? 'nova-badge-demo' : 'nova-badge-live'
          }`}>
            {activeSession.isDemo ? 'DEMO SESSION' : 'LIVE SESSION'}
          </span>
        </div>

        {/* Live Metrics Header Card */}
        <div className="nova-card p-6 sm:p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCC]">
            <div>
              <div className="flex items-center gap-2 text-nova-energy font-bold text-xs">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>CHARGING TELEMETRY ACTIVE</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-nova-text mt-1">
                {activeSession.stationName}
              </h1>
            </div>

            <button
              onClick={handleStop}
              className="px-6 py-3 rounded-full bg-nova-status-unavailable text-white font-bold text-sm hover:bg-red-700 transition-all shadow-subtle flex items-center gap-2 self-start sm:self-auto"
            >
              <StopCircle className="w-4 h-4" />
              <span>STOP SESSION</span>
            </button>
          </div>

          {/* Large Battery Progress Radial / Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-mono text-nova-muted uppercase font-bold">State of Charge</span>
              <span className="font-display font-extrabold text-5xl text-nova-dark">
                {activeSession.currentBatteryPct}%
              </span>
            </div>

            <div className="w-full h-4 rounded-full bg-nova-bg border border-[#E8DDCC] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-nova-energy transition-all duration-500 shadow-glow-energy"
                style={{ width: `${activeSession.currentBatteryPct}%` }}
              />
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E8DDCC] text-xs">
            <div className="bg-nova-bg/50 p-3.5 rounded-xl space-y-1">
              <span className="text-nova-muted text-[10px] uppercase font-mono">Energy Added</span>
              <p className="font-display font-bold text-xl text-nova-dark">{activeSession.energyAddedKwh} kWh</p>
            </div>

            <div className="bg-nova-bg/50 p-3.5 rounded-xl space-y-1">
              <span className="text-nova-muted text-[10px] uppercase font-mono">Power Delivery</span>
              <p className="font-display font-bold text-xl text-nova-energy">{activeSession.powerKw} kW DC</p>
            </div>

            <div className="bg-nova-bg/50 p-3.5 rounded-xl space-y-1">
              <span className="text-nova-muted text-[10px] uppercase font-mono">Est. Remaining</span>
              <p className="font-display font-bold text-xl text-nova-dark">{activeSession.estimatedRemainingMins} mins</p>
            </div>

            <div className="bg-nova-bg/50 p-3.5 rounded-xl space-y-1">
              <span className="text-nova-muted text-[10px] uppercase font-mono">Accrued Cost</span>
              <p className="font-display font-bold text-xl text-nova-accent">
                {activeSession.currency === 'GBP' ? '£' : activeSession.currency === 'INR' ? '₹' : '$'}
                {activeSession.currentCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* 3D WebGL Energy Particle Flow Animation */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-nova-text">
            Grid to Battery Telemetry Flow
          </h3>
          <NovaEnergyFlow3D />
        </div>
      </div>
    </div>
  );
}
