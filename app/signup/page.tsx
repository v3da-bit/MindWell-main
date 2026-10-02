'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AuthFormOAuth from '@/app/components/AuthFormOAuth';

export default function SignupPage() {
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
      <Navbar />
      <div className="pt-20 space-y-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-slate-600">Sign up with Google or GitHub</p>
        </div>
        {/* Google/GitHub OAuth signup buttons */}
        <div className="max-w-md mx-auto">
          <AuthFormOAuth />
        </div>
      </div>
      <Footer />
    </div>
  );
}
