'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { Heart, MapPin, Zap, ArrowRight, Compass } from 'lucide-react';

export default function FavoritesPage() {
  const favoriteStationIds = useNovaStore((state) => state.favoriteStationIds);
  const toggleFavoriteStation = useNovaStore((state) => state.toggleFavoriteStation);

  const favoriteStations = MOCK_STATIONS.filter((s) => favoriteStationIds.includes(s.id));

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-nova-text">
              Saved Stations
            </h1>
            <p className="text-sm text-nova-muted mt-1">
              Your bookmarked EV charging hubs for quick trip access.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8DDCC] text-xs font-semibold text-nova-dark shadow-subtle">
            {favoriteStations.length} Stations Saved
          </span>
        </div>

        {favoriteStations.length === 0 ? (
          /* Empty State Requirement from Prompt Section 29 */
          <div className="nova-card p-12 text-center space-y-4 bg-white">
            <div className="w-16 h-16 rounded-full bg-nova-bg flex items-center justify-center text-nova-accent mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-nova-text">
                No saved stations yet.
              </h3>
              <p className="text-sm text-nova-muted">
                Find a charger worth remembering.
              </p>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/90 transition-all shadow-subtle"
            >
              <Compass className="w-4 h-4 text-nova-primary" />
              <span>Explore Charging Map</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteStations.map((station) => (
              <div key={station.id} className="nova-card p-6 bg-white space-y-4 flex flex-col justify-between shadow-subtle">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-nova-accent">{station.city}, {station.country}</span>
                    <button
                      onClick={() => toggleFavoriteStation(station.id)}
                      className="p-1 rounded-full text-nova-accent hover:bg-nova-bg"
                    >
                      <Heart className="w-5 h-5 fill-nova-accent" />
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-lg text-nova-text">{station.name}</h3>
                  <p className="text-xs text-nova-muted">{station.address}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8DDCC] text-xs">
                  <span className="font-mono font-bold text-nova-energy">{station.connectors[0]?.powerKw} kW DC</span>
                  <Link
                    href={`/stations/${station.id}`}
                    className="font-semibold text-nova-dark hover:text-nova-accent flex items-center gap-1"
                  >
                    <span>View Station</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
