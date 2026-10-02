'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function BookingSection() {
  const [selectedDate, setSelectedDate] = useState('2024-09-15');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedType, setSelectedType] = useState('counselor');

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const counselorTypes = [
    {
      id: 'counselor',
      name: 'Campus Counselor',
      icon: 'material-symbols:person',
      description: 'In-person sessions with trained campus counselors',
      availability: 'Mon-Fri, 9AM-5PM'
    },
    {
      id: 'helpline',
      name: 'Mental Health Helpline',
      icon: 'mdi:phone',
      description: 'Phone consultation with mental health professionals',
      availability: '24/7 Available'
    },
    {
      id: 'group',
      name: 'Group Sessions',
      icon: 'material-symbols:group',
      description: 'Peer group therapy sessions with professional facilitator',
      availability: 'Weekly sessions'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="booking">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Icon icon="mdi:calendar-outline" />
                Confidential Booking
              </div>
              <h2 className="font-poppins font-medium text-4xl text-slate-800 mb-4">
                Private, Secure Professional Support
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Book confidential sessions with on-campus counselors or mental health professionals. 
                Your privacy is our priority - even administrators cannot see your personal information.
              </p>
            </div>

            {/* Privacy Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:shield-lock" className="text-green-600 text-xl" />
                <span className="text-slate-700">End-to-end encrypted booking system</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:eye-off" className="text-green-600 text-xl" />
                <span className="text-slate-700">Anonymous to administrators</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:email-off" className="text-green-600 text-xl" />
                <span className="text-slate-700">No identifying information in confirmations</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:calendar-sync" className="text-green-600 text-xl" />
                <span className="text-slate-700">Integrated with Google Calendar & Outlook</span>
              </div>
            </div>

            {/* Support Types */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <h3 className="font-poppins font-medium text-lg text-slate-800 mb-4">Available Support Types</h3>
              <div className="space-y-3">
                {counselorTypes.map((type) => (
                  <div key={type.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <Icon icon={type.icon} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{type.name}</h4>
                      <p className="text-slate-600 text-sm mb-1">{type.description}</p>
                      <span className="text-xs text-blue-600 font-medium">{type.availability}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="sticky top-8"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/30">
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:calendar-heart" className="text-2xl text-blue-600" />
                <h3 className="font-poppins font-medium text-xl text-slate-800">Book Your Session</h3>
              </div>

              {/* Support Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Support Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {counselorTypes.map((type) => (
                    <label key={type.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="supportType"
                        value={type.id}
                        checked={selectedType === type.id}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-white/30 bg-white/10 hover:border-white/50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Icon icon={type.icon} className={selectedType === type.id ? 'text-blue-600' : 'text-slate-600'} />
                          <div>
                            <div className={`font-medium ${selectedType === type.id ? 'text-blue-800' : 'text-slate-800'}`}>
                              {type.name}
                            </div>
                            <div className="text-xs text-slate-600">{type.availability}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-white/30 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Available Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm rounded-lg transition-all ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/30 text-slate-700 hover:bg-white/40'
                      }`}
                      suppressHydrationWarning={true}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                suppressHydrationWarning={true}
              >
                <Icon icon="mdi:shield-check" />
                Book Confidentially
              </motion.button>

              {/* Privacy Notice */}
              <div className="mt-4 p-3 bg-green-100/20 rounded-lg border border-green-200/30">
                <div className="flex items-start gap-2">
                  <Icon icon="mdi:information" className="text-green-600 text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">
                    Your booking is completely confidential. Only you and your counselor will have access to session details.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}