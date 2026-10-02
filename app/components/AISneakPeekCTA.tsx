'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function AISneakPeekCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100/60 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            <Icon icon="mdi:lock-outline" className="text-base" />
            Members only
          </div>
          <h2 className="font-poppins font-medium text-3xl sm:text-4xl text-slate-800 leading-tight">
            Unlock AI Support
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-prose">
            Access our 24/7 confidential companion for coping tools, grounding exercises, and
            gentle guidance. Sign in to start chatting, or create an account in seconds.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ai-support"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-white text-sm shadow-lg transition-colors hover:bg-emerald-600"
            >
              <span className="absolute -inset-0.5 rounded-xl bg-emerald-500/30 blur opacity-60 group-hover:opacity-80" aria-hidden="true" />
              <span className="relative inline-flex items-center gap-2">
                <Icon icon="material-symbols:chat-outline-rounded" className="text-base" />
                Start chat
              </span>
              <span className="absolute -inset-0.5 rounded-xl bg-emerald-500/30 blur opacity-60 group-hover:opacity-80" aria-hidden="true" />First 100 chat free without Sign up.
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <Icon icon="mdi:account-plus-outline" className="text-base" />
              Create account
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            You&apos;ll be asked to log in before chatting. Fast and secure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <div className="relative rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
            <div className="absolute -top-3 -left-3 inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-3 py-1 text-xs">
              <Icon icon="mdi:shield-lock-outline" className="text-sm" />
              Preview locked
            </div>

            <div className="relative overflow-hidden rounded-xl bg-white/70 ring-1 ring-black/5">
              {/* Simulated chat window */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
                <div className="flex items-center gap-2 text-slate-700 text-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  MindWell AI
                </div>
                <Icon icon="mdi:dots-horizontal" className="text-slate-400" />
              </div>
              <div className="space-y-3 p-4">
                <div className="max-w-[80%] rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-700">
                  I&apos;m feeling a bit overwhelmed today.
                </div>
                <div className="max-w-[85%] rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  Thanks for sharing. Let&apos;s try a 60-second grounding exercise. Ready?
                </div>
                <div className="max-w-[75%] rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-700">
                  Yes, please.
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-white/70 backdrop-blur-sm" />
                  <div className="max-w-[90%] rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                    Great. First, name 5 things you can see around you...
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                    Write a message...
                  </div>
                  <button
                    aria-label="Send"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white shadow hover:bg-emerald-600"
                    suppressHydrationWarning={true}
                  >
                    <Icon icon="mdi:send" className="text-base" />
                  </button>
                </div>
              </div>
            </div>

            {/* Glow accents */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-cyan-400/10 to-transparent blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
