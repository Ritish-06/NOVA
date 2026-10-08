'use client';

import React from 'react';
import HeroContent from './HeroContent';
import HeroActions from './HeroActions';
import HeroSearch from './HeroSearch';
import GlobeScene from './GlobeScene';
import HeroScrollController from './HeroScrollController';

export default function Hero() {
  return (
    <section className="hero-section relative min-h-screen w-full nova-noise-bg flex flex-col justify-between overflow-hidden pt-8 pb-12 lg:py-0">
      
      {/* GSAP Scroll Trigger Controller */}
      <HeroScrollController />

      {/* Main Hero Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 lg:pt-16">
        
        {/* Left Column: Headline, Supporting Text, CTAs, Search */}
        <div className="lg:col-span-6 space-y-6 z-10 flex flex-col justify-center">
          <HeroContent />
          <HeroActions />
          <HeroSearch />
        </div>

        {/* Right Column: Signature 3D Earth Globe */}
        <div className="hero-globe-container lg:col-span-6 h-[420px] sm:h-[520px] lg:h-[650px] relative w-full flex items-center justify-center">
          <GlobeScene />
        </div>
      </div>
    </section>
  );
}
