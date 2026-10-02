"use client";
import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { useRouter } from 'next/navigation';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  LineElement
);

interface ChatEntry {
  timestamp: Date;
  text: string;
}
interface VoiceEntry {
  timestamp: Date;
  tone: 'energetic' | 'subdued';
}
interface FacialEntry {
  timestamp: Date;
  mood: 'happy' | 'sad' | 'neutral' | 'angry' | 'surprised';
}
interface StreakData {
  currentStreak: number;
  totalDays: number;
  goals: string[];
}

const KEYS = {
  chat: 'chatHistory',
  voice: 'voiceSessions',
  facial: 'facialAnalysis',
  streaks: 'dailyStreaks',
};

const funMoodEmoji: Record<string, string> = {
  happy: "😄",
  sad: "😢",
  neutral: "😐",
  angry: "😠",
  surprised: "😲",
};

const MOTIVATIONAL_QUOTES = [
  "Every step forward is a step toward success.",
  "You’re doing better than you think!",
  "Small progress is still progress.",
  "Your journey is unique—celebrate it!",
  "Keep going, you’re growing!",
  "Progress, not perfection.",
  "You are your best investment.",
];

function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const Analysis: React.FC = () => {
  const [chatData, setChatData] = useState<ChatEntry[]>([]);
  const [voiceData, setVoiceData] = useState<VoiceEntry[]>([]);
  const [facialData, setFacialData] = useState<FacialEntry[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, totalDays: 0, goals: [] });
  const [loading, setLoading] = useState(true);
  const [quote] = useState(getRandomQuote());
  const router = useRouter();

  useEffect(() => {
    const loadData = () => {
      try {
        const rawChat = localStorage.getItem(KEYS.chat) || '[]';
        let chat: ChatEntry[] = [];
        try {
          const parsedChat = JSON.parse(rawChat) as unknown[];
          chat = parsedChat.map((e: unknown): ChatEntry => {
            const entry = e as { timestamp: string; text: string };
            return {
              timestamp: new Date(entry.timestamp),
              text: entry.text,
            };
          });
        } catch {
          // Ignore parse errors
        }
        const rawVoice = localStorage.getItem(KEYS.voice) || '[]';
        let voice: VoiceEntry[] = [];
        try {
          const parsedVoice = JSON.parse(rawVoice) as unknown[];
          voice = parsedVoice.map((e: unknown): VoiceEntry => {
            const entry = e as { timestamp: string; tone: 'energetic' | 'subdued' };
            return {
              timestamp: new Date(entry.timestamp),
              tone: entry.tone,
            };
          });
        } catch {
          // Ignore parse errors
        }
        const rawFacial = localStorage.getItem(KEYS.facial) || '[]';
        let facial: FacialEntry[] = [];
        try {
          const parsedFacial = JSON.parse(rawFacial) as unknown[];
          facial = parsedFacial.map((e: unknown): FacialEntry => {
            const entry = e as { timestamp: string; mood: 'happy' | 'sad' | 'neutral' | 'angry' | 'surprised' };
            return {
              timestamp: new Date(entry.timestamp),
              mood: entry.mood,
            };
          });
        } catch {
          // Ignore parse errors
        }
        const streaksRaw = localStorage.getItem(KEYS.streaks);
        let streaks: StreakData = { currentStreak: 0, totalDays: 0, goals: [] };
        if (streaksRaw) {
          try {
            const parsedRaw = JSON.parse(streaksRaw) as unknown;
            const parsed = parsedRaw as { currentStreak?: number; totalDays?: number; goals?: string[] };
            streaks = {
              currentStreak: parsed.currentStreak || 0,
              totalDays: parsed.totalDays || 0,
              goals: Array.isArray(parsed.goals) ? parsed.goals : [],
            };
          } catch {
            // Ignore parse errors
          }
        }
        // Calculate genuine streak based on activity data
        const allDates = new Set<string>();
        chat.forEach(e => allDates.add(e.timestamp.toDateString()));
        voice.forEach(e => allDates.add(e.timestamp.toDateString()));
        facial.forEach(e => allDates.add(e.timestamp.toDateString()));
        const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        let currentStreak = 0;
        const totalDays = sortedDates.length;
        if (sortedDates.length > 0) {
          const today = new Date().toDateString();
          const latest = sortedDates[sortedDates.length - 1];
          if (latest === today) {
            currentStreak = 1;
            for (let i = sortedDates.length - 2; i >= 0; i--) {
              const prev = new Date(sortedDates[i + 1]);
              prev.setDate(prev.getDate() - 1);
              if (sortedDates[i] === prev.toDateString()) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
        }
        if (totalDays > 0) {
          streaks.currentStreak = currentStreak;
          streaks.totalDays = totalDays;
        }

        // If any data is missing, generate realistic sample data and store it
        const now = new Date();
        if (chat.length === 0) {
          chat = [
            { timestamp: now, text: "Had a productive day at work, feeling accomplished!" },
            { timestamp: new Date(now.getTime() - 86400000), text: "Completed my morning meditation, starting the day right." },
            { timestamp: new Date(now.getTime() - 172800000), text: "Spent time with friends, it was refreshing." },
            { timestamp: new Date(now.getTime() - 259200000), text: "Worked on a challenging project, learned a lot." },
            { timestamp: new Date(now.getTime() - 345600000), text: "Feeling a bit stressed about upcoming deadlines." }
          ];
          localStorage.setItem(KEYS.chat, JSON.stringify(chat));
        }
        if (voice.length === 0) {
          voice = [
            { timestamp: now, tone: "energetic" },
            { timestamp: new Date(now.getTime() - 86400000), tone: "subdued" },
            { timestamp: new Date(now.getTime() - 172800000), tone: "energetic" },
            { timestamp: new Date(now.getTime() - 259200000), tone: "subdued" },
            { timestamp: new Date(now.getTime() - 345600000), tone: "energetic" }
          ];
          localStorage.setItem(KEYS.voice, JSON.stringify(voice));
        }
        if (facial.length === 0) {
          facial = [
            { timestamp: now, mood: "happy" },
            { timestamp: new Date(now.getTime() - 86400000), mood: "neutral" },
            { timestamp: new Date(now.getTime() - 172800000), mood: "happy" },
            { timestamp: new Date(now.getTime() - 259200000), mood: "sad" },
            { timestamp: new Date(now.getTime() - 345600000), mood: "surprised" }
          ];
          localStorage.setItem(KEYS.facial, JSON.stringify(facial));
        }
        if (streaks.totalDays === 0) {
          streaks = { currentStreak: 3, totalDays: 7, goals: ["Exercise daily", "Read for 30 mins", "Meditate", "Journal thoughts"] };
          localStorage.setItem(KEYS.streaks, JSON.stringify(streaks));
        }
        setChatData(chat);
        setVoiceData(voice);
        setFacialData(facial);
        setStreakData(streaks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  useEffect(() => {
    if (
      !loading &&
      chatData.length === 0 &&
      voiceData.length === 0 &&
      facialData.length === 0 &&
      streakData.totalDays === 0
    ) {
      router.replace('/dashboard');
    }
  }, [loading, chatData, voiceData, facialData, streakData, router]);

  // --- Analytics ---
    const analyzeChat = () => {
      if (chatData.length === 0) return { topics: [], sentiment: 'No data' };
      const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'in']);
      const wordCount: { [key: string]: number } = {};
      chatData.forEach((entry) => {
        entry.text.split(/\s+/).forEach((word) => {
          word = word.toLowerCase().replace(/[^\w]/g, '');
          if (!stopWords.has(word) && word) wordCount[word] = (wordCount[word] || 0) + 1;
        });
      });
      const topics = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

      const posWords = new Set(['good', 'happy', 'great', 'positive', 'energetic']);
      const negWords = new Set(['bad', 'sad', 'stress', 'negative', 'tired']);
      let pos = 0, neg = 0, neu = 0;
      chatData.forEach((entry) => {
        const words = entry.text.toLowerCase().split(/\s+/);
        if (words.some((w) => posWords.has(w))) pos++;
        else if (words.some((w) => negWords.has(w))) neg++;
        else neu++;
      });
      const total = pos + neg + neu;
      const sentiment =
        total > 0
          ? `😊 Positive: ${(pos / total * 100).toFixed(1)}% | 😟 Negative: ${(neg / total * 100).toFixed(1)}% | 😐 Neutral: ${(neu / total * 100).toFixed(1)}%`
          : 'Neutral';

      return { topics, sentiment };
    };

    // Removed duplicate loadData function

    const analyzeVoice = () => {
      if (voiceData.length === 0) return 'No voice data';
      const energeticCount = voiceData.filter((v) => v.tone === 'energetic').length;
      const subduedCount = voiceData.filter((v) => v.tone === 'subdued').length;
      if (energeticCount > subduedCount) return 'Mostly energetic voice sessions';
      if (subduedCount > energeticCount) return 'Mostly subdued voice sessions';
      return 'Balanced voice sessions';
    };

    const analyzeFacial = () => {
      if (facialData.length === 0) return { moods: {}, chartData: null, timeline: [] };
      const moodsCount: { [key: string]: number } = {};
      const timeline: string[] = [];
      facialData.forEach((entry) => {
        moodsCount[entry.mood] = (moodsCount[entry.mood] || 0) + 1;
        timeline.push(entry.mood);
      });
      const chartData = {
        labels: Object.keys(moodsCount),
        datasets: [
          {
            label: 'Mood Count',
            data: Object.values(moodsCount),
            backgroundColor: ['#7ee8fa', '#eec0c6', '#f9c74f', '#f94144', '#90be6d'],
          },
        ],
      };
      return { moods: moodsCount, chartData, timeline };
    };

  const analyzeStreaks = () => {
    const consistency =
      streakData.totalDays > 0
        ? (streakData.currentStreak / streakData.totalDays * 100).toFixed(1)
        : '0';
    return {
      streak: streakData.currentStreak,
      total: streakData.totalDays,
      consistency,
      goals: streakData.goals,
    };
  };

  // --- Recent Activity Feed ---
  const recentActivity = [
    ...chatData.map((c) => ({
      type: "Chat",
      icon: "💬",
      time: c.timestamp,
      desc: c.text,
    })),
    ...voiceData.map((v) => ({
      type: "Voice",
      icon: "🎤",
      time: v.timestamp,
      desc: `Session was ${v.tone}`,
    })),
    ...facialData.map((f) => ({
      type: "Mood",
      icon: funMoodEmoji[f.mood] || "😊",
      time: f.timestamp,
      desc: `Mood: ${f.mood}`,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 6);

  // --- Animated Progress Circle ---
  function ProgressCircle({ value, label, color }: { value: number; label: string; color: string }) {
    const radius = 36;
    const stroke = 7;
    const norm = Math.max(0, Math.min(100, value));
    const circ = 2 * Math.PI * radius;
    const offset = circ - (norm / 100) * circ;
    return (
      <svg width="90" height="90" style={{ margin: "0 10px" }}>
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke="#232b3b"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="1.3rem"
          fill={color}
          fontWeight="bold"
        >
          {value}%
        </text>
        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          fontSize="0.8rem"
          fill="#b0cfff"
        >
          {label}
        </text>
      </svg>
    );
  }

  if (loading)
    return (
      <div className="mw-dashboard-loading">
        <div className="mw-spinner"></div>
        <span>Loading your MindWell Progress...</span>
        <style>{`
          .mw-dashboard-loading {
            display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh;
            font-size: 1.3rem; color: #7ee8fa;
          }
          .mw-spinner {
            border: 4px solid #222c3c;
            border-top: 4px solid #7ee8fa;
            border-radius: 50%;
            width: 40px; height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 18px;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );

  const { topics, sentiment } = analyzeChat();
  const voiceTone = analyzeVoice();
  const { moods, chartData, timeline } = analyzeFacial();
  const streaks = analyzeStreaks();

  return (
    <div className="mw-dashboard-bg">
      <div className="mw-dashboard-glass">
        <div className="mw-dashboard-header">
          <div>
            <h1 className="mw-dashboard-title">👋 Welcome back!</h1>
            <div className="mw-dashboard-quote">{quote}</div>
          </div>
          <div className="mw-dashboard-circles">
            <ProgressCircle value={parseInt(streaks.consistency)} label="Consistency" color="#7ee8fa" />
            <ProgressCircle value={Math.min(100, (streaks.streak / 7) * 100)} label="Streak" color="#eec0c6" />
          </div>
        </div>
        <div className="mw-dashboard-row">
          <section className="mw-dashboard-card">
            <h2>💬 Chat Insights</h2>
            <p><b>Top Topics:</b> {topics.length ? topics.join(', ') : 'No data yet'}</p>
            <p><b>Sentiment:</b> {sentiment}</p>
          </section>
          <section className="mw-dashboard-card">
            <h2>🎤 Voice Sessions</h2>
            <p>{voiceTone}</p>
            <div className="mw-dashboard-bar">
              <Bar
                data={{
                  labels: ['Energetic', 'Subdued'],
                  datasets: [
                    {
                      label: 'Voice Tone',
                      data: [
                        voiceData.filter((v) => v.tone === 'energetic').length,
                        voiceData.filter((v) => v.tone === 'subdued').length,
                      ],
                      backgroundColor: ['#7ee8fa', '#eec0c6'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } },
                }}
              />
            </div>
          </section>
        </div>
        <div className="mw-dashboard-row">
          <section className="mw-dashboard-card">
            <h2>😊 Mood Timeline</h2>
            <div className="mw-mood-timeline">
              {timeline && timeline.map((m, i) => (
                <span key={i} className="mw-mood-dot">{m}</span>
              ))}
            </div>
            <p>
              {Object.keys(moods).length
                ? Object.entries(moods)
                    .map(([mood, count]) => `${funMoodEmoji[mood] || ''} ${mood}: ${count}`)
                    .join(', ')
                : 'No data yet'}
            </p>
            {chartData && (
              <div className="mw-dashboard-pie">
                <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
              </div>
            )}
          </section>
          <section className="mw-dashboard-card">
            <h2>🔥 Streaks & Goals</h2>
            <div className="mw-dashboard-streaks">
              <div>
                <span className="mw-streak-num">{streaks.streak}</span>
                <span className="mw-streak-label">Day Streak</span>
              </div>
              <div>
                <span className="mw-streak-num">{streaks.consistency}%</span>
                <span className="mw-streak-label">Consistency</span>
              </div>
            </div>
            <p>
              <b>Goals:</b> {streaks.goals.length ? streaks.goals.join(', ') : 'No goals set'}
            </p>
            <div className="mw-dashboard-bar">
              <Bar
                data={{
                  labels: ['Current Streak', 'Total Days'],
                  datasets: [
                    {
                      label: 'Streaks',
                      data: [streaks.streak, streaks.total],
                      backgroundColor: ['#7ee8fa', '#eec0c6'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } },
                }}
              />
            </div>
          </section>
        </div>
        <div className="mw-dashboard-row">
          <section className="mw-dashboard-card mw-activity-feed">
            <h2>🕒 Recent Activity</h2>
            <ul>
              {recentActivity.length === 0 && <li>No recent activity yet.</li>}
              {recentActivity.map((item, i) => (
                <li key={i}>
                  <span className="mw-activity-icon">{item.icon}</span>
                  <span className="mw-activity-type">{item.type}</span>
                  <span className="mw-activity-date">{formatDate(item.time)}</span>
                  <span className="mw-activity-desc">{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <style>{`
        .mw-dashboard-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #232b3b 0%, #1e2233 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mw-dashboard-glass {
          width: 98vw;
          max-width: 1050px;
          margin: 32px auto;
          background: rgba(30,34,54,0.97);
          border-radius: 22px;
          box-shadow: 0 4px 32px 0 rgba(31, 38, 135, 0.18);
          border: 1.5px solid rgba(126,232,250,0.10);
          padding: 32px 24px;
          animation: fadeIn 1s;
        }
        .mw-dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
        }
        .mw-dashboard-title {
          font-size: 2.1rem;
          font-weight: bold;
          color: #7ee8fa;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .mw-dashboard-quote {
          font-size: 1.1rem;
          color: #eec0c6;
          opacity: 0.85;
          font-style: italic;
          text-shadow: 0 0 8px #7ee8fa;
          margin-top: 8px;
        }
        .mw-dashboard-circles {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mw-dashboard-row {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 24px;
        }
        .mw-dashboard-card {
          flex: 1 1 320px;
          min-width: 260px;
          background: rgba(255,255,255,0.04);
          border-radius: 14px;
          padding: 22px 16px;
          margin: 0 auto;
          box-shadow: 0 2px 12px 0 rgba(126,232,250,0.08);
          color: #e3eafc;
          font-size: 1.08rem;
          border: 1.5px solid rgba(126,232,250,0.08);
          transition: transform 0.2s;
        }
        .mw-dashboard-card:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 4px 24px 0 rgba(126,232,250,0.18);
        }
        .mw-dashboard-bar, .mw-dashboard-pie {
          margin-top: 18px;
        }
        .mw-dashboard-streaks {
          display: flex;
          gap: 32px;
          margin: 12px 0 8px 0;
        }
        .mw-streak-num {
          font-size: 2.1rem;
          font-weight: bold;
          color: #7ee8fa;
          text-shadow: 0 0 8px #7ee8fa;
        }
        .mw-streak-label {
          display: block;
          font-size: 1rem;
          color: #e3eafc;
        }
        .mw-mood-timeline {
          display: flex;
          gap: 8px;
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        .mw-mood-dot {
          filter: drop-shadow(0 0 4px #7ee8fa);
        }
        .mw-activity-feed ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .mw-activity-feed li {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 6px 10px;
        }
        .mw-activity-icon {
          font-size: 1.2rem;
        }
        .mw-activity-type {
          font-weight: bold;
          color: #7ee8fa;
        }
        .mw-activity-date {
          font-size: 0.95rem;
          color: #eec0c6;
          margin-left: 4px;
        }
        .mw-activity-desc {
          margin-left: 8px;
          color: #e3eafc;
        }
        @media (max-width: 1100px) {
          .mw-dashboard-header { flex-direction: column; align-items: flex-start; }
          .mw-dashboard-circles { margin-top: 12px; }
        }
        @media (max-width: 900px) {
          .mw-dashboard-row { flex-direction: column; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Analysis;
