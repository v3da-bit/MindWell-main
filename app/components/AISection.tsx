'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import ChatWidget from '@/app/components/ChatWidget';

export default function AISection() {
  const handleTryAI = () => {
    const el = document.getElementById('native-chat');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="ai">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-800 mb-4 text-center"
        >
          AI Support
        </motion.h1>
        <h2 className="font-poppins font-medium text-2xl sm:text-3xl text-slate-700 mb-4 text-center">
          Your 24/7 Mental Health Companion
        </h2>
        {/* Badge and Subheading */}
        <div className="inline-flex items-center gap-2 bg-emerald-100/50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Icon icon="material-symbols:psychology" />
          AI First-Aid Support
        </div>
        <h3 className="font-poppins font-medium text-xl text-slate-800 mb-4 text-center">
          Your 24/7 Mental Health Companion
        </h3>
        <p className="text-lg text-slate-600 leading-relaxed text-center mb-8">
          Our AI-powered support system uses evidence-based CBT techniques to provide immediate help when you need it most. Smart escalation ensures you get professional support when necessary.
        </p>
        {/* Features */}
        <div className="space-y-6 w-full">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
              <Icon icon="mdi:clock-outline" className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 mb-1">Available 24/7</h3>
              <p className="text-slate-600 text-sm">Get support anytime, anywhere</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <Icon icon="mdi:shield-outline" className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 mb-1">Secure & private</h3>
              <p className="text-slate-600 text-sm">Your conversations are protected and stay between you and MindWell</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-cyan-100 p-2 rounded-lg flex-shrink-0">
              <Icon icon="mdi:brain" className="text-cyan-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 mb-1">CBT-Based Techniques</h3>
              <p className="text-slate-600 text-sm">Evidence-based coping strategies and therapeutic exercises</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={handleTryAI}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <Icon icon="material-symbols:chat-outline-rounded" />
          Try AI Support Now
        </motion.button>
        {/* Chat Widget below all headings/content */}
        <div className="w-full mt-12">
          <ChatWidget />
        </div>
      </div>
    </section>
  );
}