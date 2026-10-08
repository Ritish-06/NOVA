'use client';

import React from 'react';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { Bell, CheckCircle, Zap, Navigation, Shield, Check } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = useNovaStore((state) => state.notifications);
  const markNotificationRead = useNovaStore((state) => state.markNotificationRead);

  return (
    <div className="min-h-screen bg-nova-bg py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-nova-text">
              Notifications & Alerts
            </h1>
            <p className="text-sm text-nova-muted mt-1">
              Real-time updates regarding station availability, trip plans, and charging sessions.
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="nova-card bg-white divide-y divide-[#E8DDCC] shadow-subtle overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                n.read ? 'bg-white' : 'bg-nova-bg/50 font-medium'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  n.type === 'SESSION' ? 'bg-nova-energy-light text-nova-energy' : 'bg-nova-bg text-nova-accent'
                }`}>
                  {n.type === 'SESSION' ? (
                    <Zap className="w-4 h-4" />
                  ) : n.type === 'TRIP' ? (
                    <Navigation className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-nova-text">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-nova-accent" />
                    )}
                  </div>
                  <p className="text-xs text-nova-muted leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-nova-muted block">{n.timestamp}</span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markNotificationRead(n.id)}
                  className="px-3 py-1 rounded-full bg-nova-bg border border-[#E8DDCC] text-xs font-semibold text-nova-muted hover:text-nova-dark flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
