'use client';

import React, { useState } from 'react';

export default function PeerSupportChat() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { user: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">Peer Support Chat</h2>
      <div className="h-40 overflow-y-auto border rounded mb-2 p-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1"><span className="font-bold">{msg.user}:</span> {msg.text}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 rounded border mb-2" placeholder="Type your message..." />
      <button onClick={sendMessage} className="w-full bg-emerald-500 text-white py-2 rounded">Send</button>
    </div>
  );
}
