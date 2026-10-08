'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChargingStation } from '@/types';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Compass,
  Radio,
  Zap,
  Globe2,
  Navigation,
  Star,
  Coffee,
  Wifi,
  Shield,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LeafletMapProps {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation) => void;
  center?: [number, number];
  zoom?: number;
}

// Map camera flyTo animation helper
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({
  stations,
  selectedStation,
  onSelectStation,
  center = [51.5074, -0.1278],
  zoom = 6,
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  // Default to reliable CartoDB Voyager theme so map tiles always render crystal clear
  const [mapTheme, setMapTheme] = useState<'voyager' | 'dark' | 'osm'>('voyager');
  const [radarActive, setRadarActive] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#F7F3EC] flex items-center justify-center text-nova-dark text-sm font-medium">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 animate-spin text-nova-accent" />
          <span>Loading Global EV GIS Map...</span>
        </div>
      </div>
    );
  }

  // Guaranteed reliable tile layer URLs
  const TILE_MAPS = {
    voyager: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB Voyager / OpenStreetMap',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB Dark Matter / OpenStreetMap',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
  };

  // Custom Futuristic Pulsing Marker Icons
  const createFuturisticIcon = (status: string, isSelected: boolean) => {
    const mainColor =
      status === 'AVAILABLE'
        ? '#10B981'
        : status === 'BUSY'
        ? '#F59E0B'
        : status === 'UNAVAILABLE'
        ? '#EF4444'
        : '#6B7280';

    const glowColor =
      status === 'AVAILABLE'
        ? 'rgba(16, 185, 129, 0.45)'
        : status === 'BUSY'
        ? 'rgba(245, 158, 11, 0.45)'
        : 'rgba(239, 68, 68, 0.45)';

    const scale = isSelected ? 'scale(1.3)' : 'scale(1)';
    const ringBorder = isSelected ? '3px solid #171513' : '2px solid #FFFFFF';

    const html = `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        ${
          radarActive
            ? `<div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                background: ${glowColor};
                animation: pulseGlow 1.8s infinite ease-in-out;
              "></div>`
            : ''
        }
        <div style="
          background: #171513;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: ${ringBorder};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
          transform: ${scale};
          transition: transform 0.25s ease;
          z-index: 10;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${mainColor}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-futuristic-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const mapCenter: [number, number] = selectedStation
    ? [selectedStation.latitude, selectedStation.longitude]
    : center;

  const quickCities: { name: string; coords: [number, number] }[] = [
    { name: 'London', coords: [51.5074, -0.1278] },
    { name: 'Dubai', coords: [25.2048, 55.2708] },
    { name: 'Singapore', coords: [1.3521, 103.8198] },
    { name: 'Chennai', coords: [13.0827, 80.2707] },
    { name: 'San Francisco', coords: [37.7749, -122.4194] },
    { name: 'Berlin', coords: [52.5200, 13.4050] },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F7F3EC] font-sans">
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.85); opacity: 0.85; }
          50% { transform: scale(1.4); opacity: 0.15; }
          100% { transform: scale(0.85); opacity: 0.85; }
        }
        .custom-futuristic-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 1rem !important;
          overflow: hidden !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 280px !important;
        }
      `}</style>

      {/* Floating HUD Top Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Map Theme Switcher */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#E8DDCC] p-1 rounded-full shadow-lg flex items-center gap-1 text-xs">
          <button
            onClick={() => setMapTheme('voyager')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              mapTheme === 'voyager'
                ? 'bg-nova-dark text-white shadow-subtle'
                : 'text-nova-muted hover:text-nova-dark hover:bg-nova-bg'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-nova-primary" />
            <span>Cyber Slate</span>
          </button>

          <button
            onClick={() => setMapTheme('dark')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              mapTheme === 'dark'
                ? 'bg-nova-dark text-white shadow-subtle'
                : 'text-nova-muted hover:text-nova-dark hover:bg-nova-bg'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-nova-accent" />
            <span>Dark Matrix</span>
          </button>

          <button
            onClick={() => setMapTheme('osm')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              mapTheme === 'osm'
                ? 'bg-nova-dark text-white shadow-subtle'
                : 'text-nova-muted hover:text-nova-dark hover:bg-nova-bg'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-nova-energy" />
            <span>Street Map</span>
          </button>
        </div>

        {/* Radar Pulse Toggle Button */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setRadarActive(!radarActive)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all flex items-center gap-2 shadow-lg ${
              radarActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white/95 text-nova-muted border-[#E8DDCC] hover:text-nova-dark'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${radarActive ? 'animate-pulse text-emerald-600' : ''}`} />
            <span>Radar Telemetry {radarActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Quick City Teleport Bar (Clean Floating Bar) */}
      <div className="absolute top-14 left-3 right-3 z-[400] flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto">
        <span className="text-[10px] font-mono font-bold text-nova-muted uppercase tracking-wider px-1 shrink-0 bg-white/80 px-2 py-1 rounded-full border border-[#E8DDCC]">
          Teleport City:
        </span>
        {quickCities.map((city) => (
          <button
            key={city.name}
            onClick={() => {
              onSelectStation({
                id: `teleport-${city.name}`,
                name: `${city.name} Central Charging Superhub`,
                networkId: 'net-supercharger',
                latitude: city.coords[0],
                longitude: city.coords[1],
                status: 'AVAILABLE',
                address: `${city.name} Grand Financial Boulevard`,
                city: city.name,
                country: 'Global',
                operator: 'NOVA Global Telemetry',
                openingHours: '24/7 Open',
                rating: 4.9,
                reviewsCount: 184,
                dataSource: 'LIVE',
                providerName: 'NOVA GIS Engine',
                lastUpdated: 'Just now',
                connectors: [
                  { id: 'c1', stationId: 'st1', type: 'CCS2', powerKw: 250, status: 'AVAILABLE', pricePerKwh: 0.45, currency: 'USD' },
                  { id: 'c2', stationId: 'st1', type: 'NACS', powerKw: 250, status: 'AVAILABLE', pricePerKwh: 0.45, currency: 'USD' }
                ],
                amenities: ['Café', 'Free WiFi', 'Restrooms', 'Air Conditioned Lounge'],
              });
            }}
            className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-nova-dark text-nova-dark hover:text-white text-[11px] font-bold border border-[#E8DDCC] shadow-subtle transition-all shrink-0"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* 2D GIS Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <ChangeView center={mapCenter} zoom={selectedStation ? 12 : zoom} />

        {/* Tile Layer */}
        <TileLayer
          key={mapTheme}
          attribution={TILE_MAPS[mapTheme].attribution}
          url={TILE_MAPS[mapTheme].url}
        />

        {/* Selected Station Search Circle */}
        {selectedStation && (
          <Circle
            center={[selectedStation.latitude, selectedStation.longitude]}
            radius={25000}
            pathOptions={{
              color: '#4A7C59',
              fillColor: '#4A7C59',
              fillOpacity: 0.08,
              dashArray: '6, 8',
              weight: 2,
            }}
          />
        )}

        {/* Station Markers with FULL INFORMATION POPUPS */}
        {stations.map((st) => (
          <Marker
            key={st.id}
            position={[st.latitude, st.longitude]}
            icon={createFuturisticIcon(st.status, selectedStation?.id === st.id)}
            eventHandlers={{
              click: () => onSelectStation(st),
            }}
          >
            <Popup>
              <div className="bg-white p-4 space-y-3 font-sans text-nova-dark">
                {/* Station Header */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#E8DDCC]">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-nova-accent uppercase">
                      {st.city}, {st.country}
                    </span>
                    <h4 className="font-display font-bold text-sm text-nova-dark leading-tight mt-0.5">
                      {st.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                    st.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {st.status}
                  </span>
                </div>

                {/* Address & Hours */}
                <div className="text-xs space-y-1 text-nova-muted">
                  <p>{st.address}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-medium text-nova-dark">{st.operator}</span>
                    <span className="flex items-center gap-1 text-nova-dark font-bold">
                      <Star className="w-3 h-3 text-nova-accent fill-nova-accent" />
                      <span>{st.rating} ({st.reviewsCount})</span>
                    </span>
                  </div>
                </div>

                {/* Connectors & Pricing */}
                <div className="p-2.5 rounded-xl bg-nova-bg border border-[#E8DDCC] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-nova-dark">{st.connectors[0]?.type} Charging</span>
                    <span className="text-nova-energy font-mono">{st.connectors[0]?.powerKw} kW DC</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-nova-muted">
                    <span>Pricing</span>
                    <span className="font-mono font-bold text-nova-dark">
                      {st.connectors[0]?.currency === 'GBP' ? '£' : st.connectors[0]?.currency === 'EUR' ? '€' : st.connectors[0]?.currency === 'INR' ? '₹' : '$'}
                      {st.connectors[0]?.pricePerKwh.toFixed(2)} / kWh
                    </span>
                  </div>
                </div>

                {/* Amenities Badges */}
                {st.amenities && st.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {st.amenities.slice(0, 3).map((am) => (
                      <span key={am} className="px-2 py-0.5 rounded bg-nova-bg text-[10px] font-semibold text-nova-dark border border-[#E8DDCC]">
                        {am}
                      </span>
                    ))}
                  </div>
                )}

                {/* Direct Action Link */}
                <Link
                  href={`/stations/${st.id}`}
                  className="w-full py-2.5 rounded-xl bg-nova-dark text-white font-bold text-xs hover:bg-nova-dark/90 transition-colors flex items-center justify-center gap-1.5 shadow-subtle block text-center"
                >
                  <Zap className="w-3.5 h-3.5 text-nova-primary inline" />
                  <span>Start Charging Session</span>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* SLIDEABLE & SCROLLABLE BOTTOM STATIONS CAROUSEL DRAWER */}
      <div className={`absolute bottom-0 left-0 right-0 z-[450] transition-all duration-300 ${
        isDrawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.75rem)]'
      }`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-[#E8DDCC] shadow-2xl p-3 sm:p-4 rounded-t-3xl space-y-3">
          
          {/* Drawer Handle & Toggle Bar */}
          <div className="flex items-center justify-between px-2 cursor-pointer" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-display font-bold text-xs text-nova-dark uppercase tracking-wider">
                Matching Charging Stations ({stations.length}) — Click card to focus map
              </span>
            </div>

            <button type="button" className="p-1 rounded-full bg-nova-bg hover:bg-[#E8DDCC] text-nova-dark transition-colors">
              {isDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Slideable Horizontal Card Carousel */}
          {isDrawerOpen && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
              {stations.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => onSelectStation(st)}
                    className={`shrink-0 w-64 sm:w-72 p-3.5 rounded-2xl border transition-all cursor-pointer snap-start space-y-2.5 ${
                      isSelected
                        ? 'bg-nova-bg border-nova-dark ring-2 ring-nova-accent/40 shadow-md'
                        : 'bg-white border-[#E8DDCC] hover:border-nova-accent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-nova-accent font-bold uppercase">{st.city}, {st.country}</span>
                        <h4 className="font-display font-bold text-xs text-nova-dark truncate max-w-[170px]">{st.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                        st.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {st.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-nova-muted truncate">{st.address}</p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8DDCC]">
                      <span className="font-mono font-bold text-nova-dark text-[11px]">
                        {st.connectors[0]?.powerKw} kW DC
                      </span>
                      <Link
                        href={`/stations/${st.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-nova-accent font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
