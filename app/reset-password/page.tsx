'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validatePasswordStrength } from '@/lib/auth/authGuard';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'demo-token';

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const watchPassword = watch('password', '');
  const strength = validatePasswordStrength(watchPassword);

  const onSubmit = async () => {
    // Invalidate token immediately upon update
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display font-bold text-2xl text-nova-text">
          Create a new password.
        </h1>
        <p className="text-xs text-nova-muted font-light">
          Token verified. Set your new NOVA account password below.
        </p>
      </div>

      {success ? (
        <div className="p-5 rounded-2xl bg-nova-energy-light border border-nova-energy/30 space-y-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-nova-energy mx-auto" />
          <div>
            <h3 className="font-display font-bold text-base text-nova-dark">Password updated.</h3>
            <p className="text-xs text-nova-muted mt-1">Your new password has been securely saved.</p>
          </div>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl bg-nova-dark text-white font-semibold text-xs hover:bg-nova-dark/95 transition-all block"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          
          {/* New Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="font-bold text-nova-dark uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter new password"
                className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-10 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nova-muted hover:text-nova-dark"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-nova-status-unavailable text-[11px] font-semibold mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Strength indicator */}
          {watchPassword && (
            <div className="p-3 bg-nova-bg/60 rounded-xl space-y-1 text-[11px]">
              <div className="grid grid-cols-2 gap-1 text-nova-muted">
                <span className={`flex items-center gap-1 ${strength.hasMinLen ? 'text-nova-energy font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> 8+ chars
                </span>
                <span className={`flex items-center gap-1 ${strength.hasUpperLower ? 'text-nova-energy font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Upper/Lower
                </span>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="font-bold text-nova-dark uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Re-enter new password"
                className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-4 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-nova-status-unavailable text-[11px] font-semibold mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nova-bg flex items-center justify-center p-4 sm:p-8">
      <div className="nova-card p-8 max-w-md w-full bg-white space-y-6 shadow-elevated">
        <Suspense fallback={<div className="text-xs text-nova-muted">Verifying reset token...</div>}>
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </div>
  );
}
