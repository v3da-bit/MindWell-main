import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface AnalyticsOverview {
  total: number;
  upcoming: number;
  past: number;
  uniqueStudents: number;
  byType: Array<{ type: string; count: number }>;
  perDay: Array<{ date: string; count: number }>; // YYYY-MM-DD
}

interface SessionDoc extends Record<string, unknown> {
  id: string;
  user_id?: string;
  email?: string;
  date?: string;
  time?: string;
  support_type?: string;
}

function toDateTime(dateStr?: string | null, timeStr?: string | null): Date | null {
  if (!dateStr || !timeStr) return null;
  // Expecting YYYY-MM-DD and HH:mm
  const [y, m, d] = dateStr.split('-').map((s) => Number(s));
  const [hh, mm] = timeStr.split(':').map((s) => Number(s));
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: Record<string, unknown>) {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Admin authorization
    if ((session.user.email || '').toLowerCase() !== 'botp36264@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Pull up to 500 recent sessions
    const { data: docs, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('GET /api/admin/analytics error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const sessions = (docs || []) as SessionDoc[];

    const now = new Date();
    let total = 0;
    let upcoming = 0;
    let past = 0;
    const studentSet = new Set<string>();
    const typeCounts: Record<string, number> = {};
    const dayCounts: Record<string, number> = {};

    for (const s of sessions) {
      total += 1;
      const uid = (s.user_id as string | undefined) || (s.email as string | undefined) || `anon-${total}`;
      studentSet.add(uid);

      const t = String(s.support_type || 'unknown');
      typeCounts[t] = (typeCounts[t] || 0) + 1;

      const dateStr = String(s.date || '');
      if (dateStr) {
        dayCounts[dateStr] = (dayCounts[dateStr] || 0) + 1;
      }

      const dt = toDateTime(s.date as string | undefined, s.time as string | undefined);
      if (dt) {
        if (dt.getTime() >= now.getTime()) upcoming += 1;
        else past += 1;
      }
    }

    // Prepare last 7 days timeline using existing counts if present
    const perDay: Array<{ date: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      perDay.push({ date: key, count: dayCounts[key] || 0 });
    }

    const byType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

    const overview: AnalyticsOverview = {
      total,
      upcoming,
      past,
      uniqueStudents: studentSet.size,
      byType,
      perDay,
    };

    return NextResponse.json({ overview });
  } catch (error) {
    console.error('GET /api/admin/analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
