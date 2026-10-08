'use client';

import React from 'react';
import Link from 'next/link';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { User, Car, Heart, History, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const currentUser = useNovaStore((state) => state.currentUser);
  const userVehicles = useNovaStore((state) => state.userVehicles);
  const favoriteStationIds = useNovaStore((state) => state.favoriteStationIds);
  const notifications = useNovaStore((state) => state.notifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header */}
        <div className="nova-card p-6 sm:p-8 bg-white flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-nova-dark text-white font-display font-bold text-xl flex items-center justify-center">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-nova-text">
                {currentUser?.name || 'Alex Mercer'}
              </h1>
              <p className="text-xs text-nova-muted">{currentUser?.email || 'alex.mercer@nova-ev.com'}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-nova-bg text-nova-accent border border-[#E8DDCC]">
                Role: {currentUser?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Navigation Grid (Prompt Section 30) */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-nova-dark uppercase tracking-wider px-1">
            Account Management
          </h3>

          <div className="nova-card bg-white divide-y divide-[#E8DDCC] shadow-subtle overflow-hidden">
            
            <Link
              href="/account/vehicles"
              className="p-4 flex items-center justify-between hover:bg-nova-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-nova-accent" />
                <div>
                  <h4 className="font-semibold text-sm text-nova-text">My EV Vehicles</h4>
                  <p className="text-xs text-nova-muted">{userVehicles.length} vehicles registered</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-nova-muted" />
            </Link>

            <Link
              href="/favorites"
              className="p-4 flex items-center justify-between hover:bg-nova-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-nova-accent" />
                <div>
                  <h4 className="font-semibold text-sm text-nova-text">Saved Stations</h4>
                  <p className="text-xs text-nova-muted">{favoriteStationIds.length} bookmarked locations</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-nova-muted" />
            </Link>

            <Link
              href="/history"
              className="p-4 flex items-center justify-between hover:bg-nova-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-nova-accent" />
                <div>
                  <h4 className="font-semibold text-sm text-nova-text">Charging History</h4>
                  <p className="text-xs text-nova-muted">View past session logs & receipts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-nova-muted" />
            </Link>

            <Link
              href="/notifications"
              className="p-4 flex items-center justify-between hover:bg-nova-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-nova-accent" />
                <div>
                  <h4 className="font-semibold text-sm text-nova-text">Notifications</h4>
                  <p className="text-xs text-nova-muted">{unreadCount} unread alerts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-nova-muted" />
            </Link>

            <Link
              href="/admin"
              className="p-4 flex items-center justify-between hover:bg-nova-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-nova-accent" />
                <div>
                  <h4 className="font-semibold text-sm text-nova-text">Admin Console</h4>
                  <p className="text-xs text-nova-muted">Station management & API health</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-nova-muted" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
