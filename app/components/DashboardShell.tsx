"use client";
import React, { useState } from 'react';
import DailyStreakPopup from './DailyStreakPopup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Sidebar from '@/app/components/Sidebar';
import EmergencyButton from '@/app/EmergencyButton/page';
import ChatWidget from './ChatWidget';
import SpeechInterface from './SpeechInterface';
// import FaceRecog from './FaceRecog';

type ChatMode = 'text' | 'speech' | 'face';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [chatMode, setChatMode] = useState<ChatMode>('text');
  const [doneToday, setDoneToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreakPopup, setShowStreakPopup] = useState(false);

  // Privacy Notice: Banner text
  const privacyText = "Your data is protected and anonymous. No personal info is shared with administrators.";

  const handleDone = async () => {
    if (!doneToday) {
      setShowStreakPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white" role="main" tabIndex={0}>
      {/* Emergency Support Button */}
      <React.Fragment>
        {showStreakPopup && (
          <DailyStreakPopup
            userId={null}
            onComplete={async () => {
              setDoneToday(true);
              setStreak((prev) => prev + 1);
              setShowStreakPopup(false);
            }}
            onClose={() => setShowStreakPopup(false)}
          />
        )}
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="px-2 py-1 rounded bg-emerald-500 text-white text-xs hover:bg-emerald-600"
                title="Go Back"
                tabIndex={0}
              >
                ← Back
              </button>
              <Link href="/" className="text-white font-semibold" tabIndex={0}>
                MindWell
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg bg-white/10 p-1">
                <button
                  onClick={() => setChatMode('text')}
                  className={`px-2 py-1 text-xs rounded ${
                    chatMode === 'text' ? 'bg-emerald-500 text-white' : 'text-white/80'
                  }`}
                  aria-pressed={chatMode === 'text'}
                  tabIndex={0}
                >
                  <Icon icon="mdi:chat-outline" className="inline-block mr-1" />
                  Text
                </button>
                <button
                  onClick={() => setChatMode('speech')}
                  className={`px-2 py-1 text-xs rounded ${
                    chatMode === 'speech' ? 'bg-emerald-500 text-white' : 'text-white/80'
                  }`}
                  aria-pressed={chatMode === 'speech'}
                  tabIndex={0}
                >
                  <Icon icon="mdi:microphone-outline" className="inline-block mr-1" />
                  Voice
                </button>
                <button
                  onClick={() => setChatMode('face')}
                  className={`px-2 py-1 text-xs rounded ${
                    chatMode === 'face' ? 'bg-emerald-500 text-white' : 'text-white/80'
                  }`}
                  aria-pressed={chatMode === 'face'}
                  tabIndex={0}
                >
                  <Icon icon="mdi:face-recognition" className="inline-block mr-1" />
                  Face
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Privacy Notice Banner */}
        <div className="w-full bg-emerald-900/80 text-emerald-200 text-center py-2 text-xs font-medium">
          {privacyText}
        </div>
        <EmergencyButton />
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 py-6">
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
          <section className="space-y-4">
            <div>
              <button
                onClick={handleDone}
                disabled={doneToday}
                className={`px-4 py-2 rounded ${
                  doneToday ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white`}
                tabIndex={0}
              >
                {doneToday ? 'Done for Today' : 'Show Tasks'}
              </button>
              <span className="ml-4">Streak: {streak}</span>
            </div>
            
            {/* Render mode-specific component */}
            {chatMode === 'text' && (
              <div className="mt-4">
                <ChatWidget />
              </div>
            )}
            {chatMode === 'speech' && (
              <div className="mt-4">
                <SpeechInterface />
              </div>
            )}
            {chatMode === 'face' && (
              <div className="mt-4">
                {/* <FaceRecog /> */}
                <p className="text-gray-400">Face recognition feature disabled - requires ML models</p>
              </div>
            )}
            
            {children}
          </section>
        </div>
      </React.Fragment>
    </div>
  );
}
