'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import BookingSection from '@/app/components/BookingSection';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { supabase } from '@/lib/supabaseClient';

export default function BookPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  const handleBookClick = async () => {
    console.log('Book a Session clicked');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session:', session);
    if (session) {
      setPopupMessage('Booking confirmed');
      setPopupType('success');
    } else {
      setPopupMessage('Please Create an Account First');
      setPopupType('error');
    }
    setShowPopup(true);
    console.log('Popup shown');
    setTimeout(() => {
      setShowPopup(false);
      console.log('Popup hidden');
    }, 3000); // Auto-hide after 3 seconds
  };

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
            <Icon icon="mdi:calendar-outline" className="text-2xl text-blue-600" />
            <h1 className="font-poppins font-medium text-3xl text-slate-800 cursor-pointer" onClick={handleBookClick}>Book a Session</h1>
          </motion.div>
          <p className="text-slate-600 max-w-2xl">Confidential counseling with campus professionals. Pick your preferred support type, date, and time.</p>
        </div>
      </section>

      <BookingSection />

      <Footer />

      {/* Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`p-4 rounded-lg text-white shadow-lg relative border-2 ${popupType === 'success' ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`}>
            {popupMessage}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-1 right-1 text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
