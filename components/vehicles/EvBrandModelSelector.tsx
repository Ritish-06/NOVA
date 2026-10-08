'use client';

import React, { useState, useMemo } from 'react';
import {
  GLOBAL_EV_CATALOG,
  POPULAR_BRANDS,
  getAllBrands,
  getModelsForBrand,
  EVModelSpec
} from '@/lib/db/evCatalog';
import { ConnectorType } from '@/types';
import { Search, Check, ChevronDown, Car, Zap, Sparkles } from 'lucide-react';

interface EvBrandModelSelectorProps {
  selectedBrand: string;
  selectedModel: string;
  batteryKwh: number;
  rangeKm: number;
  connectorType: ConnectorType;
  maxChargeKw: number;
  onVehicleChange: (specs: {
    brand: string;
    model: string;
    batteryCapacityKwh: number;
    rangeKm: number;
    connectorType: ConnectorType;
    maxChargeRateKw: number;
  }) => void;
}

export default function EvBrandModelSelector({
  selectedBrand,
  selectedModel,
  batteryKwh,
  rangeKm,
  connectorType,
  maxChargeKw,
  onVehicleChange,
}: EvBrandModelSelectorProps) {
  const [brandSearch, setBrandSearch] = useState('');
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const allBrands = useMemo(() => getAllBrands(), []);

  // Filtered brands based on search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return allBrands;
    return allBrands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));
  }, [brandSearch, allBrands]);

  // Available models for currently selected brand
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return getModelsForBrand(selectedBrand);
  }, [selectedBrand]);

  const handleSelectBrand = (brandName: string) => {
    const models = getModelsForBrand(brandName);
    const defaultModel = models[0] || {
      model: `${brandName} Standard EV`,
      batteryCapacityKwh: 65,
      rangeKm: 420,
      connectorType: 'CCS2',
      maxChargeRateKw: 100,
    };

    onVehicleChange({
      brand: brandName,
      model: defaultModel.model,
      batteryCapacityKwh: defaultModel.batteryCapacityKwh,
      rangeKm: defaultModel.rangeKm,
      connectorType: defaultModel.connectorType as ConnectorType,
      maxChargeRateKw: defaultModel.maxChargeRateKw,
    });

    setIsBrandOpen(false);
    setBrandSearch('');
  };

  const handleSelectModel = (modelName: string) => {
    const spec = availableModels.find((m) => m.model === modelName);
    if (spec) {
      onVehicleChange({
        brand: selectedBrand,
        model: spec.model,
        batteryCapacityKwh: spec.batteryCapacityKwh,
        rangeKm: spec.rangeKm,
        connectorType: spec.connectorType as ConnectorType,
        maxChargeRateKw: spec.maxChargeRateKw,
      });
    } else {
      onVehicleChange({
        brand: selectedBrand,
        model: modelName,
        batteryCapacityKwh: batteryKwh,
        rangeKm,
        connectorType,
        maxChargeRateKw: maxChargeKw,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* BRAND SEARCHABLE AUTOCOMPLETE DROPDOWN */}
      <div className="space-y-1 relative">
        <label className="text-[11px] font-bold text-nova-dark uppercase tracking-wider block">
          BRAND
        </label>

        {/* Selected Brand Button Trigger */}
        <button
          type="button"
          onClick={() => setIsBrandOpen(!isBrandOpen)}
          className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 text-xs font-bold text-nova-dark flex items-center justify-between hover:border-nova-accent focus:outline-none transition-colors"
        >
          <span className="flex items-center gap-2">
            <Car className="w-4 h-4 text-nova-accent" />
            <span>{selectedBrand || 'Select vehicle brand...'}</span>
          </span>
          <ChevronDown className={`w-4 h-4 text-nova-muted transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Searchable Brand Dropdown Panel */}
        {isBrandOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E8DDCC] rounded-2xl shadow-2xl p-3 space-y-3 max-h-80 overflow-y-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-nova-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="🔍 Search vehicle brand (e.g. BMW, Tesla, BYD)..."
                className="w-full bg-nova-bg pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-[#E8DDCC] focus:outline-none focus:border-nova-accent"
              />
            </div>

            {/* Popular Brands Section */}
            {!brandSearch && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono font-bold text-nova-muted uppercase tracking-wider block">
                  POPULAR BRANDS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_BRANDS.map((popBrand) => (
                    <button
                      key={popBrand}
                      type="button"
                      onClick={() => handleSelectBrand(popBrand)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        selectedBrand === popBrand
                          ? 'bg-nova-dark text-white border-nova-dark'
                          : 'bg-nova-bg text-nova-dark border-[#E8DDCC] hover:border-nova-accent hover:bg-white'
                      }`}
                    >
                      {popBrand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Brands A-Z List */}
            <div className="space-y-1 pt-1 border-t border-[#E8DDCC]">
              <span className="text-[10px] font-mono font-bold text-nova-muted uppercase tracking-wider block">
                ALL GLOBAL BRANDS ({filteredBrands.length})
              </span>
              <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                {filteredBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleSelectBrand(b)}
                    className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between hover:bg-nova-bg transition-colors ${
                      selectedBrand === b ? 'text-nova-accent font-bold bg-nova-bg' : 'text-nova-dark'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBrand === b && <Check className="w-3.5 h-3.5 text-nova-accent" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC MODEL DROPDOWN */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-nova-dark uppercase tracking-wider block">
          MODEL
        </label>

        <select
          value={selectedModel}
          onChange={(e) => handleSelectModel(e.target.value)}
          disabled={!selectedBrand}
          className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl p-3 text-xs font-bold text-nova-dark focus:outline-none focus:border-nova-accent disabled:opacity-50"
        >
          {availableModels.map((m) => (
            <option key={m.model} value={m.model}>
              {m.model} ({m.batteryCapacityKwh} kWh • {m.rangeKm} km)
            </option>
          ))}
          {/* Custom option fallback */}
          {!availableModels.some((m) => m.model === selectedModel) && (
            <option value={selectedModel}>{selectedModel}</option>
          )}
        </select>
      </div>

      {/* AUTO-POPULATED SPECS GRID */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-[10px] font-bold text-nova-dark uppercase tracking-wider block">
            BATTERY (kWh)
          </label>
          <input
            type="number"
            value={batteryKwh}
            onChange={(e) =>
              onVehicleChange({
                brand: selectedBrand,
                model: selectedModel,
                batteryCapacityKwh: Number(e.target.value),
                rangeKm,
                connectorType,
                maxChargeRateKw: maxChargeKw,
              })
            }
            className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-nova-dark uppercase tracking-wider block">
            EST. RANGE (km)
          </label>
          <input
            type="number"
            value={rangeKm}
            onChange={(e) =>
              onVehicleChange({
                brand: selectedBrand,
                model: selectedModel,
                batteryCapacityKwh: batteryKwh,
                rangeKm: Number(e.target.value),
                connectorType,
                maxChargeRateKw: maxChargeKw,
              })
            }
            className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-nova-dark uppercase tracking-wider block">
            CONNECTOR TYPE
          </label>
          <select
            value={connectorType}
            onChange={(e) =>
              onVehicleChange({
                brand: selectedBrand,
                model: selectedModel,
                batteryCapacityKwh: batteryKwh,
                rangeKm,
                connectorType: e.target.value as ConnectorType,
                maxChargeRateKw: maxChargeKw,
              })
            }
            className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
          >
            <option value="CCS2">CCS2</option>
            <option value="NACS">NACS (Tesla)</option>
            <option value="Type 2">Type 2 (AC)</option>
            <option value="CHAdeMO">CHAdeMO</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-nova-dark uppercase tracking-wider block">
            MAX CHARGE (kW)
          </label>
          <input
            type="number"
            value={maxChargeKw}
            onChange={(e) =>
              onVehicleChange({
                brand: selectedBrand,
                model: selectedModel,
                batteryCapacityKwh: batteryKwh,
                rangeKm,
                connectorType,
                maxChargeRateKw: Number(e.target.value),
              })
            }
            className="w-full mt-1 bg-nova-bg border border-[#E8DDCC] rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
