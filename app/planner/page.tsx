'use client';

import React, { useState, useMemo } from 'react';
import NovaTrip3D from '@/components/3d/Trip/NovaTrip3D';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { PRELOADED_VEHICLES } from '@/lib/db/mockData';
import { GLOBAL_EV_CATALOG } from '@/lib/db/evCatalog';
import { TripPlan, Vehicle } from '@/types';
import { Navigation, MapPin, Zap, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const KNOWN_CITY_ROUTES: Record<string, number> = {
  'erode-salem': 65,
  'salem-erode': 65,
  'erode-bengaluru': 265,
  'bengaluru-erode': 265,
  'salem-bengaluru': 200,
  'bengaluru-salem': 200,
  'chennai-bengaluru': 345,
  'bengaluru-chennai': 345,
  'coimbatore-bengaluru': 365,
  'bengaluru-coimbatore': 365,
  'coimbatore-erode': 100,
  'erode-coimbatore': 100,
  'chennai-puducherry': 150,
  'puducherry-chennai': 150,
  'mumbai-pune': 150,
  'pune-mumbai': 150,
  'delhi-jaipur': 280,
  'jaipur-delhi': 280,
  'london-manchester': 335,
  'manchester-london': 335,
  'san francisco-los angeles': 615,
  'los angeles-san francisco': 615,
};

function getRouteDistance(originStr: string, destStr: string): number {
  const key = `${originStr.trim().toLowerCase()}-${destStr.trim().toLowerCase()}`;
  if (KNOWN_CITY_ROUTES[key]) return KNOWN_CITY_ROUTES[key];

  // Hash-based deterministic fallback for any unknown city pair
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  return 50 + (positiveHash % 450); // Generates a realistic distance between 50km and 500km
}

export default function PlannerPage() {
  const userVehicles = useNovaStore((state) => state.userVehicles);
  const activeVehicleId = useNovaStore((state) => state.activeVehicleId);
  const setActiveVehicleId = useNovaStore((state) => state.setActiveVehicleId);

  // Combine user custom vehicles with full global EV brand catalog
  const allAvailableEVs = useMemo(() => {
    const combined: Vehicle[] = [...userVehicles];
    
    // Add preloaded mock vehicles
    PRELOADED_VEHICLES.forEach((v) => {
      if (!combined.some((existing) => existing.id === v.id || (existing.brand === v.brand && existing.model === v.model))) {
        combined.push(v);
      }
    });

    // Add all global catalog vehicles across Tesla, BYD, BMW, Mercedes, Xiaomi, NIO, XPeng, Rivian, Lucid, etc.
    Object.entries(GLOBAL_EV_CATALOG).forEach(([brandName, models]) => {
      models.forEach((m, idx) => {
        if (!combined.some((existing) => existing.brand === brandName && existing.model === m.model)) {
          combined.push({
            id: `cat-${brandName.toLowerCase()}-${idx}`,
            brand: brandName,
            model: m.model,
            batteryCapacityKwh: m.batteryCapacityKwh,
            rangeKm: m.rangeKm,
            connectorType: m.connectorType as any,
            maxChargeRateKw: m.maxChargeRateKw,
          });
        }
      });
    });

    return combined;
  }, [userVehicles]);

  const selectedVehicle = allAvailableEVs.find((v) => v.id === activeVehicleId) || allAvailableEVs[0];

  const [origin, setOrigin] = useState('Erode');
  const [destination, setDestination] = useState('Salem');
  const [startBatteryPct, setStartBatteryPct] = useState(90);
  const [targetArrivalPct, setTargetArrivalPct] = useState(20);

  // Dynamic Trip Calculation based on inputs
  const calculatedTripPlan = useMemo((): TripPlan => {
    const totalDistanceKm = getRouteDistance(origin, destination);
    
    // Average speed ~ 60 km/h on highway
    const estimatedDriveTimeMins = Math.round((totalDistanceKm / 60) * 60);

    // EV range dynamics
    const realWorldRangeKm = selectedVehicle.rangeKm || 400;
    const startSoc = Math.max(10, Math.min(100, startBatteryPct));
    const maxUsableDistance = realWorldRangeKm * (startSoc / 100);

    // Check if charging stop is required
    const needsCharging = totalDistanceKm > maxUsableDistance * 0.85;

    let stops: TripPlan['stops'] = [];
    let totalChargeTimeMins = 0;
    let totalCost = 0;

    if (needsCharging) {
      // Calculate 1 charging stop
      const stopDistanceKm = Math.round(totalDistanceKm * 0.45);
      const arrivalSocAtStop = Math.max(12, Math.round(startSoc - (stopDistanceKm / realWorldRangeKm) * 100));
      const departureSocAtStop = 80;
      
      const energyNeededKwh = Number((selectedVehicle.batteryCapacityKwh * ((departureSocAtStop - arrivalSocAtStop) / 100)).toFixed(1));
      
      // Charge time based on max charge rate
      const chargePower = selectedVehicle.maxChargeRateKw || 50;
      const chargeMins = Math.max(12, Math.round((energyNeededKwh / chargePower) * 60 * 1.15));

      totalChargeTimeMins = chargeMins;
      const costPerKwh = 19.5; // INR rate
      totalCost = Math.round(energyNeededKwh * costPerKwh);

      const midWayCity = origin.toLowerCase().includes('erode') && destination.toLowerCase().includes('bengaluru')
        ? 'Salem Highway Charging Superhub'
        : `${origin}–${destination} Mid-Expressway Charging Hub`;

      stops.push({
        id: `stop-1-${Date.now()}`,
        stationId: 'st-mid-01',
        stationName: midWayCity,
        latitude: 11.6643,
        longitude: 78.1460,
        arrivalBatteryPct: arrivalSocAtStop,
        departureBatteryPct: departureSocAtStop,
        chargeTimeMins: chargeMins,
        energyAddedKwh: energyNeededKwh,
        cost: totalCost,
        currency: 'INR',
      });
    }

    const calculatedArrivalSoc = needsCharging
      ? Math.max(targetArrivalPct, Math.round(80 - ((totalDistanceKm * 0.55) / realWorldRangeKm) * 100))
      : Math.max(targetArrivalPct, Math.round(startSoc - (totalDistanceKm / realWorldRangeKm) * 100));

    return {
      id: `trip-${origin}-${destination}`,
      origin: origin.trim() || 'Origin',
      destination: destination.trim() || 'Destination',
      vehicleId: selectedVehicle.id,
      totalDistanceKm,
      estimatedDriveTimeMins,
      totalChargeTimeMins,
      totalCost,
      currency: 'INR',
      isDemo: true,
      createdAt: new Date().toISOString(),
      stops,
    };
  }, [origin, destination, selectedVehicle, startBatteryPct, targetArrivalPct]);

  // Expected arrival SoC calculation for display
  const arrivalSocDisplay = calculatedTripPlan.stops.length > 0
    ? calculatedTripPlan.stops[0].arrivalBatteryPct
    : Math.max(0, Math.round(startBatteryPct - (calculatedTripPlan.totalDistanceKm / selectedVehicle.rangeKm) * 100));

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DDCC] text-xs font-semibold text-nova-accent shadow-subtle">
            <Navigation className="w-3.5 h-3.5" />
            <span>Multi-Stop EV Intelligence</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-nova-text">
            Global EV Trip Planner
          </h1>
          <p className="text-sm text-nova-muted font-light">
            Plan long-distance journeys with optimized charging stops aligned with your EV&apos;s battery specs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Form */}
          <div className="lg:col-span-5 nova-card p-6 bg-white space-y-5 shadow-subtle">
            <h3 className="font-display font-bold text-lg text-nova-text pb-2 border-b border-[#E8DDCC]">
              Journey Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-nova-dark uppercase tracking-wider">Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Erode, Chennai, San Francisco"
                  className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
                />
              </div>

              <div>
                <label className="font-bold text-nova-dark uppercase tracking-wider">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Salem, Bengaluru, Los Angeles"
                  className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
                />
              </div>

              {/* SELECT ALL BRAND EV/S DROPDOWN */}
              <div>
                <label className="font-bold text-nova-dark uppercase tracking-wider block mb-1">
                  Selected EV Model
                </label>
                <select
                  value={selectedVehicle.id}
                  onChange={(e) => setActiveVehicleId(e.target.value)}
                  className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-bold text-nova-dark focus:outline-none focus:border-nova-accent text-xs cursor-pointer"
                >
                  {/* Group by Brand */}
                  {Array.from(new Set(allAvailableEVs.map((v) => v.brand))).sort().map((brandName) => (
                    <optgroup key={brandName} label={`⚡ ${brandName}`}>
                      {allAvailableEVs
                        .filter((v) => v.brand === brandName)
                        .map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.brand} {v.model} — {v.batteryCapacityKwh} kWh ({v.rangeKm} km)
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Selected EV Specs Summary Badge */}
              <div className="p-3 bg-nova-bg/60 rounded-xl border border-[#E8DDCC] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-nova-muted text-[10px] uppercase block">Battery & Max Speed</span>
                  <span className="font-bold text-nova-dark">{selectedVehicle.batteryCapacityKwh} kWh • {selectedVehicle.maxChargeRateKw} kW</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-nova-energy-light text-nova-energy font-bold text-[10px]">
                  {selectedVehicle.connectorType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-nova-dark uppercase tracking-wider">Departure SOC (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={startBatteryPct}
                    onChange={(e) => setStartBatteryPct(Number(e.target.value))}
                    className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-nova-dark uppercase tracking-wider">Target Arrival (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={targetArrivalPct}
                    onChange={(e) => setTargetArrivalPct(Number(e.target.value))}
                    className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trip Output & 3D Experience (Right) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 3D Animated Route */}
            <NovaTrip3D tripPlan={calculatedTripPlan} />

            {/* Route Summary */}
            <div className="nova-card p-6 bg-white space-y-6 shadow-subtle">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
                <div>
                  <h3 className="font-display font-bold text-xl text-nova-text">
                    {calculatedTripPlan.origin} → {calculatedTripPlan.destination}
                  </h3>
                  <p className="text-xs text-nova-muted mt-0.5">
                    Optimized for {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.batteryCapacityKwh} kWh)
                  </p>
                </div>

                {/* Dynamic Mode Badge */}
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${calculatedTripPlan.stops.length === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'nova-badge-demo'}`}>
                  {calculatedTripPlan.stops.length === 0 ? 'DIRECT ROUTE (0 STOPS)' : '1 CHARGING STOP'}
                </span>
              </div>

              {/* Specs Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-nova-bg p-3 rounded-xl">
                  <span className="text-nova-muted uppercase font-mono text-[10px]">Total Distance</span>
                  <p className="font-display font-extrabold text-lg text-nova-dark">{calculatedTripPlan.totalDistanceKm} km</p>
                </div>

                <div className="bg-nova-bg p-3 rounded-xl">
                  <span className="text-nova-muted uppercase font-mono text-[10px]">Drive Time</span>
                  <p className="font-display font-extrabold text-lg text-nova-dark">
                    {Math.floor(calculatedTripPlan.estimatedDriveTimeMins / 60)}h {calculatedTripPlan.estimatedDriveTimeMins % 60}m
                  </p>
                </div>

                <div className="bg-nova-bg p-3 rounded-xl">
                  <span className="text-nova-muted uppercase font-mono text-[10px]">Charging Time</span>
                  <p className={`font-display font-extrabold text-lg ${calculatedTripPlan.totalChargeTimeMins === 0 ? 'text-emerald-600' : 'text-nova-energy'}`}>
                    {calculatedTripPlan.totalChargeTimeMins > 0 ? `${calculatedTripPlan.totalChargeTimeMins} mins` : '0 mins (Direct)'}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Route Story */}
              <div className="space-y-4 pt-2">
                <h4 className="font-display font-bold text-sm text-nova-dark uppercase tracking-wider">
                  Recommended Charging Itinerary
                </h4>

                <div className="space-y-3 relative pl-6 border-l-2 border-[#E8DDCC]">
                  
                  {/* Start Point */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-nova-dark border-2 border-white" />
                    <div className="text-xs">
                      <span className="font-bold text-nova-dark">START: {calculatedTripPlan.origin}</span>
                      <p className="text-nova-muted">Departure with {selectedVehicle.brand} {selectedVehicle.model} at {startBatteryPct}% SoC</p>
                    </div>
                  </div>

                  {/* Charging Stop (If Required) */}
                  {calculatedTripPlan.stops.length > 0 ? (
                    calculatedTripPlan.stops.map((stop, idx) => (
                      <div key={stop.id} className="relative pt-2">
                        <span className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-nova-accent border-2 border-white" />
                        <div className="p-3.5 rounded-xl bg-nova-bg border border-[#E8DDCC] space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-nova-dark">STOP {idx + 1}: {stop.stationName}</span>
                            <span className="font-mono text-nova-energy font-bold">+{stop.chargeTimeMins} mins</span>
                          </div>
                          <p className="text-nova-muted">
                            Charge from {stop.arrivalBatteryPct}% → {stop.departureBatteryPct}% ({stop.energyAddedKwh} kWh via {selectedVehicle.connectorType})
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative pt-2">
                      <span className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Direct Drive — No Charging Stops Needed</span>
                        </div>
                        <p className="text-emerald-700">
                          {selectedVehicle.brand} {selectedVehicle.model}&apos;s battery capacity ({selectedVehicle.batteryCapacityKwh} kWh / {selectedVehicle.rangeKm} km) easily completes this {calculatedTripPlan.totalDistanceKm} km trip on a single charge.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Destination */}
                  <div className="relative pt-2">
                    <span className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-nova-energy border-2 border-white" />
                    <div className="text-xs">
                      <span className="font-bold text-nova-dark">DESTINATION: {calculatedTripPlan.destination}</span>
                      <p className="text-nova-muted">
                        Arrive with comfortable ~{arrivalSocDisplay}% SoC remaining (Target: {targetArrivalPct}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
