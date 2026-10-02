// app/dashboard/study-guides/page.tsx
'use client';

import React from 'react';
import DashboardShell from '@/app/components/DashboardShell';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';

type Guide = {
  id: string;
  title: string;
  icon: string;
  colorFrom: string;
  colorTo: string;
  desc: string;
  estReadMin?: number;
};

const guides: Guide[] = [
  { id: 'exam', title: 'Exam Strategy', icon: 'mdi:clipboard-text-outline', colorFrom: 'from-emerald-400/40', colorTo: 'to-emerald-700/40', desc: 'Proven tactics to prepare smarter and perform calmly.', estReadMin: 5 },
  { id: 'focus', title: 'Focus & Deep Work', icon: 'mdi:target-variant', colorFrom: 'from-sky-400/40', colorTo: 'to-sky-700/40', desc: 'Cut distractions, study in sprints, and retain more.', estReadMin: 5 },
  { id: 'time', title: 'Time Management', icon: 'mdi:timer-outline', colorFrom: 'from-amber-400/40', colorTo: 'to-amber-700/40', desc: 'Simple routines to plan weeks and avoid last‑minute stress.', estReadMin: 5 },
  { id: 'notes', title: 'Effective Notes', icon: 'mdi:notebook-edit-outline', colorFrom: 'from-teal-400/40', colorTo: 'to-teal-700/40', desc: 'Cornell, outline, and active recall techniques that work.', estReadMin: 5 },
  { id: 'math', title: 'Math Problem Solving', icon: 'mdi:function-variant', colorFrom: 'from-cyan-400/40', colorTo: 'to-cyan-700/40', desc: 'Step-by-step frameworks for proofs and calculations.', estReadMin: 6 },
  { id: 'wellbeing', title: 'Study & Wellbeing', icon: 'mdi:heart-outline', colorFrom: 'from-rose-400/40', colorTo: 'to-rose-700/40', desc: 'Coping tools to stay balanced during busy terms.', estReadMin: 4 },
];

export default function StudyGuidesPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <DashboardShell>
      <div className="p-6">
        <header aria-labelledby="study-guides-heading" className="mb-6">
          <h1 id="study-guides-heading" className="text-xl font-semibold text-white">
            Study Guides
          </h1>
          <p className="text-white/70 mt-1">
            Bite-sized, practical guides to help you learn faster.
          </p>
        </header>

        <section
          aria-label="Guide list"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {guides.map((g, i) => {
            const delay = prefersReducedMotion ? 0 : i * 0.05;

            return (
              <motion.article
                key={g.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
                className="group rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-[1px] focus-within:ring-2 focus-within:ring-emerald-400/50"
              >
                <Link
                  href={`/dashboard/study-guides/${g.id}`}
                  className="block rounded-2xl bg-[#0b1220] p-4 border border-white/10 h-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                  aria-labelledby={`guide-title-${g.id}`}
                  aria-describedby={`guide-desc-${g.id}`}
                >
                  <div
                    className={`rounded-xl bg-gradient-to-br ${g.colorFrom} ${g.colorTo} p-3 w-12 h-12 flex items-center justify-center mb-3 shadow-inner`}
                    aria-hidden="true"
                  >
                    <Icon icon={g.icon} className="text-white" width={22} height={22} />
                  </div>

                  <h3 id={`guide-title-${g.id}`} className="text-white font-medium">
                    {g.title}
                  </h3>
                  <p id={`guide-desc-${g.id}`} className="text-white/70 text-sm mt-1">
                    {g.desc}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-white/70">
                    <span className="inline-flex items-center gap-1 text-emerald-300 group-hover:text-emerald-200">
                      Open guide
                      <Icon icon="mdi:arrow-right" width={16} height={16} />
                    </span>
                    <span>{`~${g.estReadMin ?? 5} min read`}</span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </section>
      </div>
    </DashboardShell>
  );
}
