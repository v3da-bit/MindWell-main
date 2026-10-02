// /app/api/emotion/batch-supa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';


const schema = z.object({
  events: z.array(z.object({
    ts: z.string(),
    bucketMin: z.string(),
    scores: z.object({
      angry: z.number(), disgusted: z.number(), fearful: z.number(),
      happy: z.number(), neutral: z.number(), sad: z.number(), surprised: z.number(),
    }),
    top: z.enum(['angry','disgusted','fearful','happy','neutral','sad','surprised']),
    conf: z.number().min(0).max(1),
  })).max(500),
});

export async function POST(req: NextRequest) {
  try {
  const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'invalid', details: parsed.error }, { status: 400 });

    const rows = parsed.data.events.map(e => ({
      user_id: user.id,
      ts: e.ts,
      bucket_min: e.bucketMin,
      top: e.top,
      conf: e.conf,
      angry: e.scores.angry,
      disgusted: e.scores.disgusted,
      fearful: e.scores.fearful,
      happy: e.scores.happy,
      neutral: e.scores.neutral,
      sad: e.scores.sad,
      surprised: e.scores.surprised,
    }));

    const { error } = await supabase.from('emotion_events').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'server error', details: String(e) }, { status: 500 });
  }
}
