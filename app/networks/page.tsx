'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_NETWORKS } from '@/lib/db/mockData';
import { Zap, Globe, Shield, ArrowRight, Phone, ExternalLink } from 'lucide-react';

export default function NetworksPage() {
  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DDCC] text-xs font-semibold text-nova-accent shadow-subtle">
            <Zap className="w-3.5 h-3.5" />
            <span>Global Charging Providers</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-nova-text">
            Global Charging Networks
          </h1>
          <p className="text-sm text-nova-muted font-light">
            NOVA isolates external charging networks behind normalized provider adapters for real-time status and pricing.
          </p>
        </div>

        {/* Networks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_NETWORKS.map((network) => (
            <div key={network.id} className="nova-card p-6 bg-white space-y-5 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-nova-accent uppercase">
                    {network.operator}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-nova-energy-light text-nova-energy border border-nova-energy/30">
                    Max {network.maxPowerKw} kW DC
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-nova-text">
                  {network.name}
                </h3>

                <p className="text-xs text-nova-muted flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-nova-accent shrink-0" />
                  <span>Coverage: {network.coverageCountries.join(', ')}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8DDCC] text-xs">
                <div className="bg-nova-bg p-2.5 rounded-xl space-y-0.5">
                  <span className="text-nova-muted text-[10px] uppercase">Stations</span>
                  <p className="font-mono font-bold text-nova-dark">{network.stationCount.toLocaleString()}</p>
                </div>

                <div className="bg-nova-bg p-2.5 rounded-xl space-y-0.5">
                  <span className="text-nova-muted text-[10px] uppercase">Fast Chargers</span>
                  <p className="font-mono font-bold text-nova-energy">{network.fastChargerCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8DDCC] text-xs text-nova-muted">
                <span>Connectors: {network.connectorTypes.join(', ')}</span>
                <a
                  href={network.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-nova-dark hover:text-nova-accent flex items-center gap-1"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
