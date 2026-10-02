import React, { useEffect, useState } from 'react';
import { useStreak } from './useStreak';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyStreakPopupProps {
  userId: string | null;
  onComplete?: () => void;
  onClose?: () => void;
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const badgeMilestones = [3, 7, 14, 30, 60, 100];
const defaultTasks = [
  'Reflect on one positive thing today',
  'Take a 5-minute mindful break',
  'Write down something you are grateful for',
  'Do a quick breathing exercise',
  'Spend 10 minutes outside',
  'Practice a random act of kindness',
  'Set a small goal for tomorrow',
];

interface DailyStreakPopupProps {
  userId: string;
  onComplete?: () => void;
  onClose?: () => void;
}

const DailyStreakPopup: React.FC<DailyStreakPopupProps> = ({ userId, onComplete, onClose }) => {
  const { streak, lastCompleted, completeToday } = useStreak(userId);
  const [completed, setCompleted] = useState(false);
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const dayOfYear = getDayOfYear();
  const todayDateObj = new Date();
  const todayTask = (customTasks.length ? customTasks : defaultTasks)[dayOfYear % 7];
  const today = todayDateObj.toDateString();
  const dayName = todayDateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = todayDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    setCompleted(lastCompleted && new Date(lastCompleted).toDateString() === today);
  }, [lastCompleted, today]);

  useEffect(() => {
    if (!completed && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('MindWell Daily Task', { body: `Don't forget: ${todayTask}` });
    }
  }, [completed, todayTask]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleComplete = async () => {
    await completeToday();
    setCompleted(true);
    if (onComplete) onComplete();
  };

  const handleContinue = () => {
    if (onClose) onClose();
  };

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setCustomTasks([...customTasks, taskInput.trim()]);
      setTaskInput('');
    }
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const done = streak > i;
      return (
        <div key={i} className={`w-6 h-6 rounded-full mx-1 ${done ? 'bg-emerald-400' : 'bg-gray-700'}`}></div>
      );
    });
    return <div className="flex justify-center mb-2">{days}</div>;
  };

  const renderBadges = () => {
    return (
      <div className="flex gap-2 mb-2 justify-center">
        {badgeMilestones.map(m => (
          <span key={m} className={`px-2 py-1 rounded text-xs ${streak >= m ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'}`}>{m}d</span>
        ))}
      </div>
    );
  };

  // Debug output (move just before return)
  useEffect(() => {
    console.log('[DailyStreakPopup] userId:', userId);
    console.log('[DailyStreakPopup] streak:', streak);
    console.log('[DailyStreakPopup] lastCompleted:', lastCompleted);
    console.log('[DailyStreakPopup] completed:', completed);
  }, [userId, streak, lastCompleted, completed]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-[#1a2236] text-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-emerald-500 flex flex-col items-center"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
        >
          <h2 className="text-2xl font-bold mb-2 text-emerald-400 tracking-tight">Daily Streak Challenge</h2>
          <div className="mb-4 text-center">
            <span className="text-lg font-semibold text-emerald-300">{dayName}</span>
            <span className="mx-2 text-white/70">|</span>
            <span className="text-md text-white/80">{dateString}</span>
          </div>
          {renderBadges()}
          {renderCalendar()}
          <p className="mb-4 text-lg">Task: <span className="font-semibold text-emerald-300">{todayTask}</span></p>
          <div className="flex gap-4 mb-6 w-full">
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold flex-1 transition"
              onClick={handleComplete}
              disabled={completed}
              suppressHydrationWarning={true}
            >
              Mark as Done
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex-1 transition"
              onClick={handleContinue}
              disabled={completed}
              suppressHydrationWarning={true}
            >
              Continue
            </button>
          </div>
          <p className="text-md text-emerald-300 mb-2">Current streak: <span className="font-bold">{streak}</span> days</p>
          <div className="mt-4 w-full">
            <input
              type="text"
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              placeholder="Add your own task"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-2 border border-gray-700"
              suppressHydrationWarning={true}
            />
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg w-full font-semibold transition"
              onClick={handleAddTask}
              suppressHydrationWarning={true}
            >
              Add Task
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyStreakPopup;
