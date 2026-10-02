'use client';
// cSpell:ignore supabase

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/app/components/AuthForm';
import AuthFormOAuth from '@/app/components/AuthFormOAuth';

export default function SignInPage() {
  const router = useRouter();

  // Auto-redirect to dashboard since auth is disabled
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient( circle farthest-corner at 10% 20%,  rgba(83,113,245,0.6) 0%, rgba(107,228,184,0.4) 72.3% )',
        }}
      />
      <div className="pt-20 space-y-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-slate-600">Sign in to continue</p>
        </div>
        {/* OAuth signin buttons */}
        <div className="max-w-md mx-auto">
          <AuthFormOAuth />
        </div>
        {/* Manual email/password signin form */}
        <div className="max-w-md mx-auto">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}
