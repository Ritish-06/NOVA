import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-nova-dark text-white border-t border-nova-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-nova-primary flex items-center justify-center text-nova-dark">
                <Zap className="w-4 h-4 fill-nova-dark text-nova-dark" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                NOVA
              </span>
            </div>
            <p className="text-nova-primary/80 text-sm font-light">
              Find power. Anywhere. The living 3D global EV charging discovery platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-nova-energy-light bg-nova-energy/20 px-3 py-1.5 rounded-full w-max border border-nova-energy/30">
              <span className="w-2 h-2 rounded-full bg-nova-energy animate-pulse"></span>
              <span>Global Provider Network Online</span>
            </div>
          </div>

          {/* Core Platform Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-nova-primary">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/explore" className="hover:text-nova-primary transition-colors">
                  Explore 3D Map
                </Link>
              </li>
              <li>
                <Link href="/networks" className="hover:text-nova-primary transition-colors">
                  Charging Networks
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-nova-primary transition-colors">
                  EV Charge Calculator
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-nova-primary transition-colors">
                  Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Security */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-nova-primary">
              Account & Security
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/account/vehicles" className="hover:text-nova-primary transition-colors">
                  My EV Vehicles
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-nova-primary transition-colors">
                  Saved Stations
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-nova-primary transition-colors">
                  Charging History
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-nova-primary transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-nova-accent" />
                  <span>Admin Console</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Provider Standard */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-nova-primary">
              Data Standards
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              NOVA strictly labels all live vs simulated datasets. Live endpoints are synced via verified provider adapters.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 text-[11px] font-mono rounded bg-white/10 text-nova-primary">
                REST API v1
              </span>
              <span className="px-2.5 py-1 text-[11px] font-mono rounded bg-white/10 text-nova-primary">
                WebGL 2.0
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} NOVA EV Network. Built for seamless global electric mobility.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>API Health: 100%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
