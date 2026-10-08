'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNovaStore } from '@/lib/store/useNovaStore';
import NovaGlobe from '@/components/3d/Globe/NovaGlobe';
import { Zap, Eye, EyeOff, Mail, Lock, ArrowRight, Globe } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const setCurrentUser = useNovaStore((state) => state.setCurrentUser);

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.mercer@nova-ev.com',
      password: 'Password123!',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCurrentUser({
        id: 'usr-1',
        name: 'Alex Mercer',
        email: values.email,
        role: 'USER',
      });

      router.push(redirectUrl);
    } catch {
      setApiError('Authentication failed. Please check your credentials.');
    }
  };

  const handleGoogleOAuth = () => {
    setCurrentUser({
      id: 'usr-google-1',
      name: 'Alex Mercer',
      email: 'alex.mercer@gmail.com',
      role: 'USER',
    });
    router.push(redirectUrl);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display font-bold text-3xl text-nova-text">
          Welcome back.
        </h1>
        <p className="text-xs sm:text-sm text-nova-muted font-light">
          Continue exploring the world of EV charging.
        </p>
      </div>

      {apiError && (
        <div className="p-3 rounded-xl bg-nova-status-unavailable/10 border border-nova-status-unavailable/30 text-nova-status-unavailable text-xs">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        
        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="font-bold text-nova-dark uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-4 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-nova-status-unavailable text-[11px] font-semibold mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-bold text-nova-dark uppercase tracking-wider">
              Password
            </label>
            <Link href="/forgot-password" className="text-[11px] font-semibold text-nova-accent hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-10 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nova-muted hover:text-nova-dark"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-nova-status-unavailable text-[11px] font-semibold mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Primary Sign In CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-subtle"
        >
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Google OAuth Simulation */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E8DDCC] w-full" />
          <span className="bg-white px-3 text-[11px] text-nova-muted uppercase font-mono absolute">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleOAuth}
          className="w-full py-3 rounded-xl bg-white border border-[#E8DDCC] text-nova-dark font-semibold text-xs hover:border-nova-accent transition-all flex items-center justify-center gap-2"
        >
          <Globe className="w-4 h-4 text-nova-accent" />
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="text-center text-xs text-nova-muted pt-2 border-t border-[#E8DDCC]">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="font-bold text-nova-dark hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nova-bg flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 nova-card bg-white overflow-hidden shadow-elevated">
        
        {/* LEFT / MAIN: Atmospheric 3D Earth Visual & Wordmark */}
        <div className="lg:col-span-6 nova-noise-bg p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8DDCC] relative min-h-[350px]">
          <div className="space-y-2 z-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-nova-dark flex items-center justify-center text-nova-primary">
                <Zap className="w-4 h-4 fill-nova-primary text-nova-primary" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tighter text-nova-text">
                NOVA
              </span>
            </Link>
            <p className="text-xs font-mono uppercase tracking-widest text-nova-accent">
              Global Spatial Mobility
            </p>
          </div>

          {/* Embedded Globe Preview */}
          <div className="relative w-full h-64 my-4 flex items-center justify-center">
            <NovaGlobe interactive={false} />
          </div>

          <div className="space-y-1 z-10 text-xs text-nova-muted">
            <p className="font-semibold text-nova-dark">Find power. Anywhere.</p>
            <p>120,000+ verified charging bays synchronized globally.</p>
          </div>
        </div>

        {/* RIGHT / CENTER: Login Form wrapped in Suspense */}
        <div className="lg:col-span-6 p-8 flex flex-col justify-center">
          <Suspense fallback={<div className="text-xs text-nova-muted">Loading authentication...</div>}>
            <LoginFormContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
