import React from 'react';

export default function EmergencyButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a href="/emergency" className="bg-gradient-to-r from-rose-600 to-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:from-rose-700 hover:to-red-700 transition-all">
        🚨 Emergency Help
      </a>
    </div>
  );
}
