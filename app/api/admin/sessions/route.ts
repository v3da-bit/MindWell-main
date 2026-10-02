import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
};

export async function GET(request: Request) {
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
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
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

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const parsedLimit = Number(limitParam || '200');
    const limit = isNaN(parsedLimit) ? 200 : Math.min(parsedLimit, 500);

    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const supportType = searchParams.get('supportType');
    const status = searchParams.get('status');
    const date = searchParams.get('date'); // YYYY-MM-DD

    let query = supabase
      .from('sessions')
      .select('*')
      .limit(limit);

    // Apply filters - Supabase allows multiple filters
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (email) {
      query = query.eq('email', email);
    }
    if (supportType) {
      query = query.eq('support_type', supportType);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (date) {
      query = query.eq('date', date);
    }

    // Default ordering if no specific filters
    if (!userId && !email && !supportType && !status && !date) {
      query = query.order('created_at', { ascending: false });
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('GET /api/admin/sessions error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('GET /api/admin/sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
