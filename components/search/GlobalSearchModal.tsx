'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { Search, MapPin, Zap, Globe, Building2, X } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'COUNTRY' | 'CITY' | 'STATION';
  stationId?: string;
  lat: number;
  lng: number;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const setGlobeCameraTarget = useNovaStore((state) => state.setGlobeCameraTarget);
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable items list
  const allResults: SearchResultItem[] = [];

  // Add distinct cities & countries
  const citiesMap = new Map<string, SearchResultItem>();
  MOCK_STATIONS.forEach((s) => {
    if (!citiesMap.has(s.city)) {
      citiesMap.set(s.city, {
        id: `city-${s.city}`,
        title: s.city,
        subtitle: `${s.country} • ${MOCK_STATIONS.filter(st => st.city === s.city).length} charging locations`,
        type: 'CITY',
        lat: s.latitude,
        lng: s.longitude,
      });
    }
  });
  citiesMap.forEach((item) => allResults.push(item));

  // Add individual stations
  MOCK_STATIONS.forEach((s) => {
    allResults.push({
      id: s.id,
      title: s.name,
      subtitle: `${s.address} • ${s.connectors.length} chargers • ${s.operator}`,
      type: 'STATION',
      stationId: s.id,
      lat: s.latitude,
      lng: s.longitude,
    });
  });

  const filtered = query.trim() === ''
    ? allResults.slice(0, 6)
    : allResults.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (item: SearchResultItem) => {
    setGlobeCameraTarget({ lat: item.lat, lng: item.lng, zoom: item.type === 'STATION' ? 12 : 7 });
    if (item.type === 'STATION' && item.stationId) {
      const st = MOCK_STATIONS.find(s => s.id === item.stationId);
      if (st) setSelectedStation(st);
      router.push(`/stations/${item.stationId}`);
    } else {
      router.push(`/explore?city=${encodeURIComponent(item.title)}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-nova-dark/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#E8DDCC] shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8DDCC] gap-3">
          <Search className="w-5 h-5 text-nova-accent shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, country, or station (e.g. London, Dubai, Chennai, Paris)..."
            className="w-full bg-transparent text-nova-text placeholder:text-nova-muted focus:outline-none text-base font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-nova-muted hover:text-nova-text hover:bg-nova-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-nova-bg">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-nova-muted">
              <p className="text-sm">No charging stations or locations found matching &quot;{query}&quot;.</p>
              <p className="text-xs mt-1">Try searching for &quot;London&quot;, &quot;Chennai&quot;, &quot;Dubai&quot;, or &quot;Paris&quot;.</p>
            </div>
          ) : (
            filtered.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-3 rounded-xl flex items-center justify-between hover:bg-nova-bg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-nova-primary/40 flex items-center justify-center text-nova-dark group-hover:bg-nova-dark group-hover:text-white transition-colors">
                      {item.type === 'CITY' ? (
                        <Building2 className="w-4 h-4" />
                      ) : item.type === 'COUNTRY' ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-nova-text group-hover:text-nova-dark">
                        {item.title}
                      </h4>
                      <p className="text-xs text-nova-muted line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-nova-bg text-nova-muted border border-[#E8DDCC] group-hover:border-nova-accent">
                    {item.type}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-nova-bg px-4 py-2.5 border-t border-[#E8DDCC] flex items-center justify-between text-xs text-nova-muted">
          <span>Quick search: try &quot;Chennai&quot; or &quot;Ionity&quot;</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white text-nova-text border border-[#E8DDCC] rounded text-[10px] font-mono">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
