'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface Msg {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const makeId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (crypto as any).randomUUID();
    }
  } catch {}
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'm1', role: 'assistant', content: "Hi! I’m here to support your mental well-being. I can help with stress, anxiety, burnout, student well-being, and checkups." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Msg = { id: makeId(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })).slice(-12);
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error || 'Something went wrong');
      }

      const data = (await res.json()) as { reply: string };
      const aiMsg: Msg = { id: makeId(), role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const aiMsg: Msg = {
        id: makeId(),
        role: 'assistant',
        content:
          (e as Error).message || 'Sorry, I could not respond right now. Please try again.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col rounded-lg border border-slate-200 bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm text-slate-900">AI Support Chat</h2>
          <p className="text-xs text-slate-500">Short, supportive guidance for student well-being</p>
        </div>
      </div>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === 'assistant'
                ? 'bg-slate-100 text-slate-800'
                : 'ml-auto bg-slate-900 text-white'
            }`}
          >
            {m.content}
          </motion.div>
        ))}
      </div>
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <button
            className="hidden sm:flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-50"
            title="Attach"
          >
            <Icon icon="solar:paperclip-linear" className="text-lg" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about stress, anxiety, burnout, checkups..."
            rows={1}
            className="min-h-[36px] max-h-40 w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <button
            onClick={() => void send()}
            className="flex items-center justify-center rounded-full bg-slate-900 p-2 text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={!input.trim() || sending}
            title="Send"
          >
            <Icon icon="solar:arrow-up-linear" className="text-lg" />
          </button>
        </div>
        <p className="mt-1 text-center text-[11px] text-slate-500">AI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}