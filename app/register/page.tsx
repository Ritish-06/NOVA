'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { validatePasswordStrength } from '@/lib/auth/authGuard';
import { Zap, User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the Terms & Privacy Policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setCurrentUser = useNovaStore((state) => state.setCurrentUser);

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const watchPassword = watch('password', '');
  const strength = validatePasswordStrength(watchPassword);

  const onSubmit = async (values: RegisterFormValues) => {
    setApiError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: values.name,
        email: values.email,
        role: 'USER',
      });

      router.push('/account');
    } catch {
      setApiError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nova-bg flex items-center justify-center p-4 sm:p-8">
      <div className="nova-card p-8 max-w-lg w-full bg-white space-y-6 shadow-elevated">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-nova-dark text-white font-bold flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 text-nova-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl text-nova-text">
            Start your journey.
          </h1>
          <p className="text-xs sm:text-sm text-nova-muted font-light">
            Create your NOVA account and keep your charging world connected.
          </p>
        </div>

        {apiError && (
          <div className="p-3 rounded-xl bg-nova-status-unavailable/10 border border-nova-status-unavailable/30 text-nova-status-unavailable text-xs">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="font-bold text-nova-dark uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="Alex Mercer"
                className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-4 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
              />
            </div>
            {errors.name && (
              <p className="text-nova-status-unavailable text-[11px] font-semibold mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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
                placeholder="alex@example.com"
                className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-4 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
              />
            </div>
            {errors.email && (
              <p className="text-nova-status-unavailable text-[11px] font-semibold mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="font-bold text-nova-dark uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Create password"
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

          {/* Progressive Password Requirements Meter (Section 2 Spec) */}
          {watchPassword && (
            <div className="p-3 bg-nova-bg/60 rounded-xl space-y-1 text-[11px]">
              <span className="font-bold text-nova-dark block">Password Security Requirements:</span>
              <div className="grid grid-cols-2 gap-1.5 text-nova-muted">
                <span className={`flex items-center gap-1 ${strength.hasMinLen ? 'text-nova-energy font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> At least 8 characters
                </span>
                <span className={`flex items-center gap-1 ${strength.hasUpperLower ? 'text-nova-energy font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Upper & lower case
                </span>
                <span className={`flex items-center gap-1 ${strength.hasNumber ? 'text-nova-energy font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Number (0-9)
                </span>
                <span className={`flex items-center gap-1 ${strength.hasSpecial ? 'text-nova-energy font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> Special character (!@#)
                </span>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="font-bold text-nova-dark uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Re-enter password"
                className="w-full bg-nova-bg border border-[#E8DDCC] rounded-xl pl-10 pr-4 py-3 font-medium text-nova-dark focus:outline-none focus:border-nova-accent"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-nova-status-unavailable text-[11px] font-semibold mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Accept Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register('acceptTerms')}
              className="mt-0.5 rounded border-[#E8DDCC] text-nova-dark accent-nova-dark focus:ring-0"
            />
            <label htmlFor="acceptTerms" className="text-[11px] text-nova-muted">
              I agree to the <span className="underline font-semibold text-nova-dark">Terms of Service</span> and <span className="underline font-semibold text-nova-dark">Privacy Policy</span>.
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-nova-status-unavailable text-[11px] font-semibold">{errors.acceptTerms.message}</p>
          )}

          {/* Primary Create Account CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-nova-muted pt-2 border-t border-[#E8DDCC]">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-nova-dark hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
