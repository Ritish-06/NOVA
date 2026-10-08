'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useNovaStore } from '@/lib/store/useNovaStore';
import {
  User,
  Car,
  Heart,
  History,
  Bell,
  Shield,
  LogOut,
  ChevronDown,
  X,
  AlertCircle
} from 'lucide-react';

export default function AuthDropdown() {
  const router = useRouter();
  const currentUser = useNovaStore((state) => state.currentUser);
  const setCurrentUser = useNovaStore((state) => state.setCurrentUser);
  const stopChargingSession = useNovaStore((state) => state.stopChargingSession);

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside & Escape key listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleConfirmLogout = () => {
    // 1. Reset user state & active sessions
    stopChargingSession();
    setCurrentUser(null);
    setShowLogoutConfirm(false);
    setIsOpen(false);

    // 2. Redirect safely to homepage
    router.push('/');
  };

  if (!currentUser) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-full bg-nova-dark text-white text-xs font-semibold hover:bg-nova-dark/90 transition-all shadow-subtle flex items-center gap-1.5"
      >
        <User className="w-3.5 h-3.5 text-nova-primary" />
        <span>Sign in</span>
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8DDCC] hover:border-nova-accent text-nova-dark transition-all shadow-subtle text-xs font-semibold"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 rounded-full bg-nova-dark text-white font-bold text-[10px] flex items-center justify-center">
          {currentUser.name.charAt(0)}
        </div>
        <span className="hidden sm:inline font-display">{currentUser.name.split(' ')[0]}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-nova-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E8DDCC] shadow-elevated z-50 overflow-hidden divide-y divide-[#E8DDCC]"
          >
            {/* User Info Header */}
            <div className="p-3.5 bg-nova-bg/50">
              <span className="font-display font-bold text-xs text-nova-dark block line-clamp-1">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-nova-muted block line-clamp-1">
                {currentUser.email}
              </span>
            </div>

            {/* Account Links */}
            <div className="p-1.5 space-y-0.5 text-xs font-medium">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-nova-text hover:bg-nova-bg transition-colors"
              >
                <User className="w-4 h-4 text-nova-accent" />
                <span>My Account</span>
              </Link>

              <Link
                href="/account/vehicles"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-nova-text hover:bg-nova-bg transition-colors"
              >
                <Car className="w-4 h-4 text-nova-accent" />
                <span>My Vehicles</span>
              </Link>

              <Link
                href="/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-nova-text hover:bg-nova-bg transition-colors"
              >
                <Heart className="w-4 h-4 text-nova-accent" />
                <span>Saved Stations</span>
              </Link>

              <Link
                href="/history"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-nova-text hover:bg-nova-bg transition-colors"
              >
                <History className="w-4 h-4 text-nova-accent" />
                <span>Charging History</span>
              </Link>

              {currentUser.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-nova-text hover:bg-nova-bg transition-colors"
                >
                  <Shield className="w-4 h-4 text-nova-accent" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            {/* Logout Trigger */}
            <div className="p-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-nova-status-unavailable font-semibold hover:bg-nova-status-unavailable/10 transition-colors text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Logout Confirmation Modal (Prompt Section 3 Requirement) */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 bg-nova-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E8DDCC] p-6 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-nova-bg flex items-center justify-center text-nova-status-unavailable">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-nova-text">Leave NOVA?</h3>
                  <p className="text-xs text-nova-muted">Your current session will be signed out.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DDCC]">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-nova-muted hover:bg-nova-bg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-5 py-2 rounded-xl bg-nova-status-unavailable text-white font-semibold text-xs hover:bg-red-700 transition-colors"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
