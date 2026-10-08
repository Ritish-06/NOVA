'use client';

import React, { useState } from 'react';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { Calculator, Zap, Clock, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';

export default function CalculatorPage() {
  const userVehicles = useNovaStore((state) => state.userVehicles);
  const activeVehicleId = useNovaStore((state) => state.activeVehicleId);

  const activeVehicle = userVehicles.find(v => v.id === activeVehicleId) || userVehicles[0];

  const [currentPct, setCurrentPct] = useState(15);
  const [targetPct, setTargetPct] = useState(80);
  const [batteryCapacity, setBatteryCapacity] = useState(activeVehicle?.batteryCapacityKwh || 75);
  const [chargingSpeedKw, setChargingSpeedKw] = useState(150);
  const [ratePerKwh, setRatePerKwh] = useState(0.48);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // Math Calculations
  const pctDelta = Math.max(0, targetPct - currentPct);
  const energyRequiredKwh = (pctDelta / 100) * batteryCapacity;
  
  // Real world charging curve adjustment factor (1.15x slower due to taper after 80%)
  const rawHours = chargingSpeedKw > 0 ? energyRequiredKwh / chargingSpeedKw : 0;
  const estMins = Math.round(rawHours * 60 * 1.15);
  const estCost = energyRequiredKwh * ratePerKwh;

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DDCC] text-xs font-semibold text-nova-accent">
            <Calculator className="w-3.5 h-3.5" />
            <span>EV Energy Physics</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-nova-text">
            EV Charge & Cost Calculator
          </h1>
          <p className="text-sm text-nova-muted font-light">
            Calculate exact energy requirement, charging session time, and cost for any electric vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Form Inputs (Left) */}
          <div className="md:col-span-6 nova-card p-6 bg-white space-y-5 shadow-subtle">
            <h3 className="font-display font-bold text-lg text-nova-text pb-2 border-b border-[#E8DDCC]">
              Session Parameters
            </h3>

            {/* Vehicle Preset Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-nova-dark uppercase">Vehicle Preset</label>
              <select
                value={activeVehicle?.id}
                onChange={(e) => {
                  const v = userVehicles.find(veh => veh.id === e.target.value);
                  if (v) setBatteryCapacity(v.batteryCapacityKwh);
                }}
                className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 text-xs font-semibold text-nova-dark focus:outline-none"
              >
                {userVehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.batteryCapacityKwh} kWh)
                  </option>
                ))}
              </select>
            </div>

            {/* Battery Slider inputs */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-nova-dark">
                  <span>Starting Battery State</span>
                  <span className="font-mono text-nova-accent">{currentPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="99"
                  value={currentPct}
                  onChange={(e) => setCurrentPct(Number(e.target.value))}
                  className="w-full accent-nova-accent"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-nova-dark">
                  <span>Target Charge Level</span>
                  <span className="font-mono text-nova-energy">{targetPct}%</span>
                </div>
                <input
                  type="range"
                  min={currentPct + 1}
                  max="100"
                  value={targetPct}
                  onChange={(e) => setTargetPct(Number(e.target.value))}
                  className="w-full accent-nova-energy"
                />
              </div>
            </div>

            {/* Speed & Rate inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-nova-dark uppercase">Charger Power (kW)</label>
                <input
                  type="number"
                  min="1"
                  value={chargingSpeedKw}
                  onChange={(e) => setChargingSpeedKw(Number(e.target.value))}
                  className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-mono font-bold text-nova-dark focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-nova-dark uppercase">Rate per kWh ({currencySymbol})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ratePerKwh}
                  onChange={(e) => setRatePerKwh(Number(e.target.value))}
                  className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 font-mono font-bold text-nova-dark focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card (Right) */}
          <div className="md:col-span-6 nova-card p-6 bg-nova-dark text-white space-y-6 shadow-elevated">
            <h3 className="font-display font-bold text-lg text-nova-primary pb-2 border-b border-white/10">
              Estimated Charge Summary
            </h3>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl space-y-1 border border-white/10">
                <span className="text-xs text-nova-primary/80 uppercase font-mono">Energy Required</span>
                <div className="font-display font-extrabold text-3xl text-white">
                  {energyRequiredKwh.toFixed(1)} <span className="text-lg font-normal">kWh</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl space-y-1 border border-white/10">
                  <span className="text-xs text-nova-primary/80 uppercase font-mono">Charging Time</span>
                  <div className="font-display font-extrabold text-2xl text-nova-energy-light">
                    {estMins} <span className="text-sm font-normal">mins</span>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl space-y-1 border border-white/10">
                  <span className="text-xs text-nova-primary/80 uppercase font-mono">Estimated Cost</span>
                  <div className="font-display font-extrabold text-2xl text-nova-accent">
                    {currencySymbol}{estCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Exact Disclaimer Requirement */}
            <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 text-xs text-nova-primary/90 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-nova-accent shrink-0 mt-0.5" />
              <p>
                Charging time is an estimate. Actual charging speed varies with vehicle, charger, temperature, battery state, and charging curve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
