'use client';

import React from 'react';
import { MOCK_HISTORY } from '@/lib/db/mockData';
import { History, Zap, DollarSign, Calendar, Clock } from 'lucide-react';

export default function HistoryPage() {
  const totalEnergy = MOCK_HISTORY.reduce((acc, curr) => acc + curr.energyKwh, 0);
  const totalSpent = MOCK_HISTORY.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-3xl text-nova-text">
            Charging Session History
          </h1>
          <p className="text-sm text-nova-muted mt-1">
            Historical energy telemetry and billing receipts across the global network.
          </p>
        </div>

        {/* Compact Metrics Bar (Prompt Section 31: charts/metrics only where useful) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="nova-card p-5 bg-white space-y-1 shadow-subtle">
            <span className="text-xs font-mono text-nova-muted uppercase">Total Energy Added</span>
            <p className="font-display font-bold text-2xl text-nova-dark">{totalEnergy.toFixed(1)} kWh</p>
          </div>

          <div className="nova-card p-5 bg-white space-y-1 shadow-subtle">
            <span className="text-xs font-mono text-nova-muted uppercase">Sessions Completed</span>
            <p className="font-display font-bold text-2xl text-nova-energy">{MOCK_HISTORY.length}</p>
          </div>

          <div className="nova-card p-5 bg-white space-y-1 shadow-subtle col-span-2 md:col-span-1">
            <span className="text-xs font-mono text-nova-muted uppercase">Avg Session Duration</span>
            <p className="font-display font-bold text-2xl text-nova-accent">25 mins</p>
          </div>
        </div>

        {/* History Table */}
        <div className="nova-card bg-white shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-[#E8DDCC] font-display font-bold text-sm text-nova-text">
            Past Sessions
          </div>

          <div className="divide-y divide-[#E8DDCC]">
            {MOCK_HISTORY.map((entry) => (
              <div key={entry.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-nova-bg/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-nova-text">{entry.stationName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-nova-energy-light text-nova-energy">
                      {entry.status}
                    </span>
                  </div>
                  <p className="text-xs text-nova-muted flex items-center gap-3">
                    <span>{entry.city}</span>
                    <span>•</span>
                    <span>{entry.date}</span>
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-right">
                  <div>
                    <span className="text-nova-muted block">Energy</span>
                    <span className="font-mono font-bold text-nova-dark">{entry.energyKwh} kWh</span>
                  </div>
                  <div>
                    <span className="text-nova-muted block">Duration</span>
                    <span className="font-mono font-bold text-nova-dark">{entry.durationMins} mins</span>
                  </div>
                  <div>
                    <span className="text-nova-muted block">Cost</span>
                    <span className="font-mono font-bold text-nova-accent">
                      {entry.currency === 'GBP' ? '£' : entry.currency === 'INR' ? '₹' : 'AED '}{entry.cost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
