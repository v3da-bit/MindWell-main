'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function EmergencyPage() {
  return (
    <div className="relative">
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient( circle farthest-corner at 10% 20%, rgba(255,99,99,0.25) 0%, rgba(107,228,184,0.25) 72.3% )'
        }}
      />

      <Navbar />

      {/* Urgent Header */}
      <section className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-rose-600 to-red-600 text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <span className="absolute -inset-8 bg-red-500/40 blur-3xl" aria-hidden="true" />
            <div className="flex items-start md:items-center gap-4 relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="shrink-0 bg-white/20 p-3 rounded-2xl"
              >
                <Icon icon="material-symbols:siren-rounded" className="text-3xl" />
              </motion.div>
              <div>
                <h1 className="font-poppins font-medium text-3xl md:text-4xl">Emergency Help</h1>
                <p className="mt-2 text-white/90">If you or someone else is in immediate danger, call your local emergency number now.</p>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="tel:1800-599-0019" className="group relative flex items-center justify-center gap-2 bg-white text-red-700 rounded-xl py-4 font-medium shadow-lg hover:shadow-xl transition-all">
                <Icon icon="mdi:phone" className="text-lg" />
                Call 1800-599-0019
                <span className="absolute -inset-0.5 rounded-xl bg-red-500/10 blur opacity-0 group-hover:opacity-100 transition" aria-hidden="true" />
              </a>
              <a href="sms:1800-599-0019" className="relative flex items-center justify-center gap-2 bg-white/20 text-white rounded-xl py-4 font-medium backdrop-blur hover:bg-white/25 transition-all">
                <Icon icon="mdi:message-text" className="text-lg" />
                Text Support
              </a>
              <a href="#resources" className="relative flex items-center justify-center gap-2 bg-white/20 text-white rounded-xl py-4 font-medium backdrop-blur hover:bg-white/25 transition-all">
                <Icon icon="mdi:book-open-variant" className="text-lg" />
                Coping Guides
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Helpful Info */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/30"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <Icon icon="mdi:alert" />
              <h2 className="font-poppins font-medium text-xl text-slate-800">Stay Safe</h2>
            </div>
            <ul className="mt-4 space-y-2 text-slate-700 text-sm list-disc pl-5">
              <li>Move to a safe place if you can.</li>
              <li>Call someone you trust and stay on the line.</li>
              <li>Avoid alcohol or substances.</li>
              <li>Use grounding techniques: 5 things you can see, 4 touch, 3 hear, 2 smell, 1 taste.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/30"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <Icon icon="mdi:phone-in-talk" />
              <h2 className="font-poppins font-medium text-xl text-slate-800">Helplines</h2>
            </div>
            <div className="mt-4 space-y-3">
              <a href="tel:1800-599-0019" className="flex items-center justify-between bg-white/50 rounded-xl p-3 hover:bg-white/70 transition">
                <span className="text-slate-700">National Crisis Helpline</span>
                <span className="font-medium text-rose-700">1800-599-0019</span>
              </a>
              <a href="tel:1800-123-4567" className="flex items-center justify-between bg-white/50 rounded-xl p-3 hover:bg-white/70 transition">
                <span className="text-slate-700">Student Support Helpline</span>
                <span className="font-medium text-rose-700">1800-123-4567</span>
              </a>
              <a href="tel:1800-911-HELP" className="flex items-center justify-between bg-white/50 rounded-xl p-3 hover:bg-white/70 transition">
                <span className="text-slate-700">Campus Emergency</span>
                <span className="font-medium text-rose-700">1800-911-HELP</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
