
"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { supabase } from '@/lib/supabaseClient';

export default function UserDropdown() {
interface User {
  email?: string;
  id?: string;
}
interface Session {
  user?: User;
}
  // If Session type is not available, fallback to any
  const [session, setSession] = useState<unknown>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const typedSession = session as Session;
  const avatarUrl = `https://i.pravatar.cc/80?u=${encodeURIComponent(typedSession?.user?.email || typedSession?.user?.id || 'placeholder')}`;

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  router.push("");
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">
  <Image src={avatarUrl} alt="avatar" width={28} height={28} className="h-7 w-7 rounded-full" />
        <Icon icon="material-symbols:settings-outline" className="text-slate-500" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
          <div className="px-2 py-2">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="truncate text-sm text-slate-800">{typedSession?.user?.email || 'User'}</p>
          </div>
          <div className="my-1 h-px w-full bg-slate-200" />
          <button onClick={() => { setOpen(false); router.push('/dashboard'); }} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
            <Icon icon="mdi:account-outline" className="text-base" />
            Profile
          </button>
          <button onClick={() => { setOpen(false); router.push('/onboarding'); }} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
            <Icon icon="material-symbols:settings-outline" className="text-base" />
            Settings
          </button>
          <button onClick={signOut} className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            <Icon icon="material-symbols:logout" className="text-base" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
