'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1.0],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 max-w-2xl text-left"
    >
      {/* Brand Tagline Badge */}
      <motion.div variants={lineVariants} className="inline-flex items-center gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-nova-accent px-3 py-1 rounded-full bg-white border border-[#E8DDCC] shadow-subtle">
          Spatial EV Intelligence
        </span>
      </motion.div>

      {/* Main Hero Editorial Headline */}
      <motion.div variants={lineVariants} className="hero-headline uppercase">
        FIND POWER. <br />
        <span className="text-nova-accent">ANYWHERE.</span>
      </motion.div>

      {/* Short Supporting Text */}
      <motion.p
        variants={lineVariants}
        className="text-nova-muted text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-lg"
      >
        Discover EV charging stations across the world.
      </motion.p>
    </motion.div>
  );
}
