'use client';

import { useState, useEffect } from 'react';

export type PerformanceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PerformanceConfig {
  tier: PerformanceTier;
  particleCount: number;
  enableArcs: boolean;
  enableAtmosphere: boolean;
  pixelRatio: number;
}

export function useDevicePerformance(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>({
    tier: 'HIGH',
    particleCount: 200,
    enableArcs: true,
    enableAtmosphere: true,
    pixelRatio: 2,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect hardware concurrency and mobile user agent
    const logicalCores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const screenWidth = window.innerWidth;

    if (isMobile || screenWidth < 768 || logicalCores <= 2) {
      setConfig({
        tier: 'LOW',
        particleCount: 50,
        enableArcs: false,
        enableAtmosphere: false,
        pixelRatio: 1,
      });
    } else if (logicalCores <= 4 || screenWidth < 1024) {
      setConfig({
        tier: 'MEDIUM',
        particleCount: 100,
        enableArcs: true,
        enableAtmosphere: true,
        pixelRatio: 1.5,
      });
    } else {
      setConfig({
        tier: 'HIGH',
        particleCount: 200,
        enableArcs: true,
        enableAtmosphere: true,
        pixelRatio: 2,
      });
    }
  }, []);

  return config;
}
