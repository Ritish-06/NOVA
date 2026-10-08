'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScrollController() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const heroSection = document.querySelector('.hero-section');
    const heroHeadline = document.querySelector('.hero-headline');
    const globeContainer = document.querySelector('.hero-globe-container');

    if (!heroSection || !heroHeadline || !globeContainer) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    // Stage 1: Fade Headline
    timeline.to(heroHeadline, {
      opacity: 0.2,
      y: -40,
      ease: 'none',
    }, 0);

    // Stage 2 & 3: Scale Globe & Bring Camera Closer
    timeline.to(globeContainer, {
      scale: 1.15,
      y: 30,
      ease: 'none',
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
