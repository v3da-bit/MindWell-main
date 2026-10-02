import { NextResponse } from 'next/server';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
  // TODO: Replace with real Supabase query
  // const supabase = createRouteHandlerClient({ cookies });
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  // const { data, error } = await supabase
  //   .from('chat_weekly')
  //   .select('*')
  //   .eq('user_id', user.id)
  //   .order('week', { ascending: false })
  //   .limit(4);
  // if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  // return NextResponse.json({ weeks: data ?? [] });

  // Sample/mock data for demo
  return NextResponse.json({
    weeks: [
      { week: '2025-W35', text: 0.55 },
      { week: '2025-W34', text: 0.62 },
      { week: '2025-W33', text: 0.48 },
      { week: '2025-W32', text: 0.70 },
    ],
  });
}
