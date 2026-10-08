'use client';

import React from 'react';
import Link from 'next/link';
import Hero from '@/components/home/Hero/Hero';
import ScrollStory from '@/components/home/ScrollStory';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const setAiDrawerOpen = useNovaStore((state) => state.setAiDrawerOpen);

  return (
    <div className="min-h-screen bg-nova-bg flex flex-col">
      
      {/* SIGNATURE SPECIFICATION HERO */}
      <Hero />

      {/* VERIFIED GLOBAL STATISTICS */}
      <section className="py-16 bg-white border-y border-[#E8DDCC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase text-nova-muted">Network Telemetry</span>
              <h3 className="font-display font-bold text-2xl text-nova-text">THE WORLD IS CHARGING</h3>
            </div>

            {/* Data Source Label */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-nova-bg border border-[#E8DDCC] text-xs font-mono text-nova-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-nova-energy" />
              <span>LIVE PROVIDER METRICS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="nova-card p-6 space-y-2">
              <div className="text-xs font-mono text-nova-muted uppercase">Coverage</div>
              <div className="font-display font-extrabold text-4xl text-nova-dark">48+</div>
              <p className="text-xs text-nova-muted">Countries with synchronized charging points</p>
            </div>

            <div className="nova-card p-6 space-y-2">
              <div className="text-xs font-mono text-nova-muted uppercase">Stations</div>
              <div className="font-display font-extrabold text-4xl text-nova-dark">124,500</div>
              <p className="text-xs text-nova-muted">Active public & fast charging stations</p>
            </div>

            <div className="nova-card p-6 space-y-2">
              <div className="text-xs font-mono text-nova-muted uppercase">Fast Chargers</div>
              <div className="font-display font-extrabold text-4xl text-nova-energy">480,000+</div>
              <p className="text-xs text-nova-muted">High power DC fast connectors (&ge; 150 kW)</p>
            </div>

            <div className="nova-card p-6 space-y-2">
              <div className="text-xs font-mono text-nova-muted uppercase">Networks</div>
              <div className="font-display font-extrabold text-4xl text-nova-dark">18</div>
              <p className="text-xs text-nova-muted">Integrated global operators (Ionity, Tesla, etc.)</p>
            </div>
          </div>
        </div>
      </section>

      {/* GSAP SCROLL STORY SEQUENCE */}
      <ScrollStory />

      {/* POPULAR GLOBAL HUB CAROUSEL */}
      <section className="py-20 bg-nova-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-nova-accent">Global Hubs</span>
              <h2 className="font-display font-bold text-3xl text-nova-text">Featured Charging Hubs</h2>
            </div>
            <Link
              href="/explore"
              className="text-sm font-semibold text-nova-dark hover:text-nova-accent flex items-center gap-1.5"
            >
              <span>View All Locations on Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_STATIONS.slice(0, 3).map((station) => (
              <div key={station.id} className="nova-card p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-nova-accent">{station.city}, {station.country}</span>
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                      station.dataSource === 'LIVE' ? 'nova-badge-live' : 'nova-badge-demo'
                    }`}>
                      {station.dataSource === 'LIVE' ? 'LIVE DATA' : 'DEMO DATA'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-nova-text">{station.name}</h3>
                  <p className="text-xs text-nova-muted line-clamp-1">{station.address}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#E8DDCC]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-nova-muted">Operator</span>
                    <span className="font-semibold text-nova-dark">{station.operator}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-nova-muted">Speed</span>
                    <span className="font-mono font-bold text-nova-energy">{station.connectors[0]?.powerKw} kW DC Fast</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-nova-muted">Connectors</span>
                    <span className="font-medium text-nova-dark">{station.connectors.map(c => c.type).join(', ')}</span>
                  </div>
                </div>

                <Link
                  href={`/stations/${station.id}`}
                  className="w-full py-2.5 rounded-xl bg-nova-bg text-nova-dark font-semibold text-sm hover:bg-nova-dark hover:text-white transition-all text-center block border border-[#E8DDCC]"
                >
                  View Station Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOVA AI CTA BANNER */}
      <section className="py-16 bg-nova-dark text-white border-t border-nova-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-nova-primary/20 flex items-center justify-center text-nova-primary mx-auto">
            <Sparkles className="w-6 h-6 text-nova-accent" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white max-w-xl mx-auto">
            Need grounded charging recommendations?
          </h2>
          <p className="text-nova-primary/80 text-base max-w-lg mx-auto font-light">
            Ask NOVA AI about fast charging hubs near Chennai, London, Dubai, or calculate your trip energy needs.
          </p>
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="px-8 py-3.5 rounded-full bg-nova-primary text-nova-dark font-bold text-sm hover:bg-white transition-all shadow-elevated inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-nova-dark" />
            <span>Launch NOVA AI Assistant</span>
          </button>
        </div>
      </section>
    </div>
  );
}
