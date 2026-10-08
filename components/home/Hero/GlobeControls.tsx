'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { MOCK_STATIONS } from '@/lib/db/mockData';

export default function GlobeControls() {
  const setGlobeCameraTarget = useNovaStore((state) => state.setGlobeCameraTarget);
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);

  const handleReset = () => {
    setSelectedStation(null);
    setGlobeCameraTarget({ lat: 20, lng: 0, zoom: 5 });
  };

  return (
    <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
      <button
        onClick={handleReset}
        className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DDCC] shadow-elevated text-xs font-semibold text-nova-dark hover:border-nova-accent hover:bg-white transition-all flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5 text-nova-accent" />
        <span>Reset Globe</span>
      </button>
    </div>
  );
}
