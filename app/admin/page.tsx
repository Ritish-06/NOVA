'use client';

import React, { useState } from 'react';
import { MOCK_STATIONS, MOCK_NETWORKS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';
import {
  Shield,
  Activity,
  Server,
  Zap,
  Building2,
  Users,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function AdminConsolePage() {
  const currentUser = useNovaStore((state) => state.currentUser);
  const [activeTab, setActiveTab] = useState<'stations' | 'networks' | 'providers' | 'users'>('stations');

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 nova-card p-6 bg-white shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nova-dark text-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-nova-accent" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-nova-text flex items-center gap-2">
                NOVA Admin Console
                <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-nova-energy-light text-nova-energy rounded border border-nova-energy/30">
                  RBAC Enforced
                </span>
              </h1>
              <p className="text-xs text-nova-muted">
                System telemetry, station catalog management, and provider sync adapters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nova-bg text-xs font-mono font-semibold text-nova-dark border border-[#E8DDCC]">
              <Activity className="w-3.5 h-3.5 text-nova-energy animate-pulse" />
              <span>API Health 99.98%</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#E8DDCC] pb-1">
          {[
            { id: 'stations', label: `Stations (${MOCK_STATIONS.length})`, icon: Zap },
            { id: 'networks', label: `Networks (${MOCK_NETWORKS.length})`, icon: Building2 },
            { id: 'providers', label: 'Data Providers & Health', icon: Server },
            { id: 'users', label: 'Users & Roles', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-nova-dark text-white shadow-subtle'
                    : 'text-nova-muted hover:text-nova-dark hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1 — Stations Management */}
        {activeTab === 'stations' && (
          <div className="nova-card bg-white shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-[#E8DDCC] flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-nova-text">Global Charging Station Index</h3>
              <button className="px-4 py-2 rounded-full bg-nova-dark text-white text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Station</span>
              </button>
            </div>

            <div className="divide-y divide-[#E8DDCC]">
              {MOCK_STATIONS.map((st) => (
                <div key={st.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-nova-text text-sm">{st.name}</span>
                    <p className="text-nova-muted">{st.city}, {st.country} • {st.operator}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      st.dataSource === 'LIVE' ? 'nova-badge-live' : 'nova-badge-demo'
                    }`}>
                      {st.dataSource}
                    </span>
                    <span className="font-mono font-bold text-nova-dark">{st.connectors.length} Bays</span>
                    <button className="text-nova-accent font-semibold hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2 — Networks Management */}
        {activeTab === 'networks' && (
          <div className="nova-card bg-white shadow-subtle p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-nova-text">Integrated Charging Operators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {MOCK_NETWORKS.map((net) => (
                <div key={net.id} className="p-4 rounded-xl border border-[#E8DDCC] bg-nova-bg/30 space-y-2">
                  <div className="flex justify-between font-bold text-nova-dark">
                    <span>{net.name}</span>
                    <span className="font-mono text-nova-accent">{net.maxPowerKw} kW</span>
                  </div>
                  <p className="text-nova-muted">{net.stationCount.toLocaleString()} Stations across {net.coverageCountries.length} countries</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3 — Data Providers & Health */}
        {activeTab === 'providers' && (
          <div className="nova-card bg-white shadow-subtle p-6 space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-nova-text">Data Provider Adapters Telemetry</h3>
            <div className="space-y-3">
              {[
                { name: 'OpenChargeMap API Adapter', status: 'ACTIVE', latency: '42ms', source: 'LIVE' },
                { name: 'Tesla Supercharger Sync Adapter', status: 'ACTIVE', latency: '68ms', source: 'LIVE' },
                { name: 'Ionity GmbH Direct Provider Adapter', status: 'ACTIVE', latency: '35ms', source: 'LIVE' },
                { name: 'Zeon Charging Adapter', status: 'ACTIVE', latency: '54ms', source: 'LIVE' },
                { name: 'NOVA Simulated Provider Adapter', status: 'DEMO', latency: '0ms', source: 'DEMO' },
              ].map((p) => (
                <div key={p.name} className="p-3.5 rounded-xl border border-[#E8DDCC] bg-nova-bg/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-nova-energy" />
                    <div>
                      <span className="font-bold text-nova-dark">{p.name}</span>
                      <span className="text-nova-muted block text-[10px]">Latency: {p.latency}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                    p.source === 'LIVE' ? 'nova-badge-live' : 'nova-badge-demo'
                  }`}>
                    {p.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4 — Users */}
        {activeTab === 'users' && (
          <div className="nova-card bg-white shadow-subtle p-6 space-y-3 text-xs">
            <h3 className="font-display font-bold text-base text-nova-text">Registered Platform Users</h3>
            <div className="p-3 bg-nova-bg rounded-xl flex items-center justify-between border border-[#E8DDCC]">
              <div>
                <span className="font-bold text-nova-dark">Alex Mercer</span>
                <span className="text-nova-muted block text-[10px]">alex.mercer@nova-ev.com</span>
              </div>
              <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-nova-dark text-white rounded">
                USER / ADMIN ACCESS
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
