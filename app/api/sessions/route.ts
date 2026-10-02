// cSpell:ignore supabase SUPABASE XVCJ
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

interface SessionBody {
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  supportType?: 'counselor' | 'helpline' | 'group';
  notes?: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzbapjgyxdcargacupeb.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YmFwamd5eGRjYXJnYWN1cGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU4NDksImV4cCI6MjA3NDEyMTg0OX0.mAswZMbMohsR5EQmTQrtl2aJaIUHLWKF4UB5ia6-MqM',
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
      return NextResponse.json({ error: sessionError?.message || 'Authentication required. Please log in.' }, { status: 401 });
    }

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('GET /api/sessions error:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch sessions. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('GET /api/sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzbapjgyxdcargacupeb.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YmFwamd5eGRjYXJnYWN1cGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU4NDksImV4cCI6MjA3NDEyMTg0OX0.mAswZMbMohsR5EQmTQrtl2aJaIUHLWKF4UB5ia6-MqM',
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
      return NextResponse.json({ error: sessionError?.message || 'Authentication required. Please log in.' }, { status: 401 });
    }

    let body;
    try {
      body = (await request.json()) as SessionBody;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    const { date, time, supportType, notes } = body;

    if (!date || !time || !supportType) {
      return NextResponse.json({ error: 'Missing required fields: date, time, and supportType are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: session.user.id,
        email: session.user.email,
        date,
        time,
        support_type: supportType,
        notes: (notes || '').slice(0, 500),
        status: 'booked',
      })
      .select()
      .single();

    if (error) {
      console.error('POST /api/sessions error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create session. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('POST /api/sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
