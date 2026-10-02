'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs-core";
// import "@tensorflow/tfjs-backend-webgl";
// import * as poseDetection from "@tensorflow-models/pose-detection";
// import type { Keypoint } from "@tensorflow-models/pose-detection";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_TEXT_API_URL = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`
  : null;

interface PoseCheck {
  keypoint: string;
  check: string;
  reference_keypoint: string;
}

interface ExerciseStep {
  step: number;
  title: string;
  instruction: string;
  target_pose: PoseCheck;
}

interface ExerciseSession {
  sessionTitle: string;
  steps: ExerciseStep[];
}

const MotionStudio: React.FC = () => {
  const [language, setLanguage] = useState("en-US");
  const [currentSession, setCurrentSession] = useState<ExerciseSession | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("Waiting for you to get in position...");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const detectorRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Core AI Functions ---
  const callGeminiAPI = useCallback(async (prompt: string, systemInstruction: string) => {
    if (!GEMINI_TEXT_API_URL) {
      throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
    }
    const res = await fetch(GEMINI_TEXT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
      }),
    });
    if (!res.ok) {
      let detail: unknown;
      try { detail = await res.json(); } catch {}
      console.error("Gemini API Error:", detail);
      throw new Error("Text API Request Failed");
    }
    const data = await res.json();
    // Safely extract text from nested structure
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return text;
  }, []);

  const speakText = useCallback((text: string, onEndCallback: (() => void) | null = null) => {
    if (typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      if (onEndCallback) utterance.onend = onEndCallback;
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const generateExercisePlan = useCallback(async (symptom: string) => {
    setLoading(true);
    try {
      const langName = language === "hi-IN" ? "Hindi" : "English";
      const systemInstruction = `You are an expert physical therapist. A student is feeling '${symptom}'. Design a simple, 2-step guided exercise. For each step, provide a 'title', a simple 'instruction' in ${langName}, and the KEY 'target_pose' for AI pose detection. Return ONLY a valid JSON object: { "sessionTitle": string, "steps": [ { "step": number, "title": string, "instruction": string, "target_pose": { "keypoint": "left_shoulder", "check": "is_above", "reference_keypoint": "nose" } } ] }`;

      const response = await callGeminiAPI(`Symptom: ${symptom}`, systemInstruction);
      // Try to extract JSON if model wrapped in code fences
      const match = response.match(/{[\s\S]*}/);
  const jsonString = match ? match[0] : response;
      const session: ExerciseSession = JSON.parse(jsonString);
      setCurrentSession(session);
      setCurrentStepIndex(0);
    } catch (e) {
      console.error("Session generation error:", e);
      setCurrentSession(null);
    } finally {
      setLoading(false);
    }
  }, [callGeminiAPI, language]);

  const setupCameraAndPose = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      /* Disabled: Pose detection removed due to incompatibility
      // Ensure WebGL backend
      const current = tf.getBackend();
      if (current !== "webgl") {
        await tf.setBackend("webgl");
        await tf.ready();
      }

      // Create detector
      const detectorConfig: poseDetection.MoveNetModelConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );

      // Camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      await new Promise<void>((resolve) => {
        if (!videoRef.current) return resolve();
        videoRef.current.onloadedmetadata = () => resolve();
      });

      // Size canvas to rendered video size (fallback if client dims missing)
      const v = videoRef.current;
      const c = canvasRef.current;
      const width = v.clientWidth || v.videoWidth || 640;
      const height = v.clientHeight || v.videoHeight || 360;
      v.width = width;
      c.width = width;
      c.height = height;

      // Pose detection loop
      let poseCorrectCount = 0;
      intervalRef.current = setInterval(async () => {
        if (!detectorRef.current || !videoRef.current || !canvasRef.current || !currentSession) return;
        try {
          const poses = await detectorRef.current.estimatePoses(videoRef.current);
          if (poses.length > 0) {
            const keypoints = poses[0].keypoints;
            // Map keypoints by name
            const byName: Record<string, any> = {};
            keypoints.forEach((kp) => {
              if (kp.name) byName[kp.name] = kp;
            });
            const targetPose = currentSession.steps[currentStepIndex]?.target_pose;
            const target = byName[targetPose.keypoint];
            const reference = byName[targetPose.reference_keypoint];
            if (target && reference && (target.score ?? 0) > 0.5 && (reference.score ?? 0) > 0.5) {
              if (target.y < reference.y) {
                setFeedback("Perfect! Hold it right there...");
                poseCorrectCount++;
              } else {
                setFeedback("A little higher... lift your shoulders.");
                poseCorrectCount = 0;
              }
            }
            // Complete step after sustained hold
            if (poseCorrectCount >= 50) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setTimeout(() => {
                setFeedback("Great! Advancing...");
                setCurrentStepIndex((prev) => {
                  const next = currentSession ? currentSession.steps.length - 1 : 0;
                  if (prev < next) return prev + 1;
                  setFeedback("Session Complete! Well done!");
                  return prev;
                });
              }, 0);
            }
          }
        } catch (err) {
          console.error("Pose detection failed:", err);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100);
      */
      setFeedback("Pose detection disabled - ML models incompatible with current Next.js version");
    } catch (e) {
      setFeedback(`Setup failed: ${String(e)}`);
    }
  }, [currentSession, currentStepIndex]);

  // Orchestrate each step
  useEffect(() => {
    if (!currentSession) return;
    const step = currentSession.steps[currentStepIndex];
    if (!step) return;

    setFeedback("Waiting for you to get in position...");
    speakText(step.instruction);

    (async () => {
      try {
        await setupCameraAndPose();
      } catch {
        // already logged
      }
    })();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentSession, currentStepIndex, setupCameraAndPose, speakText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const tracks = streamRef.current?.getTracks?.() || [];
      tracks.forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // --- UI Screens ---
  if (loading) {
    return <p className="text-xl animate-pulse">Your AI Trainer is designing a session...</p>;
  }

  if (!currentSession) {
    return (
      <div className="fade-in glass-panel p-8 rounded-2xl max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold">The Interactive Motion Studio</h1>
        <p className="mt-2 text-slate-400">
          Your AI personal trainer for mind-body wellness. Select a focus area to begin a live, guided session.
        </p>
        <div className="mt-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-xs mx-auto bg-slate-700 p-2 rounded-lg"
          >
            <option value="en-US">English</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
          </select>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Shoulder Tension", "Improve Posture", "Boost Energy", "Calm Anxiety"].map((s) => (
            <button
              key={s}
              onClick={() => generateExercisePlan(s)}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const step = currentSession.steps[currentStepIndex];

  return (
    <div className="fade-in w-full max-w-5xl flex flex-col items-center">
      <h2 className="text-3xl font-bold">{currentSession.sessionTitle}</h2>
      <div className="w-full grid md:grid-cols-2 gap-6 mt-6 items-center">
        <div className="bg-black/30 rounded-lg p-6 text-left">
          <p className="text-sm font-semibold text-purple-400">
            Step {step.step} of {currentSession.steps.length}
          </p>
          <h3 className="text-2xl font-bold mt-1">{step.title}</h3>
          <p id="instruction-text" className="mt-4 text-slate-300 text-lg leading-relaxed">
            {step.instruction}
          </p>
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <p className="font-semibold text-yellow-300">AI Coach Feedback:</p>
            <p id="feedback-text" className="text-lg animate-pulse">{feedback}</p>
          </div>
        </div>
        <div className="relative w-full aspect-video bg-black/30 rounded-lg shadow-2xl">
          <video ref={videoRef} id="webcam" className="w-full h-full object-cover rounded-lg" autoPlay playsInline />
          <canvas ref={canvasRef} id="canvas" className="w-full h-full absolute top-0 left-0" />
        </div>
      </div>
    </div>
  );
};

export default function ExercisePage() {
  return <MotionStudio />;
}
