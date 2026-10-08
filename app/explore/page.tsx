'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MOCK_STATIONS, MOCK_NETWORKS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { ChargingStation } from '@/types';
import {
  Search,
  Filter,
  Zap,
  MapPin,
  Heart,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Building2,
  Navigation,
  Globe
} from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-nova-bg flex items-center justify-center text-nova-muted text-sm font-medium">
      Loading 2D GIS Map...
    </div>
  ),
});

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('ALL');
  const [minPower, setMinPower] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedNetwork, setSelectedNetwork] = useState('ALL');

  const selectedStation = useNovaStore((state) => state.selectedStation);
  const setSelectedStation = useNovaStore((state) => state.setSelectedStation);
  const favoriteStationIds = useNovaStore((state) => state.favoriteStationIds);
  const toggleFavoriteStation = useNovaStore((state) => state.toggleFavoriteStation);

  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  // Filter stations logic
  const filteredStations = MOCK_STATIONS.filter((st) => {
    if (query && !st.name.toLowerCase().includes(query.toLowerCase()) && !st.city.toLowerCase().includes(query.toLowerCase()) && !st.country.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    if (selectedConnector !== 'ALL' && !st.connectors.some((c) => c.type === selectedConnector)) {
      return false;
    }
    if (minPower > 0 && !st.connectors.some((c) => c.powerKw >= minPower)) {
      return false;
    }
    if (selectedStatus !== 'ALL' && st.status !== selectedStatus) {
      return false;
    }
    if (selectedNetwork !== 'ALL' && st.networkId !== selectedNetwork) {
      return false;
    }
    return true;
  });

  const resetAllFilters = () => {
    setQuery('');
    setSelectedConnector('ALL');
    setMinPower(0);
    setSelectedStatus('ALL');
    setSelectedNetwork('ALL');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nova-bg flex flex-col">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E8DDCC] px-4 sm:px-6 py-3.5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-nova-text">
            Explore Global Charging Map
          </h1>
          <p className="text-xs text-nova-muted">
            {filteredStations.length} stations available across 48 countries
          </p>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-nova-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city, country, or station..."
              className="w-full bg-nova-bg pl-9 pr-4 py-1.5 rounded-full text-xs font-medium border border-[#E8DDCC] focus:outline-none focus:border-nova-accent"
            />
          </div>

          {/* Mobile view switcher */}
          <div className="flex lg:hidden rounded-full bg-nova-bg border border-[#E8DDCC] p-1">
            <button
              onClick={() => setMobileTab('map')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                mobileTab === 'map' ? 'bg-nova-dark text-white' : 'text-nova-muted'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMobileTab('list')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                mobileTab === 'list' ? 'bg-nova-dark text-white' : 'text-nova-muted'
              }`}
            >
              List ({filteredStations.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
        
        {/* Left Column — Filters Drawer */}
        <div className="hidden lg:block lg:col-span-3 nova-card p-5 space-y-6 overflow-y-auto bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-nova-text">
              <SlidersHorizontal className="w-4 h-4 text-nova-accent" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetAllFilters}
              className="text-xs text-nova-muted hover:text-nova-dark flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Connector Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-nova-dark uppercase tracking-wider">
              Connector Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['ALL', 'CCS2', 'Type 2', 'NACS', 'CHAdeMO'].map((conn) => (
                <button
                  key={conn}
                  onClick={() => setSelectedConnector(conn)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    selectedConnector === conn
                      ? 'bg-nova-dark text-white border-nova-dark'
                      : 'bg-nova-bg text-nova-muted border-[#E8DDCC] hover:border-nova-accent'
                  }`}
                >
                  {conn}
                </button>
              ))}
            </div>
          </div>

          {/* Power Speed Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-nova-dark uppercase tracking-wider">
              Minimum Speed (kW)
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'Any Speed', val: 0 },
                { label: '50+ kW (Fast DC)', val: 50 },
                { label: '150+ kW (Ultra Fast)', val: 150 },
                { label: '250+ kW (Hyper Speed)', val: 250 },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setMinPower(item.val)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border ${
                    minPower === item.val
                      ? 'bg-nova-energy-light text-nova-energy border-nova-energy/40'
                      : 'bg-nova-bg text-nova-muted border-[#E8DDCC] hover:border-nova-accent'
                  }`}
                >
                  <span>{item.label}</span>
                  {minPower === item.val && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-nova-dark uppercase tracking-wider">
              Availability
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'All Bays', val: 'ALL' },
                { label: 'Available', val: 'AVAILABLE' },
                { label: 'In Use', val: 'BUSY' },
              ].map((st) => (
                <button
                  key={st.val}
                  onClick={() => setSelectedStatus(st.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    selectedStatus === st.val
                      ? 'bg-nova-dark text-white border-nova-dark'
                      : 'bg-nova-bg text-nova-muted border-[#E8DDCC] hover:border-nova-accent'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Network Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-nova-dark uppercase tracking-wider">
              Network Operator
            </label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full bg-nova-bg text-nova-dark border border-[#E8DDCC] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-nova-accent"
            >
              <option value="ALL">All Networks</option>
              {MOCK_NETWORKS.map((net) => (
                <option key={net.id} value={net.id}>
                  {net.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Column — Interactive 2D GIS Leaflet Map */}
        <div
          className={`lg:col-span-6 h-full rounded-2xl overflow-hidden shadow-subtle border border-[#E8DDCC] relative ${
            mobileTab === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <LeafletMap
            stations={filteredStations}
            selectedStation={selectedStation}
            onSelectStation={(st) => setSelectedStation(st)}
          />
        </div>

        {/* Right Column — Station Cards List */}
        <div
          className={`lg:col-span-3 nova-card p-4 space-y-4 overflow-y-auto bg-white ${
            mobileTab === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DDCC]">
            <h3 className="font-display font-bold text-sm text-nova-text">
              Matching Stations ({filteredStations.length})
            </h3>
          </div>

          {filteredStations.length === 0 ? (
            <div className="p-8 text-center text-nova-muted space-y-3">
              <p className="text-xs">No charging stations match your active filters.</p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-full bg-nova-dark text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredStations.map((st) => {
              const isFav = favoriteStationIds.includes(st.id);
              const isSelected = selectedStation?.id === st.id;

              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-nova-dark bg-nova-bg/60 shadow-subtle'
                      : 'border-[#E8DDCC] bg-white hover:border-nova-accent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-nova-accent font-bold uppercase">{st.city}, {st.country}</span>
                      <h4 className="font-display font-bold text-sm text-nova-text line-clamp-1">{st.name}</h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteStation(st.id);
                      }}
                      className="p-1 rounded-full hover:bg-nova-bg text-nova-muted hover:text-nova-dark"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-nova-accent text-nova-accent' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-nova-muted line-clamp-1">{st.address}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8DDCC] text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-nova-energy-light text-nova-energy">
                      {st.status}
                    </span>
                    <span className="font-mono font-semibold text-nova-dark">
                      {st.connectors[0]?.powerKw} kW
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      st.dataSource === 'LIVE' ? 'nova-badge-live' : 'nova-badge-demo'
                    }`}>
                      {st.dataSource === 'LIVE' ? 'LIVE DATA' : 'DEMO DATA'}
                    </span>

                    <Link
                      href={`/stations/${st.id}`}
                      className="text-xs font-semibold text-nova-dark hover:text-nova-accent flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
