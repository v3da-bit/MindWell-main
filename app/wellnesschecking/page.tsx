'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

// --- Type Definitions & Data ---
type AssessmentType = 'GAD-7' | 'PHQ-9';
interface Question {
    text: string;
    options: { text: string; score: number }[];
}

const assessments: Record<AssessmentType, { title: string; questions: Question[] }> = {
    'GAD-7': {
        title: "Anxiety Check-in (GAD-7)",
        questions: [
            { text: "Feeling nervous, anxious, or on edge?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Not being able to stop or control worrying?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Worrying too much about different things?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Trouble relaxing?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Being so restless that it's hard to sit still?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Becoming easily annoyed or irritable?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Feeling afraid as if something awful might happen?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] }
        ]
    },
    'PHQ-9': {
        title: "Depression Check-in (PHQ-9)",
        questions: [
            { text: "Little interest or pleasure in doing things?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Feeling down, depressed, or hopeless?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Trouble falling or staying asleep, or sleeping too much?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Feeling tired or having little energy?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Poor appetite or overeating?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Trouble concentrating on things, such as reading the newspaper or watching television?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] },
            { text: "Thoughts that you would be better off dead, or of hurting yourself in some way?", options: [{ text: "Not at all", score: 0 }, { text: "Several days", score: 1 }, { text: "More than half the days", score: 2 }, { text: "Nearly every day", score: 3 }] }
        ]
    }
};

const WellnessCheckin: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'quiz' | 'loading' | 'results' | 'history'>('intro');
  const [assessmentType, setAssessmentType] = useState<AssessmentType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  type HistoryEntry = {
    created_at?: string;
    assessment_type?: string;
    score?: number;
    interpretation?: string;
    answers?: string;
  };
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const GEMINI_API_URL = GEMINI_API_KEY
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`
    : null;

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      if (!userId) return;
      setLoading(true);
      const { data } = await supabase
        .from('wellness_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) setHistory(data);
      setLoading(false);
    }
    if (step === 'history' && userId) fetchHistory();
  }, [step, userId]);

  const startAssessment = (type: AssessmentType) => {
    setAssessmentType(type);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStep('quiz');
    setError(null);
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (assessmentType && currentQuestionIndex < assessments[assessmentType].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishAssessment(newAnswers);
    }
  };

  const finishAssessment = async (finalAnswers: number[]) => {
    if (!assessmentType) return;
    const totalScore = finalAnswers.reduce((sum, score) => sum + score, 0);
    setFinalScore(totalScore);
    setStep('loading');
    setError(null);
    setLoading(true);

    const scoreRanges = {
      'GAD-7': totalScore <= 4 ? "Minimal anxiety" : totalScore <= 9 ? "Mild anxiety" : totalScore <= 14 ? "Moderate anxiety" : "Severe anxiety",
      'PHQ-9': totalScore <= 4 ? "Minimal depression" : totalScore <= 9 ? "Mild depression" : totalScore <= 14 ? "Moderate depression" : totalScore <= 19 ? "Moderately severe depression" : "Severe depression"
    };

    const systemInstruction = "You are an empathetic AI wellness coach. A student has completed a standardized mental health screening tool. Your task is to interpret their score and provide a gentle, supportive summary (1-2 sentences) and then suggest 1-2 concrete, actionable next steps using the tools available in the MindWell app (like 'AI MindScapes', 'Confidence Gym', or 'AI Assistant'). Do not sound alarming. Be encouraging.";
    const prompt = `The student completed the ${assessmentType} assessment. Their score is ${totalScore}, which indicates '${scoreRanges[assessmentType]}'. Please provide your interpretation and suggest a next best action.`;

    if (!GEMINI_API_URL) {
      setError('Missing Gemini API key. Add NEXT_PUBLIC_GEMINI_API_KEY to your env.');
      setAiInterpretation("Thank you for sharing. Recognizing how you feel is a brave and important step. A great next action could be to chat with the AI Assistant to explore these feelings further.");
      setLoading(false);
      setStep('results');
      return;
    }

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
      });
      if (!response.ok) throw new Error('API Request Failed');
      const result = await response.json();
      const interpretation = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setAiInterpretation(interpretation);
      // Store result in Supabase
      if (userId) {
        await supabase.from('wellness_checkins').insert([
          {
            user_id: userId,
            assessment_type: assessmentType,
            score: totalScore,
            interpretation,
            answers: JSON.stringify(finalAnswers),
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch {
      setError('Could not fetch AI interpretation. Please try again later.');
      setAiInterpretation("Thank you for sharing. Recognizing how you feel is a brave and important step. A great next action could be to chat with the AI Assistant to explore these feelings further.");
    } finally {
      setLoading(false);
      setStep('results');
    }
  };

  const reset = () => {
    setStep('intro');
    setAssessmentType(null);
    setError(null);
  };

  const currentAssessment = assessmentType ? assessments[assessmentType] : null;
  const currentQuestion = currentAssessment ? currentAssessment.questions[currentQuestionIndex] : null;
  const progress = currentAssessment ? ((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100 : 0;

  const handleBooking = () => {
    router.push('/book');
  };

  const renderContent = () => {
    if (error) {
      return <div className="text-center text-red-500 font-bold">{error}</div>;
    }
    if (loading && step !== 'quiz') {
      return <div className="text-center text-blue-400 font-bold animate-pulse">Loading...</div>;
    }
    switch (step) {
      case 'intro':
        return (
          <div className="text-center m-auto">
            <h2 className="text-3xl font-bold text-slate-100">Private Wellness Check-in</h2>
            <p className="max-w-xl mt-4 mx-auto text-slate-400">Take a moment to check in with yourself. This is a private, evidence-based way to understand your feelings. Your results are for your eyes only.</p>
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={() => startAssessment('GAD-7')} className="px-8 py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Anxiety Check-in</button>
              <button onClick={() => startAssessment('PHQ-9')} className="px-8 py-4 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">Depression Check-in</button>
            </div>
            <button onClick={() => setStep('history')} className="mt-8 px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold">View My History</button>
          </div>
        );
      case 'quiz':
        return currentQuestion && (
          <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-blue-400">{currentAssessment?.title}</p>
                <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {currentAssessment?.questions.length}</p>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mt-8">{currentQuestion.text}</h3>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map(opt => (
                <button key={opt.text} onClick={() => handleAnswer(opt.score)} className="p-4 bg-slate-700/80 hover:bg-slate-600/80 rounded-lg text-lg font-semibold transition-colors border border-slate-600">
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        );
      case 'loading':
        return (
          <div className="text-center m-auto">
            <h2 className="text-3xl font-bold text-slate-100 animate-pulse">Analyzing Your Check-in...</h2>
            <p className="mt-2 text-slate-400">Your AI Coach is preparing your personalized insights.</p>
          </div>
        );
      case 'results':
        const showBookingPrompt = (assessmentType === 'GAD-7' && finalScore >= 10) || (assessmentType === 'PHQ-9' && finalScore >= 15);
        return (
          <div className="w-full max-w-2xl mx-auto text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl shadow-xl border border-slate-700 p-8">
            <h2 className="text-4xl font-extrabold text-slate-100 mb-4 tracking-tight drop-shadow-lg">Your Check-in Results</h2>
            <div className="mt-6 p-6 bg-slate-800/80 rounded-xl shadow border border-slate-700">
              <h3 className="font-semibold text-purple-300 text-lg mb-2">AI Coach&apos;s Insight:</h3>
              <p className="mt-2 text-slate-300 leading-relaxed text-base">{aiInterpretation}</p>
            </div>
            {showBookingPrompt && (
              <div className="mt-6 p-6 bg-yellow-900/60 border border-yellow-700 rounded-xl shadow">
                <h3 className="font-bold text-yellow-300 text-lg mb-2">A Note from Your Companion</h3>
                <p className="mt-2 text-slate-200">Your results suggest you&apos;re dealing with a significant level of stress. It can be incredibly helpful to talk to a professional. Your privacy is our priority.</p>
                <button onClick={handleBooking} className="mt-4 px-8 py-3 font-bold bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow transition-colors text-lg">
                  Book a Confidential Session
                </button>
              </div>
            )}
            <button onClick={reset} className="w-full max-w-xs mt-8 py-3 font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg shadow transition-colors text-lg">
              Back to Start
            </button>
          </div>
        );
      case 'history':
        return (
          <div className="w-full max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">My Wellness Check-in History</h2>
            {loading ? <div className="text-blue-400 font-bold animate-pulse">Loading...</div> : (
              <table className="w-full text-sm border rounded-lg bg-slate-900/30">
                <thead>
                  <tr className="bg-slate-800 text-slate-200">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Score</th>
                    <th className="p-2 border">AI Insight</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-slate-400">No check-ins yet.</td></tr>
                  ) : history.map((entry, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border">{entry.created_at ? new Date(entry.created_at).toLocaleString() : '-'}</td>
                      <td className="p-2 border">{entry.assessment_type}</td>
                      <td className="p-2 border">{entry.score}</td>
                      <td className="p-2 border">{entry.interpretation ? entry.interpretation.slice(0, 60) + (entry.interpretation.length > 60 ? '...' : '') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={reset} className="w-full max-w-xs mt-8 py-3 font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Back to Start
            </button>
          </div>
        );
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="w-full max-w-2xl mx-auto flex flex-col h-full text-slate-200 bg-slate-800/60 rounded-3xl shadow-2xl border border-slate-700 p-6 md:p-12 backdrop-blur-lg">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }`}</style>
        {renderContent()}
      </div>
    </div>
  );
};

export default WellnessCheckin;