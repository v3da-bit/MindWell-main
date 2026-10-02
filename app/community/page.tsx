'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import PeerSection from '@/app/components/PeerSection';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function CommunityPage() {
  return (
    <div className="relative">
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(83,113,245,0.6) 0%, rgba(107,228,184,0.4) 72.3% )'
        }}
      />

      <Navbar />

      {/* Page Header */}
      <section className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <Icon icon="material-symbols:diversity-3" className="text-2xl text-orange-600" />
            <h1 className="font-poppins font-medium text-3xl text-slate-800">Community</h1>
          </motion.div>
          <p className="text-slate-600 max-w-2xl">Share experiences, ask questions, and support others in a safe, moderated space.</p>
        </div>
      </section>

      <PeerSection />

      <Footer />
    </div>
  );
}
