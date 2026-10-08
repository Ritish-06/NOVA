'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair } from 'lucide-react';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { MOCK_STATIONS } from '@/lib/db/mockData';

export default function HeroActions() {
  const [loadingLocate, setLoadingLocate] = useState(false);
  const setGlobeCameraTarget = useNovaStore((state) => state.setGlobeCameraTarget);
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);

  const handleFindNearby = () => {
    setLoadingLocate(true);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoadingLocate(false);
          setGlobeCameraTarget({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 8 });
        },
        () => {
          setLoadingLocate(false);
          // Fallback to London coordinates
          setGlobeCameraTarget({ lat: 51.5074, lng: -0.1278, zoom: 8 });
          setSelectedStation(MOCK_STATIONS[0]);
        }
      );
    } else {
      setLoadingLocate(false);
      setGlobeCameraTarget({ lat: 51.5074, lng: -0.1278, zoom: 8 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
    >
      {/* Primary CTA */}
      <Link
        href="/explore"
        className="group px-8 py-4 rounded-2xl bg-nova-dark text-white font-semibold text-base hover:bg-[#52473D] transition-all duration-200 shadow-elevated flex items-center justify-center gap-3 hover:-translate-y-0.5"
      >
        <span>Explore Charging</span>
        <ArrowRight className="w-5 h-5 text-nova-primary group-hover:translate-x-1.5 transition-transform" />
      </Link>

      {/* Secondary CTA */}
      <button
        onClick={handleFindNearby}
        disabled={loadingLocate}
        className="px-7 py-4 rounded-2xl bg-white border border-[#D8CDBD] text-[#40372F] font-semibold text-base hover:border-nova-accent hover:bg-[#FAF7F2] transition-all shadow-subtle flex items-center justify-center gap-2"
      >
        <Crosshair className={`w-5 h-5 text-nova-energy ${loadingLocate ? 'animate-spin' : ''}`} />
        <span>{loadingLocate ? 'Locating...' : 'Find Nearby'}</span>
      </button>
    </motion.div>
  );
}
