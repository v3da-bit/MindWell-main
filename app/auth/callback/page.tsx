// cSpell:ignore supabase SUPABASE XVCJ
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // Authentication is disabled - redirect directly to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
