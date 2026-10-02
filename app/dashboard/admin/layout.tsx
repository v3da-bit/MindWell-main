import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // Must be signed in by middleware already, but double-check and authorize admin
  if (!session || !session.user) {
    redirect('/signin');
  }
  if ((session.user.email || '').toLowerCase() !== 'botp36264@gmail.com') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
