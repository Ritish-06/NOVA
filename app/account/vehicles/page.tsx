'use client';

import React, { useState } from 'react';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { Vehicle, ConnectorType } from '@/types';
import EvBrandModelSelector from '@/components/vehicles/EvBrandModelSelector';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
  Battery,
  Navigation,
  Edit2,
  X
} from 'lucide-react';

export default function VehiclesPage() {
  const userVehicles = useNovaStore((state) => state.userVehicles);
  const activeVehicleId = useNovaStore((state) => state.activeVehicleId);
  const setActiveVehicleId = useNovaStore((state) => state.setActiveVehicleId);
  const addVehicle = useNovaStore((state) => state.addVehicle);
  const deleteVehicle = useNovaStore((state) => state.deleteVehicle);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [brand, setBrand] = useState('Tesla');
  const [model, setModel] = useState('Model Y Long Range');
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState(75);
  const [rangeKm, setRangeKm] = useState(533);
  const [connectorType, setConnectorType] = useState<ConnectorType>('CCS2');
  const [maxChargeRateKw, setMaxChargeRateKw] = useState(250);

  const handleVehicleChange = (specs: {
    brand: string;
    model: string;
    batteryCapacityKwh: number;
    rangeKm: number;
    connectorType: ConnectorType;
    maxChargeRateKw: number;
  }) => {
    setBrand(specs.brand);
    setModel(specs.model);
    setBatteryCapacityKwh(specs.batteryCapacityKwh);
    setRangeKm(specs.rangeKm);
    setConnectorType(specs.connectorType);
    setMaxChargeRateKw(specs.maxChargeRateKw);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model) return;

    addVehicle({
      brand,
      model,
      batteryCapacityKwh: Number(batteryCapacityKwh),
      rangeKm: Number(rangeKm),
      connectorType,
      maxChargeRateKw: Number(maxChargeRateKw),
    });

    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-nova-text">
              My Electric Vehicles
            </h1>
            <p className="text-sm text-nova-muted mt-1">
              Manage your EV garage to get personalized charging speeds, range estimates, and trip planning.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-3 rounded-full bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/90 transition-all flex items-center gap-2 shadow-elevated"
          >
            <Plus className="w-4 h-4 text-nova-primary" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userVehicles.map((vehicle) => {
            const isActive = activeVehicleId === vehicle.id;

            return (
              <div
                key={vehicle.id}
                className={`nova-card p-6 space-y-4 transition-all relative ${
                  isActive
                    ? 'border-2 border-nova-dark bg-white shadow-elevated'
                    : 'bg-white/80 border-[#E8DDCC] hover:border-nova-accent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-nova-bg flex items-center justify-center text-nova-dark font-bold">
                      <Car className="w-5 h-5 text-nova-accent" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-nova-accent uppercase">
                        {vehicle.brand}
                      </span>
                      <h3 className="font-display font-bold text-lg text-nova-text">
                        {vehicle.model}
                      </h3>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="px-3 py-1 rounded-full bg-nova-energy-light text-nova-energy text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveVehicleId(vehicle.id)}
                      className="text-xs font-semibold text-nova-muted hover:text-nova-dark underline"
                    >
                      Set Active
                    </button>
                  )}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8DDCC] text-xs">
                  <div className="bg-nova-bg/50 p-2.5 rounded-lg space-y-0.5">
                    <span className="text-nova-muted text-[10px] uppercase">Battery</span>
                    <p className="font-mono font-bold text-nova-dark">{vehicle.batteryCapacityKwh} kWh</p>
                  </div>

                  <div className="bg-nova-bg/50 p-2.5 rounded-lg space-y-0.5">
                    <span className="text-nova-muted text-[10px] uppercase">Est Range</span>
                    <p className="font-mono font-bold text-nova-dark">{vehicle.rangeKm} km</p>
                  </div>

                  <div className="bg-nova-bg/50 p-2.5 rounded-lg space-y-0.5">
                    <span className="text-nova-muted text-[10px] uppercase">Connector</span>
                    <p className="font-mono font-bold text-nova-energy">{vehicle.connectorType}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-nova-muted">Max Charging Power:</span>
                  <span className="font-mono font-bold text-nova-dark">{vehicle.maxChargeRateKw} kW DC</span>
                </div>

                {!isActive && userVehicles.length > 1 && (
                  <div className="pt-2 border-t border-[#E8DDCC] flex justify-end">
                    <button
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="text-xs text-nova-status-unavailable hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-nova-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl border border-[#E8DDCC] p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DDCC]">
              <h3 className="font-display font-bold text-lg text-nova-text">ADD NEW ELECTRIC VEHICLE</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full text-nova-muted hover:text-nova-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BRAND -> MODEL ARCHITECTURE COMPONENT */}
            <EvBrandModelSelector
              selectedBrand={brand}
              selectedModel={model}
              batteryKwh={batteryCapacityKwh}
              rangeKm={rangeKm}
              connectorType={connectorType}
              maxChargeKw={maxChargeRateKw}
              onVehicleChange={handleVehicleChange}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DDCC]">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-nova-muted hover:bg-nova-bg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-nova-dark text-white text-xs font-bold shadow-subtle hover:bg-nova-dark/90 cursor-pointer"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
