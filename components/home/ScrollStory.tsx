'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Shield, MapPin, Zap, ArrowRight, BatteryCharging, Navigation, Award } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('.story-step');

    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelector('.story-content'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const storySteps = [
    {
      num: '01',
      tag: 'WORLD',
      title: 'THE WORLD IS CHARGING.',
      desc: 'Over 120,000 verified charging points connected across 6 continents, pulsing in real time.',
      icon: Globe,
    },
    {
      num: '02',
      tag: 'CONTINENTS',
      title: 'CROSS-BORDER MOBILITY.',
      desc: 'Seamless transit along trans-European, North American, Asian, and Middle Eastern EV corridors.',
      icon: Navigation,
    },
    {
      num: '03',
      tag: 'COUNTRY',
      title: 'NATIONAL INFRASTRUCTURE.',
      desc: 'Direct synchronization with grid operators and national EV power networks.',
      icon: Shield,
    },
    {
      num: '04',
      tag: 'CITY',
      title: 'METROPOLITAN HUBS.',
      desc: 'Instant discovery across major global metropolitan centers: London, Dubai, Chennai, Paris, Tokyo, NYC.',
      icon: MapPin,
    },
    {
      num: '05',
      tag: 'NETWORK',
      title: 'OPEN NETWORK ADAPTERS.',
      desc: 'Normalized data from Tesla Supercharger, Ionity, ChargePoint, Tata Power EZ Charge, and Shell Recharge.',
      icon: Zap,
    },
    {
      num: '06',
      tag: 'STATION',
      title: 'STATION INTELLIGENCE.',
      desc: 'Real-time bay occupancy, connector health, pricing per kWh, opening hours, and verified amenities.',
      icon: Award,
    },
    {
      num: '07',
      tag: 'CHARGER',
      title: '350 KW ULTRA FAST DC.',
      desc: 'Filtered by exact vehicle compatibility: CCS2, NACS, Type 2, and CHAdeMO.',
      icon: Zap,
    },
    {
      num: '08',
      tag: 'CHARGE',
      title: 'ENERGY IN MOTION.',
      desc: 'Precision charging time, cost estimation, and live session telemetry.',
      icon: BatteryCharging,
    },
    {
      num: '09',
      tag: 'JOURNEY',
      title: 'WHEREVER YOU GO, NOVA KEEPS YOU MOVING.',
      desc: 'Plan multi-stop journeys with optimized battery state of charge at every stop.',
      icon: Navigation,
      isFinal: true,
    },
  ];

  return (
    <section ref={containerRef} className="relative py-24 bg-nova-bg overflow-hidden border-t border-[#E8DDCC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-nova-accent px-3 py-1 rounded-full bg-white border border-[#E8DDCC]">
            The Journey Sequence
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-nova-text tracking-tight">
            Built like a living world.
          </h2>
          <p className="text-nova-muted text-base">
            Travel through the global EV infrastructure layer from orbital view to your next charge.
          </p>
        </div>

        {/* Story Sequence Steps */}
        <div className="relative space-y-24">
          
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E8DDCC] to-transparent -translate-x-1/2 hidden sm:block" />

          {storySteps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={step.num}
                className="story-step relative grid grid-cols-1 sm:grid-cols-2 gap-8 items-center"
              >
                
                {/* Timeline Circle */}
                <div className="absolute left-6 sm:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-nova-accent flex items-center justify-center font-mono text-xs font-bold text-nova-dark shadow-subtle z-10 hidden sm:flex">
                  {step.num}
                </div>

                {/* Content Box */}
                <div
                  className={`story-content nova-card p-6 sm:p-8 space-y-4 ${
                    isEven ? 'sm:col-start-1 sm:text-right' : 'sm:col-start-2 sm:text-left'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-nova-accent text-xs font-mono font-bold tracking-wider ${
                      isEven ? 'sm:justify-end' : 'sm:justify-start'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-nova-energy" />
                    <span>SECTION {step.num} — {step.tag}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-nova-text">
                    {step.title}
                  </h3>

                  <p className="text-nova-muted text-sm sm:text-base leading-relaxed">
                    {step.desc}
                  </p>

                  {step.isFinal && (
                    <div className="pt-4 flex justify-start sm:justify-end">
                      <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/90 transition-all shadow-elevated group"
                      >
                        <span>FIND A CHARGER</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
