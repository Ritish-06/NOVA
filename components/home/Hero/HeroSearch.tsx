'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Zap, Building2, Globe, ArrowRight, X } from 'lucide-react';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const setGlobeCameraTarget = useNovaStore((state) => state.setGlobeCameraTarget);
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);

  // Build searchable items
  const popularCities = ['Chennai', 'Bengaluru', 'Dubai', 'London', 'Paris', 'New York', 'Tokyo', 'Singapore'];

  const filteredStations = query.trim() === ''
    ? MOCK_STATIONS.slice(0, 4)
    : MOCK_STATIONS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase()) ||
        s.country.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectCity = (cityName: string) => {
    const st = MOCK_STATIONS.find(s => s.city.toLowerCase() === cityName.toLowerCase());
    if (st) {
      setGlobeCameraTarget({ lat: st.latitude, lng: st.longitude, zoom: 7 });
    }
    router.push(`/explore?city=${encodeURIComponent(cityName)}`);
    setIsFocused(false);
  };

  const handleSelectStation = (station: typeof MOCK_STATIONS[0]) => {
    setSelectedStation(station);
    setGlobeCameraTarget({ lat: station.latitude, lng: station.longitude, zoom: 12 });
    router.push(`/stations/${station.id}`);
    setIsFocused(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="relative max-w-xl w-full pt-4"
    >
      {/* Search Input Bar */}
      <div
        className={`relative flex items-center bg-white rounded-2xl border transition-all duration-200 shadow-subtle ${
          isFocused ? 'border-nova-dark shadow-elevated ring-2 ring-nova-accent/20' : 'border-[#D8CDBD] hover:border-nova-accent'
        }`}
      >
        <div className="pl-4 pr-2 py-3.5 text-nova-accent flex items-center justify-center">
          <MapPin className="w-5 h-5 text-nova-accent" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where do you want to charge?"
          className="w-full bg-transparent py-3.5 pr-4 text-sm font-medium text-nova-text placeholder:text-nova-muted focus:outline-none"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 rounded-full text-nova-muted hover:text-nova-dark mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => {
            if (query) handleSelectCity(query);
            else setIsFocused(true);
          }}
          className="mr-2 p-2.5 rounded-xl bg-nova-dark text-white hover:bg-nova-dark/90 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown Autocomplete Menu */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E8DDCC] shadow-elevated z-30 overflow-hidden divide-y divide-nova-bg"
          >
            {/* Quick City Tags */}
            <div className="p-3 bg-nova-bg/40">
              <span className="text-[10px] font-mono font-bold uppercase text-nova-muted block mb-2">
                Popular Cities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDCC] text-xs font-semibold text-nova-dark hover:border-nova-accent transition-colors flex items-center gap-1"
                  >
                    <span>⌖ {city}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Station Suggestions */}
            <div className="p-2 max-h-60 overflow-y-auto divide-y divide-nova-bg">
              {filteredStations.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(st)}
                  className="w-full text-left p-2.5 rounded-xl flex items-center justify-between hover:bg-nova-bg transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-nova-primary/40 flex items-center justify-center text-nova-dark group-hover:bg-nova-dark group-hover:text-white transition-colors">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-nova-text group-hover:text-nova-dark">
                        {st.name}
                      </h4>
                      <p className="text-[11px] text-nova-muted">{st.city}, {st.country} • {st.connectors[0]?.powerKw} kW</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-nova-bg text-nova-muted">
                    {st.dataSource}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 bg-white flex items-center justify-between text-[11px] text-nova-muted">
              <span>Press ESC to close</span>
              <button
                onClick={() => setIsFocused(false)}
                className="font-semibold text-nova-dark hover:underline"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
