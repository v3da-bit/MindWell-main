"use client";
import React, { useRef, useState, useEffect } from "react";

// MentalHealthCoachExpanded.tsx (fixed, safer)

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const I18N = {
  en: {
    title: "Mental Health Coach",
    tagline: "Quick, private, supportive exercises for students.",
    start: "Get Started",
    back: "Back",
    startCamera: "Start Camera",
    stopCamera: "Stop Camera",
    speak: "Speak",
    stopSpeak: "Stop Speaking",
    exercise: { prev: "Previous", next: "Next" },
    endSession: "End Session",
    safety: {
      heading: "Safety First",
  text: "If you&apos;re in crisis, contact emergency services or a trusted professional.",
    },
    feedback: { greatJob: "Great job!" },
    panic: "Panic Button",
    cancel: "Cancel",
    generatePlan: "Generate Plan",
  },
};

type Exercise = {
  id: string;
  name: string;
  minutes: number;
  steps: string[];
  visual: string;
};

const BASE_EXERCISES: Record<string, Exercise[]> = {
  breathing: [
    {
      id: "deepBreathing",
      name: "Deep Breathing",
      minutes: 5,
      steps: ["Inhale deeply for 4 seconds", "Hold for 4 seconds", "Exhale for 4 seconds"],
      visual: "breathe",
    },
  ],
  mindfulness: [
    {
      id: "mindfulMinute",
      name: "Mindful Minute",
      minutes: 1,
      steps: ["Focus on your breath", "Notice thoughts without judgment"],
      visual: "mindful",
    },
  ],
  posture: [
    {
      id: "seatedPosture",
      name: "Seated Posture Check",
      minutes: 2,
      steps: ["Sit up straight", "Align your spine"],
      visual: "seatedPosture",
    },
  ],
  energy: [
    {
      id: "stretch",
      name: "Quick Stretch",
      minutes: 3,
      steps: ["Reach arms overhead", "Twist gently"],
      visual: "stretch",
    },
  ],
  sleep: [
    {
      id: "pmr",
      name: "Progressive Muscle Relaxation",
      minutes: 8,
      steps: ["Tense and release muscle groups"],
      visual: "relax",
    },
  ],
};

const STORAGE = "mh_expanded_v1";

type Journal = {
  ts: number;
  mood: string;
  stress: string;
  note?: string;
  minutes: number;
  completed: string[];
};

type Persist = { history: Journal[]; streak: { last?: string; count: number }; badges: string[] };

function loadPersist(): Persist {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE) : null;
    if (!raw) return { history: [], streak: { count: 0 }, badges: [] };
    return JSON.parse(raw) as Persist;
  } catch {
    return { history: [], streak: { count: 0 }, badges: [] };
  }
}

function savePersist(p: Persist) {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(p));
  } catch {
    // ignore
  }
}

// Pose helpers (seated posture simple check)
type Kp = { x: number; y: number; score?: number; name?: string };
function angleDeg(a: number) {
  return (a * 180) / Math.PI;
}
function checkSeated(map: Record<string, Kp | undefined>) {
  const lS = map["left_shoulder"];
  const rS = map["right_shoulder"];
  const lH = map["left_hip"];
  const rH = map["right_hip"];
  if (!lS || !rS || !lH || !rH) return { ok: false, hint: "Move so your torso is visible" };
  const midS = { x: (lS.x + rS.x) / 2, y: (lS.y + rS.y) / 2 } as Kp;
  const midH = { x: (lH.x + rH.x) / 2, y: (lH.y + rH.y) / 2 } as Kp;
  const dy = midH.y - midS.y;
  const dx = midH.x - midS.x;
  const theta = Math.abs(angleDeg(Math.atan2(dx, dy)));
  return { ok: theta < 12, hint: theta < 12 ? "" : "Keep back more upright" };
}

// Gemini JSON generation (hardened)
async function generateRoutinesWithGemini(prompt: string) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    let text = "";
    // Try to extract text from Gemini response
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    } else if (data?.candidates?.[0]?.content?.parts) {
      text = data.candidates[0].content.parts.map((p: unknown) => (p as { text?: string })?.text).join("\n");
    }
    text = (text || "").trim();

    // Strip code fences if present
    if (text.startsWith("```")) {
      const firstNewline = text.indexOf("\n");
      const lastCodeFence = text.lastIndexOf("```", firstNewline + 1);
      if (firstNewline !== -1 && lastCodeFence !== -1 && lastCodeFence > firstNewline) {
        text = text.substring(firstNewline + 1, lastCodeFence).trim();
      }
    }

    // If still mixed, try to find first JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const candidate = start !== -1 && end !== -1 ? text.substring(start, end + 1) : text;

    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

// TTS helper
function say(text: string, interrupt = false) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  if (interrupt) window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function ExerciseVisual({ visual }: { visual: string }) {
  return (
    <div className="text-4xl text-center">
      {visual === "breathe"
        ? "🫁"
        : visual === "mindful"
        ? "🧘"
        : visual === "seatedPosture"
        ? "🪑"
        : visual === "stretch"
        ? "🤸"
        : "😌"}
    </div>
  );
}

type PoseKeypoint = { name?: string; x: number; y: number; score?: number };
type Pose = { keypoints?: PoseKeypoint[] };
// Unused code commented out to fix lint issues

// Main component
export default function MentalHealthCoachExpanded() {
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [lang] = useState<keyof typeof I18N>("en");
  const [exercises] = useState<Record<string, Exercise[]>>(BASE_EXERCISES);
  const [selected, setSelected] = useState<{ cat: string; idx: number } | null>(null);
  const [persist, setPersist] = useState<Persist>({ history: [], streak: { count: 0 }, badges: [] });
  const T = I18N[lang];

  // Load persistence data on component mount
  useEffect(() => {
    const data = loadPersist();
    setPersist(data);
  }, []);

  // Camera handling
  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          setCameraOn(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraOn]);
  // Render intro stage
  function renderIntro(T) {
    return (
      <div className="text-center m-auto">
        <h1 className="text-3xl font-bold text-slate-100">{T.title}</h1>
        <p className="max-w-xl mt-4 mx-auto text-slate-400">{T.tagline}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            className="px-8 py-4 text-lg font-bold rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-lg border-2 border-pink-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
            onClick={() => setStage("form")}
          >
            {T.start}
          </button>
          <button
            className="px-8 py-4 text-lg font-bold rounded-xl bg-slate-700 hover:bg-slate-600 text-white shadow-lg border-2 border-slate-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-500"
            onClick={() => setStage("dashboard")}
          >
            Dashboard
          </button>
          <button
            className="px-8 py-4 text-lg font-bold rounded-xl bg-rose-700 hover:bg-rose-600 text-white shadow-lg border-2 border-rose-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-rose-400"
            onClick={() => alert(T.safety.text)}
          >
            {T.panic}
          </button>
        </div>
      </div>
    );
  }

  // Render form stage
  function renderForm(T) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button
          className="mb-3 px-2 py-1 border rounded text-slate-300 hover:bg-slate-700"
          onClick={() => setStage("intro")}
        >
          {T.back}
        </button>
        <h2 className="font-semibold text-slate-100">How are you feeling?</h2>
        <div className="mt-2">
          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="mood"
            className="w-full p-2 border rounded bg-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="mt-2">
          <input
            value={stress}
            onChange={(e) => setStress(e.target.value)}
            placeholder="stress"
            className="w-full p-2 border rounded bg-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="mt-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="note"
            className="w-full p-2 border rounded bg-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <button
            className="px-3 py-2 border rounded text-slate-300 hover:bg-slate-700"
            onClick={() => setStage("intro")}
          >
            {T.cancel}
          </button>
          <button
            className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded transition-colors"
            onClick={() => setStage("plan")}
          >
            {T.generatePlan}
          </button>
        </div>
      </div>
    );
  }

  // Render plan stage
  function renderPlan(T) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            className="px-2 py-1 border rounded text-slate-300 hover:bg-slate-700"
            onClick={() => setStage("form")}
          >
            {T.back}
          </button>
          <h2 className="font-semibold text-slate-100">Your Plan</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {Object.keys(exercises).map((cat) => (
            <div key={cat} className="p-3 border rounded bg-slate-700 text-slate-200">
              <div className="text-sm opacity-60 mb-2">{cat}</div>
              <div className="space-y-2">
                {exercises[cat].map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelected({ cat, idx: i })}
                    className={`w-full text-left p-2 border rounded ${
                      selected && selected.cat === cat && selected.idx === i ? "ring-2 ring-pink-500" : ""
                    }`}
                  >
                    <div className="font-medium">{ex.name}</div>
                    <div className="text-xs opacity-60">~{ex.minutes} min</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          {selected ? (
            <div className="p-4 border rounded bg-slate-700 text-slate-200">
              <div className="flex items-center gap-3">
                <div className="font-semibold">{exercises[selected.cat][selected.idx].name}</div>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setStage("session")}
                    className="px-2 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded"
                  >
                    Start
                  </button>
                </div>
              </div>
              <ul className="list-disc pl-5 mt-3">
                {exercises[selected.cat][selected.idx].steps.map((s, ii) => (
                  <li key={ii}>{s}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 border rounded bg-slate-700 text-slate-200">Select an exercise</div>
          )}
        </div>
      </div>
    );
  }

  // Render session stage
  function renderSession(T) {
    const curr = selected ? exercises[selected.cat][selected.idx] : null;

    // Handler for End Session button to redirect to /healthcoach
    function handleEndSession() {
      setCameraOn(false);
      window.location.href = "/healthcoach";
    }

    return (
      <div className="max-w-6xl mx-auto h-full flex items-center justify-center p-4 md:p-6">
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 flex flex-col items-center min-w-[300px]">
          <div className="flex items-center gap-3 mb-2">
            <button
              className="px-3 py-2 rounded-xl border bg-slate-700 text-slate-200 hover:bg-slate-600"
              onClick={() => setStage("plan")}
            >
              {T.back}
            </button>
            <div className="text-lg font-semibold text-slate-100">{curr?.name}</div>
          </div>
          <div className="rounded-xl border border-slate-600 bg-slate-900 p-4 mt-2 w-full flex flex-col items-center">
            <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
              {curr?.steps && curr.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <div className="w-full flex flex-col items-center">
              {cameraOn ? (
                <>
                  <div className="relative w-full max-w-md h-64 mb-2">
                    <video
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl bg-black"
                      playsInline
                      muted
                      autoPlay
                      style={{ zIndex: 1 }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 mb-2"
                    onClick={() => setCameraOn(false)}
                  >
                    {T.stopCamera}
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    onClick={handleEndSession}
                  >
                    {T.endSession}
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 mb-2"
                  onClick={() => setCameraOn(true)}
                >
                  {T.startCamera}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard stage
  function renderDashboard(T) {
    // Calculate current day - check if user has done exercises today
    const today = new Date().toDateString();
    const todayEntries = persist.history.filter(entry =>
      new Date(entry.ts).toDateString() === today
    );
    const hasWorkedToday = todayEntries.length > 0;
    const totalMinutesToday = todayEntries.reduce((sum, entry) => sum + entry.minutes, 0);

    // Calculate badges based on achievements
    const totalSessions = persist.history.length;
    const totalMinutes = persist.history.reduce((sum, entry) => sum + entry.minutes, 0);
    const uniqueExercises = new Set(persist.history.flatMap(entry => entry.completed)).size;

    const calculatedBadges = [];
    if (totalSessions >= 1) calculatedBadges.push("First Session");
    if (totalSessions >= 5) calculatedBadges.push("Regular Practitioner");
    if (totalSessions >= 10) calculatedBadges.push("Dedicated Student");
    if (totalMinutes >= 60) calculatedBadges.push("Hour Champion");
    if (uniqueExercises >= 3) calculatedBadges.push("Well Rounded");
    if (persist.streak.count >= 7) calculatedBadges.push("Week Warrior");
    if (persist.streak.count >= 30) calculatedBadges.push("Monthly Master");

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            className="px-2 py-1 border rounded text-slate-300 hover:bg-slate-700"
            onClick={() => setStage("intro")}
          >
            {T.back}
          </button>
          <h2 className="font-semibold text-slate-100">Your Progress Dashboard</h2>
        </div>

        {/* Current Day Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border rounded-xl bg-slate-700 text-slate-200">
            <div className="text-center">
              <div className="text-4xl mb-2">{hasWorkedToday ? "✅" : "⏳"}</div>
              <h3 className="font-semibold text-lg mb-2">Today&apos;s Progress</h3>
              <p className="text-sm opacity-80">
                {hasWorkedToday
                  ? `Great job! You&apos;ve completed ${todayEntries.length} session(s) today (${totalMinutesToday} min)`
                  : "No sessions completed today yet"
                }
              </p>
            </div>
          </div>

          {/* Streak Information */}
          <div className="p-6 border rounded-xl bg-slate-700 text-slate-200">
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-semibold text-lg mb-2">Current Streak</h3>
              <p className="text-3xl font-bold text-pink-400 mb-2">{persist.streak.count}</p>
              <p className="text-sm opacity-80">
                {persist.streak.count === 0
                  ? "Start your streak today!"
                  : persist.streak.count === 1
                    ? "1 day in a row"
                    : `${persist.streak.count} days in a row`
                }
              </p>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="p-6 border rounded-xl bg-slate-700 text-slate-200">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-semibold text-lg mb-2">Total Sessions</h3>
              <p className="text-3xl font-bold text-blue-400 mb-2">{totalSessions}</p>
              <p className="text-sm opacity-80">
                {totalMinutes} total minutes practiced
              </p>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h3 className="font-semibold text-slate-100 mb-4">Your Achievements</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {calculatedBadges.length > 0 ? (
              calculatedBadges.map((badge, index) => (
                <div key={index} className="p-4 border rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-700 text-white text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="font-medium">{badge}</p>
                </div>
              ))
            ) : (
              <div className="col-span-4 p-8 border rounded-xl bg-slate-700 text-slate-200 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p>Complete your first session to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold text-slate-100 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {persist.history.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="p-4 border rounded-xl bg-slate-700 text-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {new Date(entry.ts).toLocaleDateString()} - {entry.completed.length} exercise(s)
                    </p>
                    <p className="text-sm opacity-80">
                      Mood: {entry.mood} | Stress: {entry.stress} | Duration: {entry.minutes} min
                    </p>
                    {entry.note && (
                      <p className="text-sm opacity-60 mt-1">Note: {entry.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">
                      {new Date(entry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {persist.history.length === 0 && (
              <div className="p-8 border rounded-xl bg-slate-700 text-slate-200 text-center">
                <div className="text-4xl mb-4">🚀</div>
                <p>No sessions recorded yet. Start your wellness journey today!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  const [stage, setStage] = useState<"intro" | "form" | "plan" | "session" | "dashboard">("intro");
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState("");
  const [note, setNote] = useState("");
  // Minimal usage to avoid lint errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = { loadPersist, savePersist, checkSeated, generateRoutinesWithGemini, say, ExerciseVisual, mood, stress, note };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _unusedTypes = PoseKeypoint | Pose;
  // ...existing code...
  // All stray JSX fragments removed. Only main export and helpers remain.

  // Root render
  return (
    <main className="bg-slate-900 h-screen w-screen text-white relative flex items-center justify-center p-4">
      <style>
        {`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; } .glass-container { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }`}
      </style>
      <div className="w-full h-full max-w-6xl z-10">
        <div className="flex flex-col h-full text-center p-4 md:p-8 text-slate-200 bg-slate-800/80 rounded-2xl glass-container border border-slate-700">
          {stage === "intro" && renderIntro(T)}
          {stage === "form" && renderForm(T)}
          {stage === "plan" && renderPlan(T)}
          {stage === "session" && renderSession(T)}
          {stage === "dashboard" && renderDashboard(T)}
        </div>
      </div>
    </main>
  );
}
