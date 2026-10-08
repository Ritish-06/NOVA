import { create } from 'zustand';
import { ChargingStation, Vehicle, FilterState, ActiveChargingSession, UserNotification, UserProfile } from '@/types';
import { PRELOADED_VEHICLES, MOCK_NOTIFICATIONS } from '@/lib/db/mockData';

interface NovaStoreState {
  // Navigation & Globe state
  selectedStation: ChargingStation | null;
  selectedCity: string | null;
  searchQuery: string;
  globeCameraTarget: { lat: number; lng: number; zoom?: number } | null;

  // Filter State
  filters: FilterState;

  // Vehicle Management
  userVehicles: Vehicle[];
  activeVehicleId: string;

  // Favorites
  favoriteStationIds: string[];

  // Active Session
  activeSession: ActiveChargingSession | null;

  // AI Assistant Drawer
  isAiDrawerOpen: boolean;

  // Notifications
  notifications: UserNotification[];

  // Auth User
  currentUser: UserProfile | null;

  // Actions
  setSelectedStation: (station: ChargingStation | null) => void;
  setSelectedCity: (city: string | null) => void;
  setSearchQuery: (query: string) => void;
  setGlobeCameraTarget: (target: { lat: number; lng: number; zoom?: number } | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setActiveVehicleId: (id: string) => void;

  // Favorites actions
  toggleFavoriteStation: (stationId: string) => void;

  // Session actions
  startChargingSession: (session: ActiveChargingSession) => void;
  updateChargingProgress: (energyAddedKwh: number, batteryPct: number, cost: number, remainingMins: number) => void;
  stopChargingSession: () => void;

  // AI & Notifications
  setAiDrawerOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;

  // Auth
  setCurrentUser: (user: UserProfile | null) => void;
}

const initialFilters: FilterState = {
  connectorType: 'ALL',
  minSpeedKw: 0,
  status: 'ALL',
  network: 'ALL',
  maxDistanceKm: 50,
  maxPrice: 2.0,
};

export const useNovaStore = create<NovaStoreState>((set) => ({
  selectedStation: null,
  selectedCity: null,
  searchQuery: '',
  globeCameraTarget: null,

  filters: initialFilters,

  userVehicles: PRELOADED_VEHICLES,
  activeVehicleId: PRELOADED_VEHICLES[0].id,

  favoriteStationIds: ['st-lon-01', 'st-che-01'],

  activeSession: null,

  isAiDrawerOpen: false,

  notifications: MOCK_NOTIFICATIONS,

  currentUser: {
    id: 'usr-1',
    name: 'Alex Mercer',
    email: 'alex.mercer@nova-ev.com',
    role: 'USER',
  },

  setSelectedStation: (station) => set({ selectedStation: station }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setGlobeCameraTarget: (target) => set({ globeCameraTarget: target }),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),

  addVehicle: (vehicleData) =>
    set((state) => {
      const newId = `veh-${Date.now()}`;
      const newVehicle: Vehicle = { ...vehicleData, id: newId };
      return { userVehicles: [...state.userVehicles, newVehicle], activeVehicleId: newId };
    }),

  updateVehicle: (id, vehicleData) =>
    set((state) => ({
      userVehicles: state.userVehicles.map((v) => (v.id === id ? { ...v, ...vehicleData } : v)),
    })),

  deleteVehicle: (id) =>
    set((state) => {
      const updated = state.userVehicles.filter((v) => v.id !== id);
      const nextActiveId = state.activeVehicleId === id ? (updated[0]?.id || '') : state.activeVehicleId;
      return { userVehicles: updated, activeVehicleId: nextActiveId };
    }),

  setActiveVehicleId: (id) => set({ activeVehicleId: id }),

  toggleFavoriteStation: (stationId) =>
    set((state) => {
      const isFav = state.favoriteStationIds.includes(stationId);
      const updated = isFav
        ? state.favoriteStationIds.filter((id) => id !== stationId)
        : [...state.favoriteStationIds, stationId];
      return { favoriteStationIds: updated };
    }),

  startChargingSession: (session) => set({ activeSession: session }),

  updateChargingProgress: (energyAddedKwh, batteryPct, cost, remainingMins) =>
    set((state) => {
      if (!state.activeSession) return {};
      return {
        activeSession: {
          ...state.activeSession,
          energyAddedKwh,
          currentBatteryPct: batteryPct,
          currentCost: cost,
          estimatedRemainingMins: remainingMins,
        },
      };
    }),

  stopChargingSession: () =>
    set((state) => {
      if (!state.activeSession) return {};
      return {
        activeSession: {
          ...state.activeSession,
          status: 'COMPLETED',
        },
      };
    }),

  setAiDrawerOpen: (open) => set({ isAiDrawerOpen: open }),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  setCurrentUser: (user) => set({ currentUser: user }),
}));
