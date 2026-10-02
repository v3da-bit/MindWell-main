"use client";
declare global {
  interface Window {
    speechQueue: Array<{ ts: number; speech: number }>;
  }
}

import React, { useEffect } from "react";
import { appendPoint } from '@/app/lib/activityStore';

// Wherever RMS/volume is computed (0..1):
function recordSpeechActivityFromRMS(rms: number) {
  const intensity = Math.max(0.05, Math.min(1, rms));
  appendPoint({ speech: intensity, ts: Date.now() });
  // --- Batching logic for speech events ---
  const BATCH_SIZE = 10;
  if (!window.speechQueue) window.speechQueue = [];
  window.speechQueue.push({ ts: Date.now(), speech: intensity });
  if (window.speechQueue.length >= BATCH_SIZE) {
    fetch('/api/emotion/speech-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: window.speechQueue }),
    });
    window.speechQueue = [];
  }
}



const SpeechInterface: React.FC = () => {
  useEffect(() => {
    // Example usage to avoid unused warning
    recordSpeechActivityFromRMS(0.5);
    // Google Font
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(fontLink);

    // Tailwind CDN
    const tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com";
    tailwindScript.async = false;
    document.head.appendChild(tailwindScript);

    const run = () => {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        console.error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
        return;
      }
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

      const UIElements = {
        micButton: document.getElementById("mic-button") as HTMLButtonElement | null,
        journalBtn: document.getElementById("journal-btn") as HTMLButtonElement | null,
        breathingBtn: document.getElementById("breathing-btn") as HTMLButtonElement | null,
        affirmationBtn: document.getElementById("affirmation-btn") as HTMLButtonElement | null,
        stopBreathingBtn: document.getElementById("stop-breathing-btn") as HTMLButtonElement | null,
        stopSpeakingBtn: document.getElementById("stop-speaking-btn") as HTMLButtonElement | null,
        statusEl: document.getElementById("status") as HTMLElement | null,
        userTranscriptEl: document.getElementById("user-transcript") as HTMLElement | null,
        aiResponseEl: document.getElementById("ai-response") as HTMLElement | null,
        languageSelector: document.getElementById("language-selector") as HTMLSelectElement | null,
        mainContent: document.getElementById("main-content") as HTMLElement | null,
        breathingExercise: document.getElementById("breathing-exercise") as HTMLElement | null,
        loadingView: document.getElementById("loading-view") as HTMLElement | null,
        loadingText: document.getElementById("loading-text") as HTMLElement | null,
        breathingCircle: document.getElementById("breathing-circle") as HTMLElement | null,
        breathingText: document.getElementById("breathing-text") as HTMLElement | null,
      };

      let isListening = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let recognition: any;
      let breathingInterval: ReturnType<typeof setInterval> | null = null;
      let typewriterInterval: ReturnType<typeof setInterval> | null = null;

      const systemPromptVoice =
        `Your entire purpose is to be "MindWell", a digital mental health and psychological support system for students in higher education. You are supportive, empathetic, and non-judgmental. Directives: 1. Always be kind. 2. Suggest general wellness techniques (e.g., mindfulness). 3. **You must strictly refuse to answer any questions not related to mental health, student life, stress, or psychological well-being.** Politely state that your purpose is to support student wellness. 4. **DO NOT PROVIDE medical diagnoses or emergency advice.** If someone mentions self-harm or harm to others, recommend contacting local emergency services or a trusted person immediately. 5. Keep responses concise and approachable, and adapt to the user's language preference.`;

      const systemPromptAffirmation =
        `Generate one short, gentle, student-focused affirmation (1-2 sentences). Keep it calm, warm, and not cliche.`;

      const systemPromptJournal =
        `Provide a single reflective journal prompt for a student dealing with stress, exams, or adaptation.`;

      function setStatus(text: string) {
        if (UIElements.statusEl) UIElements.statusEl.textContent = text;
      }

      function setUserTranscript(text: string) {
        if (UIElements.userTranscriptEl)
          UIElements.userTranscriptEl.textContent = text;
      }

      function setAIResponse(text: string) {
        if (UIElements.aiResponseEl) UIElements.aiResponseEl.textContent = text;
      }

      function showLoading(message: string) {
        if (UIElements.loadingView && UIElements.loadingText && UIElements.mainContent) {
          UIElements.loadingText.textContent = message;
          UIElements.loadingView.classList.remove("hidden");
          UIElements.mainContent.classList.add("hidden");
        }
      }

      function hideLoading() {
        if (UIElements.loadingView && UIElements.mainContent) {
          UIElements.loadingView.classList.add("hidden");
          UIElements.mainContent.classList.remove("hidden");
        }
      }

      function typewriter(el: HTMLElement | null, text: string, speed = 18) {
        if (!el) return;
        el.textContent = "";
        let i = 0;
        if (typewriterInterval) clearInterval(typewriterInterval);
        typewriterInterval = setInterval(() => {
          if (i < text.length) {
            el.textContent += text.charAt(i++);
          } else {
            if (typewriterInterval) clearInterval(typewriterInterval);
          }
        }, speed);
      }

      function speak(text: string, lang: string) {
        if (!("speechSynthesis" in window)) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = lang;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }

      function stopSpeaking() {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }

      function startBreathing() {
        if (!UIElements.breathingExercise || !UIElements.breathingCircle || !UIElements.breathingText) return;
        UIElements.breathingExercise.classList.remove("hidden");
        let phase = 0; // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
        const updatePhase = () => {
          switch (phase) {
            case 0:
              UIElements.breathingCircle.style.transform = "scale(1.25)";
              UIElements.breathingText.textContent = "Inhale…";
              break;
            case 1:
              UIElements.breathingCircle.style.transform = "scale(1.25)";
              UIElements.breathingText.textContent = "Hold…";
              break;
            case 2:
              UIElements.breathingCircle.style.transform = "scale(1)";
              UIElements.breathingText.textContent = "Exhale…";
              break;
            case 3:
              UIElements.breathingCircle.style.transform = "scale(1)";
              UIElements.breathingText.textContent = "Hold…";
              break;
            default:
              break;
          }
          phase = (phase + 1) % 4;
        };
        updatePhase();
        if (breathingInterval) clearInterval(breathingInterval);
        breathingInterval = setInterval(updatePhase, 4000);
      }

      function stopBreathing() {
        if (!UIElements.breathingExercise) return;
        UIElements.breathingExercise.classList.add("hidden");
        if (breathingInterval) clearInterval(breathingInterval);
      }

      function getSelectedLang() {
        return UIElements.languageSelector ? UIElements.languageSelector.value : "en-US";
      }

      async function callGemini(prompt: string, systemPrompt?: string) {
        const payload = {
          contents: [
            ...(systemPrompt ? [{ role: "user", parts: [{ text: systemPrompt }] }] : []),
            { role: "user", parts: [{ text: prompt }] },
          ],
        };
        const res = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        // Safely extract text from response candidates/parts
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const text =
          (Array.isArray(parts)
            ? parts.map((p: { text?: string }) => p?.text || "").join("")
            : "") || "";
        return text.trim();
      }

      function startListening() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
          setStatus("Speech Recognition not supported.");
          return;
        }
        recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getSelectedLang();

        recognition.onstart = () => {
          isListening = true;
          setStatus("Listening…");
          if (UIElements.micButton) {
            UIElements.micButton.classList.add("bg-blue-500");
            UIElements.micButton.classList.remove("bg-blue-600");
          }
        };
        recognition.onend = () => {
          isListening = false;
          setStatus("Idle");
          if (UIElements.micButton) {
            UIElements.micButton.classList.remove("bg-blue-500");
            UIElements.micButton.classList.add("bg-blue-600");
          }
        };
        type SpeechRecognitionResultEvent = {
          resultIndex: number;
          results: Array<{ isFinal: boolean; [key: number]: { transcript: string } } | { transcript: string; isFinal: boolean }>;
        };
        recognition.onresult = async (event: SpeechRecognitionResultEvent) => {
          let interim = "";
          let finalText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            // Canonical shape: event.results[i][0].transcript
            const res =
              (event.results[i] &&
                event.results[i][0] &&
                event.results[i][0].transcript) ||
              (typeof event.results[i] === 'object' && 'transcript' in event.results[i] ? (event.results[i] as { transcript: string }).transcript : "");
            if (event.results[i].isFinal) finalText += res;
            else interim += res;
          }
          setUserTranscript(finalText || interim);

          if (finalText) {
            try {
              showLoading("Thinking…");
              const reply = await callGemini(finalText, systemPromptVoice);
              hideLoading();
              typewriter(UIElements.aiResponseEl, reply, 16);
              speak(reply, getSelectedLang());
            } catch {
              hideLoading();
              setAIResponse("Sorry, something went wrong.");
            }
          }
        };
        recognition.start();
      }

      function stopListening() {
        if (recognition && isListening) recognition.stop();
      }

      // Wire up
      UIElements.micButton?.addEventListener("click", () => {
        if (isListening) stopListening();
        else startListening();
      });
      UIElements.breathingBtn?.addEventListener("click", () => startBreathing());
      UIElements.stopBreathingBtn?.addEventListener("click", () => stopBreathing());
      UIElements.stopSpeakingBtn?.addEventListener("click", () => stopSpeaking());

      UIElements.affirmationBtn?.addEventListener("click", async () => {
        try {
          showLoading("Preparing affirmation…");
          const lang = getSelectedLang();
          const txt = await callGemini("Generate one short affirmation.", systemPromptAffirmation);
          hideLoading();
          typewriter(UIElements.aiResponseEl, txt, 16);
          speak(txt, lang);
        } catch {
          hideLoading();
          setAIResponse("Couldn't get an affirmation right now.");
        }
      });

      UIElements.journalBtn?.addEventListener("click", async () => {
        try {
          showLoading("Creating journal prompt…");
          const txt = await callGemini("Journal prompt for stressed student.", systemPromptJournal);
          hideLoading();
          typewriter(UIElements.aiResponseEl, txt, 16);
        } catch {
          hideLoading();
          setAIResponse("Couldn't get a journal prompt right now.");
        }
      });

      UIElements.languageSelector?.addEventListener("change", () => {
        if (recognition && isListening) {
          stopListening();
          startListening();
        }
      });

      setStatus("Idle");
    };

    const waitForTailwind = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ok = (window as any).tailwind !== undefined;
      if (ok) {
        clearInterval(waitForTailwind);
        run();
      }
    }, 30);

    return () => {
      clearInterval(waitForTailwind);
    };
  }, []);

  return (
    <div className="w-full bg-[radial-gradient(1200px_600px_at_80%_-10%,#1e293b_0%,#0b1220_45%,#050914_100%)] text-slate-200 antialiased">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="relative mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 ring-1 ring-black/5 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <h1 className="text-2xl font-semibold tracking-tight">MindWell Pro</h1>
            <div className="flex items-center gap-3">
              <label htmlFor="language-selector" className="sr-only">Language</label>
              <select
                id="language-selector"
                className="rounded-md bg-white/5 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-white/10 focus:outline-none"
              >
                <option value="en-US">English</option>
                <option value="en-GB">English (UK)</option>
                <option value="hi-IN">Hindi (IN)</option>
                <option value="es-ES">Spanish (ES)</option>
                <option value="fr-FR">French (FR)</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Subhead */}
          <p className="px-6 pt-4 text-center text-sm text-slate-400">
            Choose a tool or click the mic to talk
          </p>

          {/* Status */}
          <div className="px-6 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_12px_2px_rgba(16,185,129,0.6)]" />
              <span id="status">Idle</span>
            </div>
          </div>

          {/* Main */}
          <div id="main-content" className="px-6 pb-6 pt-4">
            {/* Transcript card */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-medium text-slate-400">You said:</div>
              <div
                id="user-transcript"
                className="mt-1 min-h-[56px] whitespace-pre-wrap text-slate-200/90"
              >
                ...
              </div>
              <div className="my-4 h-px w-full bg-white/10" />
              <div className="text-sm font-medium text-slate-400">Assistant says:</div>
              <div
                id="ai-response"
                className="mt-1 min-h-[80px] whitespace-pre-wrap text-slate-100"
              >
                ...
              </div>
            </div>

            {/* Breathing exercise (hidden by default) */}
            <div id="breathing-exercise" className="hidden mt-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/20 p-6">
                <div
                  id="breathing-circle"
                  className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 ring-1 ring-white/10 shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] transition-transform duration-500 ease-in-out"
                />
                <div id="breathing-text" className="mt-3 text-sm text-slate-300">
                  Inhale…
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    id="stop-breathing-btn"
                    className="rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/15"
                  >
                    Stop Breathing
                  </button>
                  <button
                    id="stop-speaking-btn"
                    className="rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/15"
                  >
                    Stop Speaking
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons row */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <button
                id="affirmation-btn"
                aria-label="Daily affirmation"
                className="grid h-12 w-12 place-items-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition hover:brightness-110"
                title="Daily Affirmation"
              >
                <span className="text-lg">❤</span>
              </button>
              <button
                id="journal-btn"
                aria-label="Journal prompt"
                className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-900/30 transition hover:brightness-110"
                title="Journal Prompt"
              >
                <span className="text-lg">✎</span>
              </button>

              {/* Mic button */}
              <button
                id="mic-button"
                aria-label="Start/Stop Listening"
                className="grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-900/40 transition hover:bg-blue-500"
                title="Start/Stop Listening"
              >
                <span className="text-2xl">🎤</span>
              </button>

              <button
                id="breathing-btn"
                aria-label="Start breathing"
                className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition hover:brightness-110"
                title="Start Breathing"
              >
                <span className="text-lg">◌</span>
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-center text-[11px] leading-snug text-slate-400">
              Disclaimer: This AI tool is for support, not a substitute for professional medical advice. Please consult a healthcare professional for health concerns.
            </p>
          </div>

          {/* Loading view */}
          <div
            id="loading-view"
            className="hidden px-6 py-16 text-center"
          >
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
            <p id="loading-text" className="mt-4 text-sm text-slate-300">
              Thinking…
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechInterface;
