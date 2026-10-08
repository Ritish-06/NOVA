'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNovaStore } from '@/lib/store/useNovaStore';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import AuthDropdown from '@/components/navigation/AuthDropdown';
import {
  Zap,
  Search,
  Sparkles,
  Compass,
  Calculator,
  Navigation,
  User,
  Menu,
  X,
  Shield,
  Activity,
  Heart
} from 'lucide-react';

export default function NavigationBar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeSession = useNovaStore((state) => state.activeSession);
  const setAiDrawerOpen = useNovaStore((state) => state.setAiDrawerOpen);
  const favoriteStationIds = useNovaStore((state) => state.favoriteStationIds);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/networks', label: 'Networks', icon: Zap },
    { href: '/calculator', label: 'Calculator', icon: Calculator },
    { href: '/planner', label: 'Trip Planner', icon: Navigation },
    { href: '/favorites', label: 'Saved', icon: Heart, badge: favoriteStationIds.length },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F3EC]/90 backdrop-blur-md border-b border-[#E8DDCC]/80 shadow-subtle py-1'
            : 'bg-transparent py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-nova-dark flex items-center justify-center text-nova-primary transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 fill-nova-primary text-nova-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tighter text-nova-text leading-none">
                NOVA
              </span>
              <span className="text-[9px] font-mono font-medium text-nova-muted uppercase tracking-wider">
                EV Network
              </span>
            </div>
          </Link>

          {/* Quick Search Button (Desktop) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[#E8DDCC] text-nova-muted text-xs font-semibold hover:border-nova-accent hover:text-nova-text transition-all shadow-subtle"
          >
            <Search className="w-3.5 h-3.5 text-nova-accent" />
            <span>Where do you want to charge?</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-nova-bg text-nova-muted rounded border border-[#E8DDCC]">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-nova-dark text-white shadow-subtle'
                      : 'text-nova-muted hover:text-nova-text hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-nova-accent" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-nova-accent text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Active Session, Auth Dropdown, AI Assistant, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Active Session Meter */}
            {activeSession && activeSession.status === 'ACTIVE' && (
              <Link
                href={`/charging/${activeSession.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-nova-energy-light border border-nova-energy/40 text-nova-energy text-xs font-semibold animate-pulse-subtle hover:bg-nova-energy/20 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Charging {activeSession.currentBatteryPct}%</span>
              </Link>
            )}

            {/* User Auth Dropdown */}
            <AuthDropdown />

            {/* AI Assistant Button */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-nova-dark text-white text-xs font-semibold hover:bg-nova-dark/90 transition-all shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-nova-accent" />
              <span className="hidden sm:inline">NOVA AI</span>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-full bg-white border border-[#E8DDCC] text-nova-text"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white border border-[#E8DDCC] text-nova-text"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8DDCC] bg-white px-4 py-4 space-y-2 shadow-elevated">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-nova-dark text-white'
                      : 'text-nova-text hover:bg-nova-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-nova-muted hover:bg-nova-bg"
            >
              <User className="w-4 h-4" />
              <span>My Account</span>
            </Link>
          </div>
        )}
      </header>

      {/* Global Autocomplete Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
