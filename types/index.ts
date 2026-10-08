export type StationStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'OUT_OF_SERVICE' | 'UNKNOWN';
export type ConnectorType = 'CCS2' | 'Type 2' | 'CHAdeMO' | 'NACS';
export type DataSourceType = 'LIVE' | 'DEMO' | 'STATIC';

export interface ChargingConnector {
  id: string;
  stationId: string;
  type: ConnectorType;
  powerKw: number; // e.g. 50, 150, 250, 350
  status: StationStatus;
  pricePerKwh: number; // in local currency / USD / INR
  currency: string;
  sessionFee?: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string;
  networkId: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  address: string;
  openingHours: string;
  status: StationStatus;
  amenities: string[];
  connectors: ChargingConnector[];
  rating: number; // e.g. 4.8
  reviewsCount: number;
  dataSource: DataSourceType;
  providerName: string;
  lastUpdated: string;
  distanceKm?: number;
}

export interface ChargingNetwork {
  id: string;
  name: string;
  operator: string;
  coverageCountries: string[];
  stationCount: number;
  fastChargerCount: number;
  connectorTypes: ConnectorType[];
  maxPowerKw: number;
  supportPhone: string;
  website: string;
}

export interface Vehicle {
  id: string;
  userId?: string;
  brand: string;
  model: string;
  batteryCapacityKwh: number;
  rangeKm: number;
  connectorType: ConnectorType;
  maxChargeRateKw: number;
  isDefault?: boolean;
}

export interface TripStop {
  id: string;
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  arrivalBatteryPct: number;
  departureBatteryPct: number;
  chargeTimeMins: number;
  energyAddedKwh: number;
  cost: number;
  currency: string;
}

export interface TripPlan {
  id: string;
  origin: string;
  destination: string;
  vehicleId: string;
  totalDistanceKm: number;
  estimatedDriveTimeMins: number;
  totalChargeTimeMins: number;
  totalCost: number;
  currency: string;
  stops: TripStop[];
  createdAt: string;
  isDemo?: boolean;
}

export interface ActiveChargingSession {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  connectorId: string;
  connectorType: ConnectorType;
  powerKw: number;
  currentBatteryPct: number;
  targetBatteryPct: number;
  energyAddedKwh: number;
  currentCost: number;
  currency: string;
  startedAt: string;
  estimatedRemainingMins: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  isDemo: boolean;
}

export interface ChargingHistoryEntry {
  id: string;
  date: string;
  stationName: string;
  city: string;
  energyKwh: number;
  durationMins: number;
  cost: number;
  currency: string;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'SESSION' | 'STATION' | 'TRIP' | 'SYSTEM';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

export interface FilterState {
  connectorType: string;
  minSpeedKw: number;
  status: string;
  network: string;
  maxDistanceKm: number;
  maxPrice: number;
}
