// app/dashboard/new-chat/page.tsx
'use client';

import React from 'react';
import DashboardShell from '@/app/components/DashboardShell';
import ChatUI from '@/app/components/ChatUI';

export default function NewChatPage() {
  return (
    <DashboardShell>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-white mb-4">New Chat</h1>
        <ChatUI />
      </div>
    </DashboardShell>
  );
}
