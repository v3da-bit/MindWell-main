"use client";

import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { storeUserData } from "@/lib/storeUserData";
import {
  Upload,
  Brain,
  FileText,
  BarChart3,
} from "lucide-react";
// If DashboardShell is needed, import and wrap content. Keeping but unused to avoid build errors.
// import DashboardShell from "@/app/components/DashboardShell";

type CognitiveAnalysis = {
  complexityScore: number;
  cognitiveBottlenecks: Array<{ section: string; difficulty: number; reasoning: string }>;
  wellnessBreakpoints: number[];
  estimatedStudyTime: number;
  recommendedSessions: number;
};

type StudySession = {
  id: number;
  title: string;
  paragraphs: number[];
  estimatedTime: number;
  difficulty: "low" | "medium" | "high";
};

// --- Helpers ---
async function analyzeMaterial(_file: File, content: string): Promise<CognitiveAnalysis> {
  await new Promise((r) => setTimeout(r, 1200));
  const paragraphs = content.split("\n\n").filter(Boolean);
  const wordCount = content.trim().split(/\s+/).length;
  const complexityScore = Math.min(
    10,
    Math.max(1, Math.floor(wordCount / 100) + Math.floor(Math.random() * 3) + 5)
  );
  const cognitiveBottlenecks = [
    { section: "Advanced theoretical concepts", difficulty: 9, reasoning: "High abstraction level with complex interdependencies" },
    { section: "Technical terminology clusters", difficulty: 8, reasoning: "Dense jargon requiring extensive background knowledge" },
    { section: "Mathematical formulations", difficulty: 7, reasoning: "Multi-step problem solving with conceptual bridges" },
  ];
  const wellnessBreakpoints: number[] = [];
  for (let i = 3; i < paragraphs.length; i += 4) wellnessBreakpoints.push(i);
  return {
    complexityScore,
    cognitiveBottlenecks,
    wellnessBreakpoints,
    estimatedStudyTime: Math.ceil(wordCount / 200) * complexityScore,
    recommendedSessions: Math.ceil(complexityScore / 3),
  };
}

async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      resolve(
        `Sample PDF content extracted from ${file.name}.\n\nThis would contain the actual PDF text in a real implementation.\n\nParagraph 2 with complex concepts about neural networks and deep learning architectures.\n\nParagraph 3 discussing advanced mathematical formulations.\n\nParagraph 4 covering theoretical frameworks.\n\nParagraph 5 with dense technical terminology.\n\nParagraph 6 explaining practical applications.\n\nParagraph 7 summarizing key takeaways.`
      );
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
}

// --- Component ---
export default function StudyHub() {
  const [content, setContent] = useState<string>("");
  const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [completedParagraphs, setCompletedParagraphs] = useState<Set<number>>(new Set());

  // Missing states added
  const [summary, setSummary] = useState<string>("");
  const [downloadFormat, setDownloadFormat] = useState<"txt" | "pdf" | "docs">("txt");
  const [downloading, setDownloading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const paragraphs = content.split("\n\n").filter(Boolean);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setStudySessions([]);
    setActiveSession(null);
    setCompletedParagraphs(new Set());
    setSummary("");

    try {
      const extractedContent = await extractTextFromFile(uploadedFile);
      setContent(extractedContent);
      const analysisResult = await analyzeMaterial(uploadedFile, extractedContent);
      setAnalysis(analysisResult);
      generateStudySessions(extractedContent, analysisResult);

      // Store text, speech, and face data in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await storeUserData({
          user_id: user.id,
          text: extractedContent,
          speech: undefined, // Add speech data if available
          face: undefined    // Add face data if available
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const generateStudySessions = (text: string, anal: CognitiveAnalysis) => {
    const paras = text.split("\n\n").filter(Boolean);
    const sessions: StudySession[] = [];
    let currentSession = 0;
    const parasPerSession = Math.max(1, Math.ceil(paras.length / Math.max(1, anal.recommendedSessions)));
    for (let i = 0; i < paras.length; i += parasPerSession) {
      const sessionParas = Array.from(
        { length: Math.min(parasPerSession, paras.length - i) },
        (_, idx) => i + idx
      );
      const avgComplexity = anal.complexityScore;
      sessions.push({
        id: currentSession + 1,
        title: `Study Session ${currentSession + 1}`,
        paragraphs: sessionParas,
        estimatedTime: Math.ceil(sessionParas.length * (avgComplexity / 2) * 3),
        difficulty: avgComplexity > 7 ? "high" : avgComplexity > 4 ? "medium" : "low",
      });
      currentSession++;
    }
    setStudySessions(sessions);
  };

  // Missing helpers implemented
  const generateSummary = () => {
    if (!content) return;
    // A simple extractive “summary” for demo
    const first = paragraphs ?? "";
    const middle = paragraphs[Math.floor(paragraphs.length / 2)] ?? "";
    const last = paragraphs[paragraphs.length - 1] ?? "";
    setSummary([first, middle, last].filter(Boolean).join("\n\n"));
  };

  const downloadSummary = async () => {
    if (!summary) return;
    setDownloading(true);
    try {
      let blob: Blob;
  const filename = `summary.${downloadFormat}`;

      if (downloadFormat === "txt") {
        blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
      } else if (downloadFormat === "pdf") {
        // Minimal PDF via data URI fallback to text as demo; integrate real PDF lib in production
        blob = new Blob([summary], { type: "application/pdf" });
      } else {
        // docs (DOCX) placeholder as plain text for demo; integrate docx generator for real use
        blob = new Blob([summary], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } finally {
      setDownloading(false);
    }
  };

  const renderParagraph = (text: string, idx: number) => {
    const isDone = completedParagraphs.has(idx);
    return (
      <div key={idx} className={`mb-3 p-3 rounded border ${isDone ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{text}</div>
        <button
          className={`mt-2 px-3 py-1 rounded text-xs font-semibold ${isDone ? "bg-gray-300 text-gray-700" : "bg-green-600 text-white"}`}
          onClick={() => {
            const next = new Set(completedParagraphs);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            setCompletedParagraphs(next);
          }}
        >
          {isDone ? "Mark as Incomplete" : "Mark as Complete"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="max-w-2xl w-full flex flex-col items-center justify-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Brain className="text-white drop-shadow-lg" size={56} />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg text-center">MindWell Study Helper</h1>
          <p className="text-lg text-blue-200 mt-2 font-semibold drop-shadow text-center">AI-powered cognitive analysis and study planner. Upload material, view insights, and download a summary.</p>
        </div>

        {/* File Upload & Summary */}
        <div className="w-full flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <input
              type="file"
              accept=".txt,.pdf"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
            />
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700 transition mb-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="inline mr-2" size={18} />
              {loading ? "Processing..." : file ? `Uploaded: ${file.name}` : "Upload Study Material"}
            </button>
            {error && <div className="mt-2 text-red-600">{error}</div>}

            <button
              className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition"
              onClick={generateSummary}
              disabled={!content || loading}
            >
              Generate Summary
            </button>

            {summary && (
              <div className="mt-6 w-full">
                <h2 className="text-xl font-bold mb-2 text-gray-700">Summary</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-2 text-gray-800 text-base whitespace-pre-line">
                  {summary}
                </div>
                <div className="mb-2">
                  <label className="mr-2 font-semibold text-gray-700">Download as:</label>
                  <select
                    className="px-2 py-1 rounded border border-gray-300 focus:outline-none"
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value as "txt" | "pdf" | "docs")}
                    disabled={downloading}
                  >
                    <option value="txt">TXT</option>
                    <option value="pdf">PDF</option>
                    <option value="docs">DOCX</option>
                  </select>
                </div>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                  onClick={downloadSummary}
                  disabled={downloading}
                >
                  {downloading ? "Downloading..." : `Download Summary (${downloadFormat.toUpperCase()})`}
                </button>
              </div>
            )}
          </div>

          {/* Cognitive Analysis */}
          {analysis && (
            <div className="bg-blue-50 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">Cognitive Analysis</h2>
              <div className="mb-2 flex gap-2 items-center">
                <BarChart3 className="text-indigo-500" size={24} />
                <span className="font-bold text-indigo-700">Complexity Score:</span>
                <span className="text-xl font-bold text-indigo-900">{analysis.complexityScore}/10</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Estimated Study Time:</span> {analysis.estimatedStudyTime} min
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Recommended Sessions:</span> {analysis.recommendedSessions}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Cognitive Bottlenecks:</span>
                <ul className="list-disc ml-6 text-red-700">
                  {analysis.cognitiveBottlenecks.map((b, i) => (
                    <li key={i}>
                      {b.section} ({b.reasoning})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Study Sessions */}
        {analysis && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Study Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {studySessions.map((session) => (
                <div key={session.id} className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-indigo-400" size={18} />
                    <span className="font-bold text-gray-800">{session.title}</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        session.difficulty === "high"
                          ? "bg-red-100 text-red-700"
                          : session.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {session.difficulty}
                    </span>
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    Estimated Time: {session.estimatedTime} min
                  </div>
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold shadow hover:bg-indigo-600 transition mb-2"
                    onClick={() => setActiveSession(session.id)}
                  >
                    Start Session
                  </button>
                  {activeSession === session.id && (
                    <div className="mt-4">
                      {session.paragraphs.map((idx) => renderParagraph(paragraphs[idx], idx))}
                      <button
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition"
                        onClick={() => setActiveSession(null)}
                      >
                        End Session
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Content Preview */}
        {content && !analysis && (
          <div className="bg-blue-100 rounded-2xl p-6 mt-8 shadow">
            <h2 className="text-lg font-bold mb-2 text-blue-900">Extracted Content Preview</h2>
            <pre className="text-xs text-blue-900 whitespace-pre-wrap">{content}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
