// app/dashboard/sessions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/app/components/DashboardShell';
// ...existing code...

type SupportType = 'counselor' | 'helpline' | 'group';

interface Booking {
  id: string;
  date: string;
  time: string;
  supportType: SupportType;
  notes?: string;
  status?: string;
}

export default function SessionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Booking[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [supportType, setSupportType] = useState<SupportType | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sessions');
      if (!res.ok) {
        const err = (await res.json()).error as string | undefined;
        throw new Error(err || 'Failed to load sessions');
      }
      const data = (await res.json()) as { sessions: Booking[] };
      setSessions(data.sessions || []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSessions();
  }, []);

  const submit = async () => {
    if (!date || !time || !supportType) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, supportType, notes }),
      });
      if (!res.ok) {
        const err = (await res.json()).error as string | undefined;
        throw new Error(err || 'Booking failed');
      }
      setDate('');
      setTime('');
      setSupportType('');
      setNotes('');
      await fetchSessions();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="p-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold text-white">Your Sessions</h1>
              <p className="text-white/70">See upcoming and past bookings.</p>
            </div>
            <button
              onClick={() => void fetchSessions()}
              className="text-[12px] text-emerald-300 hover:text-emerald-200 flex items-center gap-1"
            >
              Refresh
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            {loading ? (
              <p className="text-white/70">Loading...</p>
            ) : error ? (
              <p className="text-rose-300">{error}</p>
            ) : sessions.length === 0 ? (
              <div>
                <p className="text-white/80">No sessions booked yet.</p>
                <p className="text-white/60">Use the form on the right to book confidentially.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg border border-white/10 bg-white/10 p-3 text-white/90"
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{s.supportType}</span>
                      <span className="text-xs rounded-full px-2 py-0.5 bg-white/10">
                        {s.status || 'booked'}
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      {s.date} at {s.time}
                    </div>
                    {s.notes ? (
                      <div className="text-xs text-white/70 mt-1">Notes: {s.notes}</div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-white font-medium mb-3">Book a Session</h2>

            <div className="mb-3">
              <div className="text-white/80 text-sm mb-1">Support type</div>
              <div className="flex gap-2">
                {(['counselor', 'helpline', 'group'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSupportType(t)}
                    className={`rounded-lg px-3 py-2 text-xs capitalize transition-colors ${
                      supportType === t
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-white/80 text-sm mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm text-white/90 outline-none"
            />

            <label className="block text-white/80 text-sm mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm text-white/90 outline-none"
            />

            <label className="block text-white/80 text-sm mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Anything your counselor should know"
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm text-white/90 outline-none placeholder:text-white/40"
            />

            <button
              onClick={() => void submit()}
              disabled={!date || !time || !supportType || submitting}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {submitting ? 'Booking…' : 'Book Confidentially'}
            </button>

            <p className="text-xs text-white/60 mt-2">
              Your booking is private. For emergencies, contact local services immediately.
            </p>
          </div>
        </div>
      </div>
  </DashboardShell>
  );
}
