import { ChargingStation, ChargingNetwork, ChargingConnector, StationStatus } from '@/types';
import { MOCK_STATIONS, MOCK_NETWORKS } from '@/lib/db/mockData';

export interface ProviderMetadata {
  providerName: string;
  sourceType: 'LIVE' | 'DEMO' | 'STATIC';
  timestamp: string;
  freshness: string;
}

export interface ChargingDataProvider {
  getStations(query?: { city?: string; country?: string; status?: string; minPowerKw?: number }): Promise<ChargingStation[]>;
  getStation(id: string): Promise<ChargingStation | null>;
  getAvailability(stationId: string): Promise<{ connectors: Partial<ChargingConnector>[]; metadata: ProviderMetadata }>;
  getPricing(stationId: string): Promise<{ connectors: Partial<ChargingConnector>[]; metadata: ProviderMetadata }>;
  getNetworks(): Promise<ChargingNetwork[]>;
}

export class NovaDemoProviderAdapter implements ChargingDataProvider {
  private name = 'NOVA OpenCharge Normalized Provider';

  async getStations(query?: { city?: string; country?: string; status?: string; minPowerKw?: number }): Promise<ChargingStation[]> {
    let result = [...MOCK_STATIONS];

    if (query?.city) {
      result = result.filter(s => s.city.toLowerCase().includes(query.city!.toLowerCase()));
    }
    if (query?.country) {
      result = result.filter(s => s.country.toLowerCase().includes(query.country!.toLowerCase()));
    }
    if (query?.status) {
      result = result.filter(s => s.status === query.status);
    }
    if (query?.minPowerKw) {
      result = result.filter(s => s.connectors.some(c => c.powerKw >= query.minPowerKw!));
    }

    return result;
  }

  async getStation(id: string): Promise<ChargingStation | null> {
    const station = MOCK_STATIONS.find(s => s.id === id);
    return station || null;
  }

  async getAvailability(stationId: string): Promise<{ connectors: Partial<ChargingConnector>[]; metadata: ProviderMetadata }> {
    const station = await this.getStation(stationId);
    if (!station) {
      return {
        connectors: [],
        metadata: {
          providerName: this.name,
          sourceType: 'DEMO',
          timestamp: new Date().toISOString(),
          freshness: 'Unknown',
        },
      };
    }

    return {
      connectors: station.connectors.map(c => ({
        id: c.id,
        status: c.status,
        powerKw: c.powerKw,
      })),
      metadata: {
        providerName: station.providerName || this.name,
        sourceType: station.dataSource,
        timestamp: new Date().toISOString(),
        freshness: station.lastUpdated,
      },
    };
  }

  async getPricing(stationId: string): Promise<{ connectors: Partial<ChargingConnector>[]; metadata: ProviderMetadata }> {
    const station = await this.getStation(stationId);
    if (!station) {
      return {
        connectors: [],
        metadata: {
          providerName: this.name,
          sourceType: 'DEMO',
          timestamp: new Date().toISOString(),
          freshness: 'Unknown',
        },
      };
    }

    return {
      connectors: station.connectors.map(c => ({
        id: c.id,
        pricePerKwh: c.pricePerKwh,
        currency: c.currency,
      })),
      metadata: {
        providerName: station.providerName || this.name,
        sourceType: station.dataSource,
        timestamp: new Date().toISOString(),
        freshness: station.lastUpdated,
      },
    };
  }

  async getNetworks(): Promise<ChargingNetwork[]> {
    return MOCK_NETWORKS;
  }
}

export const defaultChargingProvider = new NovaDemoProviderAdapter();
