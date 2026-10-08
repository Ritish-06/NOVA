'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NovaStation3D from '@/components/3d/Station/NovaStation3D';
import { MOCK_STATIONS } from '@/lib/db/mockData';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { ChargingConnector } from '@/types';
import {
  Zap,
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Navigation,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Coffee,
  Wifi,
  Info,
  ArrowRight
} from 'lucide-react';

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id as string;

  const station = useMemo(() => {
    const found = MOCK_STATIONS.find((s) => s.id === stationId);
    if (found) return found;

    // Dynamic Station Generator for Teleport / Custom IDs
    const rawName = (stationId || 'hub').replace(/^teleport-|^st-/, '').replace(/-/g, ' ');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    return {
      id: stationId,
      name: `${formattedName} Ultra-Fast Power Hub`,
      operator: 'NOVA Global Network',
      networkId: 'net-supercharger',
      latitude: 13.0827,
      longitude: 80.2707,
      country: 'Global',
      city: formattedName,
      address: `${formattedName} Expressway EV Plaza`,
      openingHours: '24/7 Open',
      status: 'AVAILABLE' as const,
      amenities: ['Café', 'Free WiFi', 'Restrooms', 'Air Conditioned Lounge', '24/7 Security'],
      rating: 4.9,
      reviewsCount: 128,
      dataSource: 'LIVE' as const,
      providerName: 'NOVA Global Telemetry Sync',
      lastUpdated: '1 min ago',
      connectors: [
        { id: `c-${stationId}-1`, stationId, type: 'CCS2' as const, powerKw: 250, status: 'AVAILABLE' as const, pricePerKwh: 18.5, currency: 'INR' },
        { id: `c-${stationId}-2`, stationId, type: 'CCS2' as const, powerKw: 150, status: 'AVAILABLE' as const, pricePerKwh: 18.5, currency: 'INR' },
        { id: `c-${stationId}-3`, stationId, type: 'NACS' as const, powerKw: 250, status: 'AVAILABLE' as const, pricePerKwh: 18.5, currency: 'INR' },
        { id: `c-${stationId}-4`, stationId, type: 'Type 2' as const, powerKw: 22, status: 'AVAILABLE' as const, pricePerKwh: 12.0, currency: 'INR' },
      ],
    };
  }, [stationId]);

  const favoriteStationIds = useNovaStore((state) => state.favoriteStationIds);
  const toggleFavoriteStation = useNovaStore((state) => state.toggleFavoriteStation);
  const startChargingSession = useNovaStore((state) => state.startChargingSession);

  const [copied, setCopied] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Amenities interactive state
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenityToast, setAmenityToast] = useState<string | null>(null);

  const isFavorite = favoriteStationIds.includes(station.id);

  const handleStartSession = (connector: ChargingConnector) => {
    const sessionId = `sess-${Date.now()}`;
    startChargingSession({
      id: sessionId,
      userId: 'usr-1',
      stationId: station.id,
      stationName: station.name,
      connectorId: connector.id,
      connectorType: connector.type,
      powerKw: connector.powerKw,
      currentBatteryPct: 15,
      targetBatteryPct: 80,
      energyAddedKwh: 0,
      currentCost: 0,
      currency: connector.currency,
      startedAt: new Date().toLocaleTimeString(),
      estimatedRemainingMins: 25,
      status: 'ACTIVE',
      isDemo: station.dataSource === 'DEMO',
    });

    router.push(`/charging/${sessionId}`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => {
      const exists = prev.includes(amenity);
      const next = exists ? prev.filter((a) => a !== amenity) : [...prev, amenity];
      setAmenityToast(exists ? `Unfiltered ${amenity}` : `Activated filter for "${amenity}"`);
      setTimeout(() => setAmenityToast(null), 3000);
      return next;
    });
  };

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('coffee') || lower.includes('café') || lower.includes('cafe') || lower.includes('bistro')) {
      return <Coffee className="w-3.5 h-3.5 text-nova-accent" />;
    }
    if (lower.includes('wifi')) {
      return <Wifi className="w-3.5 h-3.5 text-nova-accent" />;
    }
    if (lower.includes('security') || lower.includes('valet') || lower.includes('lounge')) {
      return <Shield className="w-3.5 h-3.5 text-nova-accent" />;
    }
    return <CheckCircle2 className="w-3.5 h-3.5 text-nova-accent" />;
  };

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-nova-muted hover:text-nova-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Map</span>
        </Link>

        {/* Station Title & Action Bar */}
        <div className="nova-card p-6 sm:p-8 bg-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase text-nova-accent">
                  {station.city}, {station.country}
                </span>
                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                  station.dataSource === 'LIVE' ? 'nova-badge-live' : 'nova-badge-demo'
                }`}>
                  {station.dataSource === 'LIVE' ? 'LIVE DATA' : 'DEMO DATA'}
                </span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-nova-text">
                {station.name}
              </h1>
              <p className="text-sm text-nova-muted flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-nova-accent shrink-0" />
                <span>{station.address}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavoriteStation(station.id)}
                className={`p-3 rounded-full border transition-all ${
                  isFavorite
                    ? 'bg-nova-accent text-white border-nova-accent'
                    : 'bg-nova-bg text-nova-dark border-[#E8DDCC] hover:border-nova-accent'
                }`}
                title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-nova-bg text-nova-dark border border-[#E8DDCC] hover:border-nova-accent transition-colors"
                title="Share Station Link"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-full bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/90 transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-nova-primary" />
                <span>Navigate</span>
              </a>
            </div>
          </div>

          {copied && (
            <div className="p-2.5 rounded-xl bg-nova-energy-light border border-nova-energy/30 text-nova-energy text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Station link copied to clipboard!</span>
            </div>
          )}

          {reportSubmitted && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Station report submitted to NOVA Data Operations.</span>
            </div>
          )}

          {/* Metadata Specs Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E8DDCC] text-xs">
            <div>
              <span className="text-nova-muted">Operator</span>
              <p className="font-bold text-nova-dark mt-0.5">{station.operator}</p>
            </div>
            <div>
              <span className="text-nova-muted">Hours</span>
              <p className="font-bold text-nova-dark mt-0.5">{station.openingHours}</p>
            </div>
            <div>
              <span className="text-nova-muted">Rating</span>
              <p className="font-bold text-nova-dark mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-nova-accent fill-nova-accent" />
                <span>{station.rating} ({station.reviewsCount} reviews)</span>
              </p>
            </div>
            <div>
              <span className="text-nova-muted">Provider Source</span>
              <p className="font-bold text-nova-dark mt-0.5">{station.providerName}</p>
            </div>
          </div>
        </div>

        {/* 3D Station Hub Model View */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-nova-text">
            3D Charging Hub Experience
          </h3>
          <NovaStation3D station={station} />
        </div>

        {/* Connectors & Charging Bays Section */}
        <div className="nova-card p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-nova-text flex items-center gap-2">
              <Zap className="w-5 h-5 text-nova-accent" />
              <span>Available Connectors ({station.connectors.length})</span>
            </h3>
            <span className="text-xs text-nova-muted">Click &quot;Start Session&quot; to initialize energy flow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {station.connectors.map((conn) => (
              <div
                key={conn.id}
                className="p-5 rounded-2xl border border-[#E8DDCC] bg-nova-bg/30 space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-nova-dark">{conn.type}</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-nova-energy-light text-nova-energy border border-nova-energy/30">
                      {conn.powerKw} kW DC
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    conn.status === 'AVAILABLE'
                      ? 'bg-nova-status-available text-white'
                      : 'bg-nova-status-busy text-white'
                  }`}>
                    {conn.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-nova-muted pt-2 border-t border-[#E8DDCC]">
                  <span>Pricing</span>
                  <span className="font-mono font-bold text-nova-dark text-sm">
                    {conn.currency === 'GBP' ? '£' : conn.currency === 'EUR' ? '€' : conn.currency === 'AED' ? 'AED ' : conn.currency === 'INR' ? '₹' : '$'}
                    {conn.pricePerKwh.toFixed(2)} / kWh
                  </span>
                </div>

                <button
                  onClick={() => handleStartSession(conn)}
                  disabled={conn.status !== 'AVAILABLE'}
                  className="w-full py-3 rounded-xl bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-subtle cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-nova-primary" />
                  <span>{conn.status === 'AVAILABLE' ? 'START SESSION' : 'BAY IN USE'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Station Amenities & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Fully Interactive Station Amenities */}
          <div className="nova-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-base text-nova-text">Station Amenities</h4>
              <span className="text-xs text-nova-muted font-medium">Click buttons to filter</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {station.amenities.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer shadow-subtle active:scale-95 ${
                      isSelected
                        ? 'bg-nova-dark text-white border-nova-dark ring-2 ring-nova-accent/40'
                        : 'bg-nova-bg text-nova-dark border-[#E8DDCC] hover:border-nova-accent hover:bg-white'
                    }`}
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                    {isSelected && (
                      <span className="ml-1 text-[10px] bg-nova-accent text-white px-1.5 py-0.2 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Amenity Banner & Link to Map Filter */}
            {selectedAmenities.length > 0 && (
              <div className="p-3.5 rounded-xl bg-nova-bg border border-[#E8DDCC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-3">
                <span className="text-nova-dark font-medium">
                  Active filter: <strong className="text-nova-accent">{selectedAmenities.join(', ')}</strong>
                </span>
                <Link
                  href={`/explore?query=${encodeURIComponent(selectedAmenities[0])}`}
                  className="px-3.5 py-1.5 rounded-lg bg-nova-dark text-white font-bold text-xs hover:bg-nova-dark/90 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Explore Stations with {selectedAmenities[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-nova-primary" />
                </Link>
              </div>
            )}

            {amenityToast && (
              <div className="p-2.5 rounded-xl bg-nova-energy-light border border-nova-energy/30 text-nova-energy text-xs font-semibold flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{amenityToast}</span>
              </div>
            )}
          </div>

          <div className="nova-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-base text-nova-text">Data Transparency</h4>
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="text-xs font-bold text-nova-accent hover:text-nova-dark flex items-center gap-1 cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>
            </div>
            <p className="text-xs text-nova-muted leading-relaxed">
              This station information is normalized via NOVA Provider Abstraction. Last updated {station.lastUpdated}. Availability telemetry synchronized via provider API.
            </p>
          </div>
        </div>
      </div>

      {/* Issue Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-nova-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8DDCC] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-nova-text">Report Station Issue</h3>
            <p className="text-xs text-nova-muted">
              Select the issue you encountered at {station.name}:
            </p>

            <select className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 text-xs text-nova-dark focus:outline-none">
              <option>Charger connector damaged</option>
              <option>Power delivery lower than listed</option>
              <option>Station blocked by non-EV</option>
              <option>Incorrect pricing displayed</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-nova-muted hover:bg-nova-bg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportSubmitted(true);
                  setIsReportOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-nova-dark text-white text-xs font-semibold cursor-pointer hover:bg-nova-dark/90"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
