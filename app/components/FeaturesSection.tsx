'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'material-symbols:psychology',
      title: 'AI-Guided First-Aid Support',
      description: '24/7 anonymous AI chatbot providing coping strategies and smart escalation to professionals when needed.',
      color: 'emerald',
      href: '#ai'
    },
    {
      icon: 'mdi:calendar-outline',
      title: 'Confidential Booking System',
      description: 'Secure, private booking with on-campus counselors and mental health helplines.',
      color: 'blue',
      href: '#booking'
    },
    {
      icon: 'material-symbols:book-outline-rounded',
      title: 'Psychoeducational Hub',
      description: 'Videos, relaxation audio, and wellness guides available in multiple regional languages.',
      color: 'purple',
      href: '#resources'
    },
    {
      icon: 'material-symbols:diversity-3',
      title: 'Peer Support Platform',
      description: 'Moderated peer-to-peer support forum with trained student volunteers.',
      color: 'orange',
      href: '#community'
    },
    {
      icon: 'material-symbols:dashboard',
      title: 'Admin Dashboard',
      description: 'Anonymous analytics for institutions to recognize trends and plan interventions.',
      color: 'indigo',
      href: '#admin'
    }
  ];

  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200/50',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50'
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-medium text-4xl sm:text-5xl text-slate-800 mb-4">
            Complete Mental Health Support
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Five integrated features designed to provide comprehensive, accessible, and stigma-free mental health support for students.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.a
              key={feature.title}
              href={feature.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              viewport={{ once: true }}
              className="group block bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl mb-4 border ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <Icon icon={feature.icon} className="text-2xl" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-poppins font-medium text-xl text-slate-800 group-hover:text-slate-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <motion.div
                className="mt-4 flex items-center text-sm font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                Learn more
                <Icon icon="mdi:arrow-right" className="ml-2" />
              </motion.div>
            </motion.a>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">24/7</div>
              <div className="text-slate-600">Available Support</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">100%</div>
              <div className="text-slate-600">Anonymous & Private</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">5+</div>
              <div className="text-slate-600">Regional Languages</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}