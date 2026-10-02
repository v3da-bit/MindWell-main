'use client';

import React from 'react';

type Props = {
  open: boolean;
  dateLabel: string;
  task: string;
  streak: number;
  onComplete: () => void;
  onClose: () => void;
};

export default function DailyStreakModal({ open, dateLabel, task, streak, onComplete, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-indigo-700">Daily Check-in</h2>
        <p className="mt-1 text-sm text-gray-500">{dateLabel}</p>

        <div className="mt-4 rounded-lg bg-indigo-50 p-4">
          <p className="text-gray-800">
            Today’s task:
          </p>
          <p className="mt-1 font-semibold text-indigo-900">{task}</p>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Current streak: <span className="font-bold text-indigo-700">{streak} day{streak === 1 ? '' : 's'}</span>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Later
          </button>
          <button
            onClick={onComplete}
            className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            I’ve done it
          </button>
        </div>
      </div>
    </div>
  );
}
