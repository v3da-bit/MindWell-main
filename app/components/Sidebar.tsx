'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function Sidebar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    void getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <aside className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 space-y-3">
      <div className="text-sm text-white/70">{session ? `Welcome` : `Guest`}</div>

      <nav className="space-y-2">
        <a
          href="/analysis"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Analysis
        </a>
        <a
          href="/ProgressDashboard"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          University Navigator
        </a>
        <a
          href="/cogarch"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Cognitive Architect
        </a>
        <a
          href="/coggym"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Cognitive Gym
        </a>
        <a
          href="/wellnesschecking"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Wellness Checking
        </a>
        <a
          href="/healthcoach"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Mental Health Coach
        </a>
        <a
          href="/WellnessChallenges"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Study Helper
        </a>
        <a
          href="/help"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Need help?
        </a>
        {/* <a
          href="/exercise"
          className="block w-full text-left rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
          target="_blank" rel="noopener noreferrer"
        >
          Exercise
        </a> */}
      </nav>
    </aside>
  );
}
