'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNovaStore } from '@/lib/store/useNovaStore';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import { Zap, Search, Sparkles, Compass, Navigation, User } from 'lucide-react';

export default function HeroNavigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const setAiDrawerOpen = useNovaStore((state) => state.setAiDrawerOpen);
  const activeSession = useNovaStore((state) => state.activeSession);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#F7F3EC]/90 backdrop-blur-md border-b border-[#E8DDCC] shadow-subtle'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Wordmark Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-nova-dark flex items-center justify-center text-nova-primary transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 fill-nova-primary text-nova-primary" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tighter text-nova-text">
              NOVA
            </span>
          </Link>

          {/* Center Navigation Links (Explore, Networks, Planner) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-nova-muted">
            <Link
              href="/explore"
              className={`hover:text-nova-text transition-colors flex items-center gap-1.5 ${
                pathname === '/explore' ? 'text-nova-dark font-semibold' : ''
              }`}
            >
              <Compass className="w-4 h-4 text-nova-accent" />
              <span>Explore</span>
            </Link>

            <Link
              href="/networks"
              className={`hover:text-nova-text transition-colors flex items-center gap-1.5 ${
                pathname === '/networks' ? 'text-nova-dark font-semibold' : ''
              }`}
            >
              <Zap className="w-4 h-4 text-nova-accent" />
              <span>Networks</span>
            </Link>

            <Link
              href="/planner"
              className={`hover:text-nova-text transition-colors flex items-center gap-1.5 ${
                pathname === '/planner' ? 'text-nova-dark font-semibold' : ''
              }`}
            >
              <Navigation className="w-4 h-4 text-nova-accent" />
              <span>Planner</span>
            </Link>
          </div>

          {/* Right Actions (Search, Account, AI) */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full bg-white/80 border border-[#E8DDCC] text-nova-dark hover:border-nova-accent transition-all shadow-subtle flex items-center gap-2 text-xs font-semibold"
              title="Search Locations (⌘K)"
            >
              <Search className="w-4 h-4 text-nova-accent" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2.5 rounded-full bg-white/80 border border-[#E8DDCC] text-nova-dark hover:border-nova-accent transition-all shadow-subtle flex items-center gap-2 text-xs font-semibold"
            >
              <User className="w-4 h-4 text-nova-dark" />
              <span className="hidden sm:inline">Account</span>
            </Link>

            {/* Grounded AI Assistant */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-nova-dark text-white text-xs font-semibold hover:bg-nova-dark/90 transition-all shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-nova-accent" />
              <span className="hidden sm:inline">NOVA AI</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Global Autocomplete Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
