'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SessionItem {
  id: string;
  userId?: string | null;
  email?: string | null;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  supportType?: string;
  status?: string;
  notes?: string;
}

interface Overview {
  total: number;
  upcoming: number;
  past: number;
  uniqueStudents: number;
  byType: Array<{ type: string; count: number }>;
  perDay: Array<{ date: string; count: number }>;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [search, setSearch] = useState('');

  const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a3a3a3'];

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [aRes, sRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/sessions?limit=300'),
      ]);
      if (!aRes.ok) throw new Error((await aRes.json()).error || 'Failed to load analytics');
      if (!sRes.ok) throw new Error((await sRes.json()).error || 'Failed to load sessions');
      const aData = (await aRes.json()) as { overview: Overview };
      const sData = (await sRes.json()) as { sessions: SessionItem[] };
      setOverview(aData.overview);
      setSessions(sData.sessions || []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const typeOk = filterType ? s.supportType === filterType : true;
      const statusOk = filterStatus ? (s.status || 'booked') === filterStatus : true;
      const q = search.trim().toLowerCase();
      const searchOk = q
        ? `${s.email || ''} ${s.userId || ''} ${s.supportType || ''} ${s.date || ''} ${s.time || ''}`
            .toLowerCase()
            .includes(q)
        : true;
      return typeOk && statusOk && searchOk;
    });
  }, [sessions, filterType, filterStatus, search]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base text-white/90">Admin Analytics</h1>
          <p className="text-[12px] text-white/60">Overview of all booked sessions</p>
        </div>
        <button
          onClick={() => void fetchAll()}
          className="text-[12px] text-emerald-300 hover:text-emerald-200 flex items-center gap-1"
        >
          <Icon icon="mdi:refresh" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" /> Loading…
        </div>
      ) : error ? (
        <div className="text-sm text-rose-200">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-white/80"><Icon icon="mdi:chart-line" className="text-lg text-emerald-300" /><span className="text-xs">Total Sessions</span></div>
              <div className="mt-1 text-2xl text-white/90 font-light">{overview?.total ?? 0}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-white/80"><Icon icon="mdi:calendar-clock" className="text-lg text-blue-300" /><span className="text-xs">Upcoming</span></div>
              <div className="mt-1 text-2xl text-white/90 font-light">{overview?.upcoming ?? 0}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-white/80"><Icon icon="mdi:check-decagram" className="text-lg text-amber-300" /><span className="text-xs">Completed/Past</span></div>
              <div className="mt-1 text-2xl text-white/90 font-light">{overview?.past ?? 0}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-white/80"><Icon icon="mdi:account-group" className="text-lg text-pink-300" /><span className="text-xs">Unique Students</span></div>
              <div className="mt-1 text-2xl text-white/90 font-light">{overview?.uniqueStudents ?? 0}</div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="xl:col-span-2 rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="mb-2 text-[12px] text-white/70">Sessions - last 7 days</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview?.perDay || []}>
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} />
                    <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} />
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="mb-2 text-[12px] text-white/70">Top Support Types</div>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overview?.byType || []} dataKey="count" nameKey="type" outerRadius={80}>
                      {(overview?.byType || []).map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-2 flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
            <div className="flex gap-2">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/90">
                <option value="">All types</option>
                {(overview?.byType || []).map((t) => (
                  <option key={t.type} value={t.type}>{t.type}</option>
                ))}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/90">
                <option value="">All statuses</option>
                <option value="booked">booked</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon icon="mdi:magnify" className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-base" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email, id, type…" className="w-64 rounded-lg border border-white/20 bg-white/10 pl-7 pr-3 py-2 text-xs text-white/90 placeholder:text-white/40" />
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="mt-2 rounded-2xl border border-white/20 bg-white/10 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[12px] text-white/70">All Booked Sessions ({filtered.length})</div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-left text-xs text-white/80">
                <thead className="text-[11px] text-white/60">
                  <tr>
                    <th className="py-2 pr-4">Student</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-t border-white/10">
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <Image src={`https://i.pravatar.cc/64?u=${encodeURIComponent(s.email || s.userId || s.id)}`} alt="avatar" width={24} height={24} className="h-6 w-6 rounded-full" />
                          <div className="flex flex-col">
                            <span className="text-white/90">{s.email || 'Unknown'}</span>
                            <span className="text-white/50">{s.userId || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-4 capitalize">{s.supportType || '-'}</td>
                      <td className="py-2 pr-4">{s.date || '-'}</td>
                      <td className="py-2 pr-4">{s.time || '-'}</td>
                      <td className="py-2 pr-4">
                        <span className={`rounded-full px-2 py-1 text-[10px] ${
                          (s.status || 'booked') === 'booked' ? 'bg-emerald-500/20 text-emerald-200' :
                          (s.status || 'booked') === 'completed' ? 'bg-blue-500/20 text-blue-200' :
                          'bg-rose-500/20 text-rose-200'
                        }`}>
                          {s.status || 'booked'}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-white/50">{s.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-white/70">No sessions match your filters.</div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
