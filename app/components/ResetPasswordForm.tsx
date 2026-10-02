'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';

function ResetPasswordFormInner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (!error && data.session) {
        router.replace('/dashboard');
      }
    })();
    return () => { active = false; };
  }, [router]);

  const handleEmailReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setError('');
        alert('Password reset email sent! Check your inbox.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthReset = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-xl"
      >
        <div className="text-center space-y-2">
          <h1 className="text-xl font-medium text-slate-900">Reset your password</h1>
          <p className="text-sm text-slate-600">Choose how you signed in to get back into your account.</p>
        </div>

        <div className="mt-6 grid gap-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleEmailReset}
              disabled={loading || !email}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Icon icon="mdi:email" className="text-lg" />
              {loading ? 'Sending...' : 'Request email link'}
            </button>
          </div>

          <button
            onClick={() => handleOAuthReset('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Icon icon="mdi:google" className="text-lg" />
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthReset('github')}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Icon icon="mdi:github" className="text-lg" />
            Continue with GitHub
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          If you usually sign in with Google or GitHub, update your password in that provider. If you signed up with email, choose the email option above to get a sign-in link.
        </p>

        <div className="mt-4 text-center text-xs">
          <button onClick={() => router.push('/signin')} className="text-emerald-700 hover:underline">
            Back to sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-sm text-slate-600">Loading...</div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
