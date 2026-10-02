'use client';

import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';

// Error boundary for robust error handling
type EBState = { error: string | null };
type EBP = { children: React.ReactNode };

class ErrorBoundary extends React.Component<EBP, EBState> {
  constructor(props: EBP) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { error: error?.message ?? 'Unknown error' };
  }
  render() {
    if (this.state.error) {
      return <div className="text-rose-400 p-4">Error: {this.state.error}</div>;
    }
    return this.props.children;
  }
}

// External app utilities
import { appendPoint } from '@/app/lib/activityStore';
  // import { supabase } from '@/app/lib/supabaseClient'; // Remove if unused

type Suggestion = { music: string; exercise: string; game: string };
type MoodResult = { mood: string; percentage: number; suggestion: Suggestion };

type Expressions = Partial<
  Record<'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised', number>
>;

type ExpressionScores = {
  angry: number; disgusted: number; fearful: number; happy: number;
  neutral: number; sad: number; surprised: number;
};

type EmotionEvent = {
  userIdHash: string;
  ts: string;
  bucketMin: string;
  scores: ExpressionScores;
  top: keyof ExpressionScores;
  conf: number;
};

const MODEL_URL = '/models';

const SAMPLE_HZ = 2;       // capture ~2 Hz
const BATCH_MS = 15000;    // send every 15s
const SMOOTH_SEC = 8;      // 8s sliding average

const EXPRESSION_COLORS: Record<string, string> = {
  happy: 'text-emerald-300',
  neutral: 'text-slate-300',
  sad: 'text-sky-300',
  angry: 'text-rose-300',
  fearful: 'text-amber-300',
  disgusted: 'text-lime-300',
  surprised: 'text-fuchsia-300',
};

function getSuggestions(mood: string): Suggestion {
  const options: Record<string, Suggestion> = {
    happy: {
      music: 'https://www.youtube.com/embed/ZbZSe6N_BXs',
      exercise: 'https://www.youtube.com/embed/ECxYJcnvyMw',
      game: 'https://www.crazygames.com/embed/puzzle',
    },
    sad: {
      music: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
      exercise: 'https://www.youtube.com/embed/v7AYKMP6rOE',
      game: 'https://www.crazygames.com/embed/solitaire',
    },
    angry: {
      music: 'https://www.youtube.com/embed/IcrbM1l_BoI',
      exercise: 'https://www.youtube.com/embed/bm4WZyH5p2I',
      game: 'https://www.crazygames.com/embed/boxing-physics-2',
    },
    fearful: {
      music: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      exercise: 'https://www.youtube.com/embed/YtY9QZWs8T8',
      game: 'https://www.crazygames.com/embed/word-city-crossed',
    },
    disgusted: {
      music: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      exercise: 'https://www.youtube.com/embed/eG1pK4a-jgM',
      game: 'https://www.crazygames.com/embed/tetris-classic',
    },
    surprised: {
      music: 'https://www.youtube.com/embed/d-diB65scQU',
      exercise: 'https://www.youtube.com/embed/1vk_C3HT7h8',
      game: 'https://www.crazygames.com/embed/stack',
    },
    neutral: {
      music: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      exercise: 'https://www.youtube.com/embed/eG1pK4a-jgM',
      game: 'https://www.crazygames.com/embed/tetris-classic',
    },
  };
  return options[mood] || options['neutral'];
}

// Privacy-safe intensity for existing activity store
function recordFaceActivity(expressions: Record<string, number>) {
  const positive = expressions.happy ?? 0;
  const negative = Math.max(
    0,
    expressions.sad ?? 0,
    expressions.angry ?? 0,
    expressions.fearful ?? 0,
    expressions.disgusted ?? 0
  );
  const intensity = Math.max(0.05, Math.min(1, negative * 0.7 + (1 - positive) * 0.3));
  appendPoint({ ts: Date.now(), faceExpression: intensity });
}

const minuteBucket = (d: Date) => {
  const x = new Date(d);
  x.setSeconds(0, 0);
  return x.toISOString();
};

const topExpr = (s: ExpressionScores) =>
  (Object.entries(s) as [keyof ExpressionScores, number][])
    .reduce((m, c) => (c[1] > m.v ? { k: c[0], v: c[1] } : m), { k: 'neutral' as keyof ExpressionScores, v: 0 });

function FaceRecog() {
  type WeeklyAnalysis = { week?: string; date?: string; [key: string]: number | string | undefined };
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<WeeklyAnalysis[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyAnalysis = async () => {
      setWeeklyLoading(true);
      setWeeklyError(null);
      try {
        const res = await fetch('/api/emotion/weekly');
        const data = await res.json().catch(() => ({}));
        if (data?.weeks) {
          setWeeklyAnalysis(data.weeks as WeeklyAnalysis[]);
        } else {
          setWeeklyError(data?.error || 'No data');
        }
      } catch {
        setWeeklyError('Failed to fetch weekly analysis');
      } finally {
        setWeeklyLoading(false);
      }
    };
    fetchWeeklyAnalysis();
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<MoodResult | null>(null);

  const [liveMood, setLiveMood] = useState<string>('neutral');
  const [livePerc, setLivePerc] = useState<number>(0);
  const [liveExpressions, setLiveExpressions] = useState<Expressions>({});

  const queueRef = useRef<EmotionEvent[]>([]);
  const smoothRef = useRef<{ t: number; s: ExpressionScores }[]>([]);
  const lastSentRef = useRef<number>(Date.now());
  const lastSampleRef = useRef<number>(0);

  // Replace with salted hash from auth/session; do not store PII
  const userIdHash = 'anon-user-hash';

  // Load models
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        console.log('Loading face detection models from:', MODEL_URL);

        // First, check if models are accessible
        const checkModelAccess = async (modelName: string) => {
          try {
            const response = await fetch(`${MODEL_URL}/${modelName}-weights_manifest.json`);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            console.log(`${modelName} manifest accessible`);
            return true;
          } catch (error) {
            console.error(`Cannot access ${modelName}:`, error);
            return false;
          }
        };

        // Check all model manifests
        const modelsAccessible = await Promise.all([
          checkModelAccess('tiny_face_detector_model'),
          checkModelAccess('face_landmark_68_model'),
          checkModelAccess('face_expression_model'),
        ]);

        if (modelsAccessible.some(accessible => !accessible)) {
          throw new Error('Some model files are not accessible. Please check your model files.');
        }

        // Try loading models with better error handling
        /* Disabled: faceapi library removed due to incompatibility
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log('Tiny face detector loaded');

        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log('Face landmark model loaded');

        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log('Face expression model loaded');
        */

        if (cancelled) return;
        setModelsLoaded(true);
        console.log('All models loaded successfully');
      } catch (error) {
        console.error('Model loading error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setModelError(`Failed to load face detection models: ${errorMessage}. Please check your internet connection and try again.`);
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    };
    /* Disabled: faceapi library removed due to incompatibility
    void load();
    return () => { cancelled = true; };
    */
    setModelsLoaded(false);
    return () => {};
  }, []);

  // Enable camera after click
  const enableCamera = async () => {
    if (!modelsLoaded) return;
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ensureDims = async () => {
          let tries = 0;
          while (tries < 40 && (!video.videoWidth || !video.videoHeight)) {
            await new Promise((r) => setTimeout(r, 100));
            tries++;
          }
          const w = video.videoWidth || 640;
          const h = video.videoHeight || 480;
          canvas.width = w;
          canvas.height = h;
          // faceapi.matchDimensions(canvas, { width: w, height: h });  // Disabled: faceapi removed
        };
        await ensureDims();
      }
      setCameraEnabled(true);
    } catch (e) {
      const name = (e as { name?: string })?.name || '';
      if (name === 'NotAllowedError') {
        setPermissionError('Camera permission denied. See browser settings to enable camera.');
      } else if (name === 'NotFoundError') {
        setPermissionError('No camera found on this device.');
      } else {
        setPermissionError('Unable to access camera. Please try again.');
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const tracks = streamRef.current?.getTracks?.() || [];
      tracks.forEach((t) => t.stop());
    };
  }, []);

  // Pause detection when tab is not visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setCameraEnabled(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Detection loop with expressions, sampling, smoothing, batching
  useEffect(() => {
    if (!cameraEnabled) return;
    let rafId = 0;
    const detectLoop = async (): Promise<void> => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        rafId = requestAnimationFrame(detectLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafId = requestAnimationFrame(detectLoop);
        return;
      }
      try {
        /* Disabled: faceapi library removed due to incompatibility
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const displaySize = { width: canvas.width, height: canvas.height };
          const resized = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resized);
          faceapi.draw.drawFaceLandmarks(canvas, resized);
          faceapi.draw.drawFaceExpressions(canvas, resized, 0.05);

          let expr: Expressions = {};
        */
        // No-op: Face detection disabled
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        {
          /* Disabled: No face detection available
          const first = Array.isArray(resized) ? resized[0] : resized;
          if (first && typeof first === 'object' && 'expressions' in first) {
            expr = (first as { expressions: Expressions }).expressions ?? {};
          }

          // Compute top expression
          let top = 'neutral';
          let val = 0;
          Object.entries(expr).forEach(([k, v]) => {
            if (typeof v === 'number' && v > val) {
              val = v;
              top = k;
            }
          });

          setLiveExpressions(expr);
          setLiveMood(top);
          setLivePerc(Math.round(val * 100));

          const scores: ExpressionScores = {
            angry: Number(expr.angry ?? 0),
            disgusted: Number(expr.disgusted ?? 0),
            fearful: Number(expr.fearful ?? 0),
            happy: Number(expr.happy ?? 0),
            neutral: Number(expr.neutral ?? 0),
            sad: Number(expr.sad ?? 0),
            surprised: Number(expr.surprised ?? 0),
          };

          // Sample smoothing buffer
          const nowMs = Date.now();
          const minInterval = 1000 / SAMPLE_HZ;
          if (nowMs - lastSampleRef.current >= minInterval) {
            lastSampleRef.current = nowMs;
            smoothRef.current.push({ t: nowMs, s: scores });
            const cutoff = nowMs - SMOOTH_SEC * 1000;
            smoothRef.current = smoothRef.current.filter(p => p.t >= cutoff);

            const acc: ExpressionScores = {
              angry: 0, disgusted: 0, fearful: 0, happy: 0, neutral: 0, sad: 0, surprised: 0
            };
            for (const p of smoothRef.current) {
              acc.angry += p.s.angry; acc.disgusted += p.s.disgusted; acc.fearful += p.s.fearful;
              acc.happy += p.s.happy; acc.neutral += p.s.neutral; acc.sad += p.s.sad; acc.surprised += p.s.surprised;
            }
            const n = Math.max(1, smoothRef.current.length);
            const avg: ExpressionScores = {
              angry: acc.angry / n, disgusted: acc.disgusted / n, fearful: acc.fearful / n,
              happy: acc.happy / n, neutral: acc.neutral / n, sad: acc.sad / n, surprised: acc.surprised / n
            };
            const topA = topExpr(avg);
            const now = new Date();
            queueRef.current.push({
              userIdHash,
              ts: now.toISOString(),
              bucketMin: minuteBucket(now),
              scores: avg,
              top: topA.k as keyof ExpressionScores,
              conf: topA.v,
            });
            recordFaceActivity(avg as unknown as Record<string, number>);
          }
          */
        }

        /* Disabled: Batch sending disabled with face detection
          // Batch send
          if (Date.now() - lastSentRef.current >= BATCH_MS && queueRef.current.length) {
            const batch = queueRef.current.splice(0, queueRef.current.length);
            void fetch('/api/emotion/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ events: batch }),
            });
            lastSentRef.current = Date.now();
          }
        */
      } catch {
        setModelError('Face detection failed. Try refreshing or check your camera.');
      }
      rafId = requestAnimationFrame(detectLoop);
    };
    rafId = requestAnimationFrame(detectLoop);
    return () => cancelAnimationFrame(rafId);
  }, [cameraEnabled]);

  // 3-second scan and suggestions (uses current smoothed live expressions)
  const handleScan = async () => {
    if (!videoRef.current || scanning || !cameraEnabled) return;
    setScanning(true);
    setResult(null);

    const samples: Expressions[] = [];
    const start = Date.now();

    while (Date.now() - start < 3000) {
      samples.push(liveExpressions);
      await new Promise((r) => setTimeout(r, 200));
    }

    const avg: Record<string, number> = {};
    let count = 0;
    for (const s of samples) {
      if (!s) continue;
      for (const k of Object.keys(s)) {
        const v = (s as Record<string, number>)[k];
        if (typeof v === 'number') {
          avg[k] = (avg[k] || 0) + v;
        }
      }
      count++;
    }
    Object.keys(avg).forEach((k) => (avg[k] = avg[k] / Math.max(1, count)));

    let mood = 'neutral';
    let pct = 0;
    for (const [k, v] of Object.entries(avg)) {
      if (typeof v === 'number' && v > pct) {
        pct = v;
        mood = k;
      }
    }

    setResult({ mood, percentage: Math.round(pct * 100), suggestion: getSuggestions(mood) });
    setScanning(false);
  };

  const moodClass = EXPRESSION_COLORS[liveMood] ?? 'text-slate-300';

  return (
    <ErrorBoundary>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white" role="region" aria-label="Face Recognition Scanner">
        <div className="mb-4">
          {modelError && (
            <div className="text-xs text-rose-400 mb-2">
              {modelError}{' '}
              <button className="underline" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}
          <h3 className="text-md font-semibold">Weekly Face Expression Analysis</h3>
          {weeklyLoading && <div className="text-xs text-white/50">Loading weekly analysis…</div>}
          {weeklyError && <div className="text-xs text-rose-300">{weeklyError}</div>}
          {weeklyAnalysis.length > 0 && (
            <div className="mt-2 grid gap-2">
              {weeklyAnalysis.map((week, idx) => (
                <div key={idx} className="rounded-lg bg-white/10 border border-white/10 p-2">
                  <div className="text-white/60 text-xs">Week: {week.week || week.date || idx + 1}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(week)
                      .filter(([k]) => k !== 'week' && k !== 'date')
                      .map(([k, v]) => (
                        <div key={k} className="capitalize">
                          {k}: <span className="font-bold">{typeof v === 'number' ? v.toFixed(2) : String(v)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold">Face Mood Scanner</h2>
          <p className="text-white/60 text-sm">Enable camera, see real-time expressions, then run a 3s scan for suggestions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="rounded-lg border-2 border-lime-400 bg-lime-100/10 px-2 py-2 flex items-center">
            <button
              onClick={enableCamera}
              disabled={!modelsLoaded || loadingModels || cameraEnabled}
              className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-600 disabled:opacity-60"
              aria-label="Enable Camera"
            >
              {cameraEnabled ? 'Camera Enabled' : loadingModels ? 'Loading models…' : 'Enable Camera'}
            </button>
          </div>

          <button
            onClick={handleScan}
            disabled={!cameraEnabled || scanning}
            className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 disabled:opacity-60"
            aria-label="Scan 3 seconds"
          >
            {scanning ? 'Scanning…' : 'Scan 3 seconds'}
          </button>

          {permissionError ? (
            <span className="text-xs text-rose-300" aria-live="polite">{permissionError}</span>
          ) : (
            <span className="text-xs text-white/50">
              {modelsLoaded ? (cameraEnabled ? 'Streaming…' : 'Models ready') : 'Loading models…'}
            </span>
          )}
        </div>

        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/20">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto block" aria-label="Camera feed" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-label="Face detection overlay" />
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className={`rounded-lg bg-white/5 border border-white/10 p-2 ${moodClass}`}>
            <div className="text-white/60">Live</div>
            <div className="font-medium capitalize">
              {liveMood} — {livePerc}%
            </div>
          </div>

          {(['happy', 'neutral', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'] as const).map((k) => {
            const v = Math.round(((liveExpressions as Record<string, number>)?.[k] ?? 0) * 100);
            const cls = EXPRESSION_COLORS[k] ?? 'text-slate-300';
            return (
              <div key={k} className="rounded-lg bg-white/5 border border-white/10 p-2">
                <div className="text-white/60 capitalize">{k}</div>
                <div className={`font-medium ${cls}`}>{v}%</div>
              </div>
            );
          })}
        </div>

        {result && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-white/60 text-sm">Result</div>
              <div className={`text-lg font-semibold capitalize ${EXPRESSION_COLORS[result.mood] ?? ''}`}>
                {result.mood} ({result.percentage}%)
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-white/60 text-sm mb-2">Suggestions</div>
              <div className="grid gap-2">
                <div>
                  <div className="text-xs text-white/60 mb-1">Music</div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      src={result.suggestion.music}
                      title="Music"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Exercise</div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      src={result.suggestion.exercise}
                      title="Exercise"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Game</div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      src={result.suggestion.game}
                      title="Game"
                      allow="fullscreen"
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default FaceRecog;
