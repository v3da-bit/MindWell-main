
'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function HeroSection() {

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-light text-slate-800 leading-tight mb-6"
          >
            A stigma-free mental health{' '}
            <span className="text-emerald-600 font-medium">companion</span>{' '}
            for every student
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-slate-600 mb-8 leading-relaxed"
          >
            Supporting your mental wellness journey with AI-guided support, confidential counseling, 
            educational resources, and a caring peer community. Available 24/7, judgment-free.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon icon="material-symbols:dashboard-outline" className="text-xl" />
                Dashboard
                <motion.div
                  className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </Link>
            <Link href="/ai-support">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-emerald-500 text-white px-8 py-4 rounded-2xl font-medium shadow-xl hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon icon="material-symbols:chat-outline-rounded" className="text-xl" />
                Talk to AI Support
                <motion.div
                  className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </Link>

            <Link href="/resources">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent text-emerald-700 border border-emerald-200 px-8 py-4 rounded-2xl font-medium shadow-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon icon="material-symbols:book-outline-rounded" className="text-xl" />
                Explore Resources
              </motion.div>
            </Link>

            <Link href="/emergency">
              <motion.div
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon icon="material-symbols:siren-rounded" className="text-xl" />
                Emergency
              </motion.div>
            </Link>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-8 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-slate-600">
              <Icon icon="mdi:phone" className="text-red-500" />
              <span>Crisis Support: <strong>1800-599-0019</strong> (24/7)</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex items-start justify-end -mt-40"
        >
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-14 bg-emerald-400/20 p-5 rounded-full"
            >
              <Icon icon="line-md:heart-filled" className="text-4xl text-emerald-600" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 left-12 bg-blue-400/20 p-5 rounded-full"
            >
              <Icon icon="material-symbols:psychology" className="text-4xl text-blue-600" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/4 left-8 bg-purple-400/20 p-4 rounded-full"
            >
              <Icon icon="material-symbols:diversity-3" className="text-2xl text-purple-600" />
            </motion.div>

            {/* Main Illustration */}
            <div className="text-center space-y-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Icon icon="material-symbols:self-care" className="text-[10rem] text-slate-700" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="font-poppins font-medium text-2xl text-slate-700">Safe Space</h3>
                <p className="text-slate-600 text-base">Confidential • Accessible • Supportive</p>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -z-10 top-0 left-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl" />
          <div className="absolute -z-10 bottom-0 right-0 w-52 h-52 bg-blue-200/30 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
