'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

// Local imports
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AISection from '@/app/components/AISection';
import { supabase } from '@/lib/supabaseClient';

// Types (optional: improve type-safety)
import type { Session } from '@supabase/supabase-js';

function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (isMounted) setSession(session);
      } catch (err) {
        console.error('[useAuth] getSession error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    isAuthenticated: !!session,
    loading,
    session,
  };
}

export default function AISupportPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Optional: decide routing policy here
  const shouldRedirectToLogin = useMemo(() => false, []); // change to true if auth is required

  useEffect(() => {
    if (loading) return;

    if (shouldRedirectToLogin && !isAuthenticated) {
  router.replace("");
      return;
    }

    setReady(true);
  }, [isAuthenticated, loading, router, shouldRedirectToLogin]);

  const pageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    }),
    []
  );

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <section className="mx-auto max-w-3xl px-4 py-20 text-center">
            <motion.div initial="hidden" animate="visible" variants={pageVariants}>
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon icon="solar:chat-square-code-bold-duotone" className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Loading your AI companion…
              </h1>
              <p className="mt-2 text-slate-600">
                ...
                ...
                ...
                ...
                
              </p>
              <p className="mt-2 text-slate-600">
                Chat anonymously with our AI companion for immediate, judgement-free support. If needed, it will guide
                to professional help.
              </p>
            </motion.div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Gradient to match main page */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient( circle farthest-corner at 10% 20%,  rgba(83,113,245,0.6) 0%, rgba(107,228,184,0.4) 72.3% )"
        }}
      />
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial="hidden" animate="visible" variants={pageVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Info Card */}
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-emerald-100/50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Icon icon="solar:chat-square-code-bold-duotone" />
                    AI Support
                  </div>
                  <h1 className="font-poppins font-medium text-4xl text-slate-800 mb-4">Your 24/7 Mental Health Companion</h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Anonymous, judgement-free support. No account required. Our AI-powered support system uses evidence-based CBT techniques to provide immediate help when you need it most. Smart escalation ensures you get professional support when necessary.
                  </p>
                </div>
                <motion.button
                  onClick={() => document.getElementById('native-chat')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Icon icon="material-symbols:chat-outline-rounded" />
                  Try AI Support Now
                </motion.button>
                {/* Auth state banner */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow">
                  {isAuthenticated ? (
                    <span className="inline-flex items-center gap-2">
                      <Icon icon="solar:shield-check-bold-duotone" className="h-4 w-4 text-emerald-600" />
                      Signed in: secure, synced experience.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Icon icon="solar:eye-closed-bold-duotone" className="h-4 w-4 text-indigo-600" />
                      Anonymous mode: no sign-in required.
                    </span>
                  )}
                </div>
              </div>
              {/* Right: AI Section (Chat) */}
              <div id="native-chat" className="relative flex items-center justify-center">
                <div className="w-full">
                  <AISection />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
