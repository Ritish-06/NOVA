import { UserProfile } from '@/types';

export const PUBLIC_ROUTES = [
  '/',
  '/explore',
  '/stations',
  '/networks',
  '/calculator',
  '/planner',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export const AUTH_REQUIRED_ROUTES = [
  '/account',
  '/account/vehicles',
  '/favorites',
  '/history',
  '/notifications',
  '/charging',
  '/trips',
];

export const ADMIN_REQUIRED_ROUTES = ['/admin'];

export function isRouteAllowed(pathname: string, user: UserProfile | null): { allowed: boolean; redirectUrl?: string } {
  // Public routes allowed for everyone
  if (PUBLIC_ROUTES.some((route) => pathname === route || (route !== '/' && pathname.startsWith(route)))) {
    return { allowed: true };
  }

  // Unauthenticated user attempting protected route
  if (!user) {
    return { allowed: false, redirectUrl: `/login?redirect=${encodeURIComponent(pathname)}` };
  }

  // Non-admin attempting admin route
  if (ADMIN_REQUIRED_ROUTES.some((route) => pathname.startsWith(route)) && user.role !== 'ADMIN') {
    return { allowed: false, redirectUrl: '/account' };
  }

  return { allowed: true };
}

export function validatePasswordStrength(password: string): {
  hasMinLen: boolean;
  hasUpperLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
} {
  const hasMinLen = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isValid = hasMinLen && hasUpperLower && hasNumber && hasSpecial;

  return {
    hasMinLen,
    hasUpperLower,
    hasNumber,
    hasSpecial,
    isValid,
  };
}
