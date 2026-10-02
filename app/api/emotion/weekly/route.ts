// /app/api/emotion/weekly/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Uncomment if installed

export async function GET() {
  // Import cookies for Supabase auth
  const { cookies } = await import('next/headers');
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Query weekly aggregated face expression data for this user
  const { data, error } = await supabase
    .from('emotion_weekly')
    .select('*')
    .eq('user_id', user.id)
    .order('week', { ascending: false })
    .limit(4);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ weeks: data ?? [] });
}
