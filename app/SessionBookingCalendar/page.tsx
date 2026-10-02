'use client';

import React, { useState } from 'react';

export default function SessionBookingCalendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">Book a Session</h2>
      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full mb-2 p-2 rounded border" />
      <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full mb-2 p-2 rounded border" />
      <button disabled={!selectedDate || !selectedTime} className="w-full bg-emerald-500 text-white py-2 rounded">Book</button>
    </div>
  );
}
