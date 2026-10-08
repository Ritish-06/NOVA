'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async () => {
    // Simulate rate-limited reset request
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-nova-bg flex items-center justify-center p-4 sm:p-8">
      <div className="nova-card p-8 max-w-md w-full bg-white space-y-6 shadow-elevated">
        
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-nova-muted hover:text-nova-dark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-1">
          <h1 className="font-display font-bold text-2xl text-nova-text">
            Forgot your password?
          </h1>
          <p className="text-xs text-nova-muted font-light">
            Enter your email and we&apos;ll help you get back into NOVA.
          </p>
        </div>

        {submitted ? (
          /* Privacy-Safe Response Requirement (Prompt Section 4) */
          <div className="p-5 rounded-2xl bg-nova-energy-light border border-nova-energy/30 space-y-3">
            <div className="flex items-center gap-2 text-nova-energy font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Reset Link Sent</span>
            </div>
            <p className="text-xs text-nova-dark leading-relaxed">
              If an account exists for this email, you&apos;ll receive a password reset link shortly.
            </p>
            <Link
              href="/login"
              className="inline-block pt-2 text-xs font-bold text-nova-dark underline"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-nova-dark text-white font-semibold text-sm hover:bg-nova-dark/95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>{isSubmitting ? 'Processing...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
