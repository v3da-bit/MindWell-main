'use client';

import React, { useState, useRef, useEffect } from 'react';

// --- Type Definitions for TypeScript ---
interface Scenario {
    id: string;
    title: string;
    description: string;
    persona: string;
    hardModePersona: string;
    icon: React.JSX.Element;
}
interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// --- Icons for Scenarios ---
const icons = {
    professor: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4"/><path d="M18 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M6 16.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 14H8"/><path d="m15 16-1-1 4-4 1 1-4 4Z"/><path d="M22 16.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>,
    roommate: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    interview: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 19a4 4 0 0 1-4 0"/><path d="M16 16v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"/><path d="M8 11V9a4 4 0 1 1 8 0v2"/><rect width="18" height="12" x="3" y="11" rx="2"/></svg>,
    friend: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V7a5 5 0 0 0-10 0v7l-2 3h14l-2-3Z"/><path d="M8 7c0-2.4 1.4-4.5 3.5-5.3"/><path d="M16 7c0-2.4-1.4-4.5-3.5-5.3"/></svg>,
    lecture: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="M18 18V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12"/><path d="M6 12h12"/><path d="M12 4v8"/></svg>,
    club: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12v-4"/><path d="m16 16-2-4"/><path d="m8 16 2-4"/></svg>,
    parents: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A2 2 0 0 0 12 4H7a2 2 0 0 0-2 2v14"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>,
    career: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M18 15.5V22l-4-3-4 3v-6.5a2.5 2.5 0 0 1 5 0Z"/></svg>,
    group: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M7 12v4h10v-4"/><path d="M12 3v9"/></svg>
};

const scenarios: Scenario[] = [
    { id: 'prof_extension', title: "Ask a professor for an extension", description: "Practice a respectful conversation to request more time.", persona: "a firm but fair university professor", hardModePersona: "a very strict and impatient professor", icon: icons.professor },
    { id: 'roommate_conflict', title: "Resolve a conflict with a roommate", description: "Simulate a calm discussion about cleanliness or noise.", persona: "a slightly messy and defensive roommate", hardModePersona: "an irritable roommate who denies any problem", icon: icons.roommate },
    { id: 'job_interview', title: "Prepare for a job interview", description: "Practice answering common questions for an internship.", persona: "a professional and inquisitive job interviewer", hardModePersona: "a skeptical interviewer who questions every answer", icon: icons.interview },
    { id: 'saying_no', title: "Practice saying 'no' to a friend", description: "Rehearse declining a request without feeling guilty.", persona: "a friendly but persuasive friend", hardModePersona: "a friend who uses guilt-tripping", icon: icons.friend },
    { id: 'ask_in_class', title: "Ask a question in a large lecture", description: "Build the confidence to ask for clarification in front of peers.", persona: "a busy professor who appreciates clear questions", hardModePersona: "a fast-talking professor who seems unapproachable", icon: icons.lecture },
    { id: 'join_club', title: "Join a new club or group", description: "Practice introducing yourself and finding your place.", persona: "a friendly and welcoming club president", hardModePersona: "a member of a tight-knit, exclusive group", icon: icons.club },
    { id: 'talk_to_parents', title: "Talk to parents about grades", description: "Simulate an honest conversation about a disappointing result.", persona: "understanding and supportive parents", hardModePersona: "parents with very high expectations", icon: icons.parents },
    { id: 'networking_event', title: "Networking at a career fair", description: "Practice your elevator pitch with a company recruiter.", persona: "a friendly recruiter from your dream company", hardModePersona: "a distracted recruiter who has spoken to 50 students", icon: icons.career },
    { id: 'group_conflict', title: "Handle a group project conflict", description: "Practice discussing workload with a team member who isn't contributing.", persona: "a friendly but distracted group member", hardModePersona: "a dismissive group member who sees no problem", icon: icons.group }
];

// --- Helper component for user input ---
const UserInputForm: React.FC<{ onSubmit: (text: string) => void, isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [text, setText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText('');
    };
    return (
        <form onSubmit={handleSubmit} className="flex-grow">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isLoading ? "AI is thinking..." : "Type your response..."}
                disabled={isLoading}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </form>
    );
};

// --- Main Confidence Gym Component ---
const ConfidenceGym: React.FC = () => {
    const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [debrief, setDebrief] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<'normal' | 'hard'>('normal');
    const [language, setLanguage] = useState('English');
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_URL = GEMINI_API_KEY
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
        : null;

    const callGeminiAPI = async (prompt: string, systemInstruction: string): Promise<string> => {
        if (!GEMINI_API_URL) {
            throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
        }
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] }
            })
        });
        if (!response.ok) throw new Error('API Request Failed');
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    };
    
    const startSimulation = async (scenario: Scenario, level: 'normal' | 'hard' = 'normal') => {
        setActiveScenario(scenario);
        setConversation([]);
        setDebrief(null);
        setIsSimulating(true);
        setIsThinking(true);
        setDifficulty(level);
        
        const persona = level === 'hard' ? scenario.hardModePersona : scenario.persona;
        const systemInstruction = `You are an AI role-playing actor. Adopt the persona of '${persona}'. Start the conversation by setting the scene and asking the user to begin. Respond in the language requested.`;
        try {
            const intro = await callGeminiAPI("Start the conversation.", systemInstruction);
            setConversation([{ sender: 'ai', text: intro }]);
        } catch {
            setConversation([{ sender: 'ai', text: "I'm ready to begin when you are." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleUserResponse = async (userText: string) => {
        if (!activeScenario) return;
        const newHistory: Message[] = [...conversation, { sender: 'user' as const, text: userText }];
        setConversation(newHistory);
        setIsThinking(true);

        const persona = difficulty === 'hard' ? activeScenario.hardModePersona : activeScenario.persona;
        const systemInstruction = `You are an AI role-playing as '${persona}'. Continue the conversation realistically. Keep your responses concise. Respond in the language requested.`;
        const prompt = `Conversation History:\n${newHistory.map(m => `${m.sender}: ${m.text}`).join('\n')}\nAI (${persona}), what is your next response?`;
        
        try {
            const aiResponse = await callGeminiAPI(prompt, systemInstruction);
            setConversation(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch {
            setConversation(prev => [...prev, { sender: 'ai', text: "I'm not sure how to respond. Let's try another approach." }]);
        } finally {
            setIsThinking(false);
        }
    };
    
    const generateDebrief = async () => {
        if (conversation.length < 2) return;
        setIsThinking(true);
        setDebrief(null);
        
        const simulatedBiofeedback = "Throughout the conversation, the user's facial expression remained 'neutral' but shifted to 'anxious' for 3 seconds when the AI mentioned the 'firm deadline'.";

        const systemInstruction = `You are an expert communication coach. Analyze the user's side of the conversation. You also have biofeedback data on their facial expressions. Provide a gentle, constructive "debrief" that INTEGRATES the biofeedback. Give strengths and one key suggestion for improvement. Respond in markdown format and in the language requested.`;
        const prompt = `Conversation Transcript:\n${conversation.map(m => `${m.sender}: ${m.text}`).join('\n')}\n\nBiofeedback Data:\n${simulatedBiofeedback}\n\nCoach, please provide your integrated feedback.`;
        
        try {
            const aiDebrief = await callGeminiAPI(prompt, systemInstruction);
            setDebrief(aiDebrief);
        } catch {
            setDebrief("I wasn't able to analyze that session, but great job for practicing!");
        } finally {
            setIsThinking(false);
        }
    };

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [conversation]);

    const resetSession = () => {
        setActiveScenario(null);
        setIsSimulating(false);
    };

    return (
        <div className="flex flex-col h-full text-slate-200 bg-slate-800/50 rounded-lg p-4 md:p-6 glass-container border border-slate-700">
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }`}</style>
            {!isSimulating ? (
                <>
                    <div className="text-center flex-shrink-0">
                        <h2 className="text-3xl font-bold text-slate-100">The Confidence Gym</h2>
                        <p className="max-w-xl mt-2 mx-auto text-slate-400">A private space to practice life&apos;s difficult conversations. Choose a scenario to begin your training.</p>
                    </div>
                    <div className="mt-8 flex-grow custom-scrollbar overflow-y-auto pr-2 -mr-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {scenarios.map(s => (
                                <button key={s.id} onClick={() => startSimulation(s)} className="p-4 bg-slate-900/50 hover:bg-slate-700/50 rounded-lg text-left transition-all duration-300 h-full flex flex-col items-start hover:scale-105 border border-slate-700 hover:border-blue-500">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-blue-400 mb-3">{s.icon}</div>
                                    <h3 className="text-md font-bold text-slate-100 flex-shrink-0">{s.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1 flex-grow">{s.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex-shrink-0 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">Simulation: <span className="text-purple-400">{activeScenario?.title}</span></h2>
                            <p className="text-sm text-slate-400">You are speaking with: {difficulty === 'hard' ? activeScenario?.hardModePersona : activeScenario?.persona}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2">
                                <option value="English">English</option>
                                <option value="Hindi">हिन्दी</option>
                                <option value="Gujarati">ગુજરાતી</option>
                            </select>
                            <button onClick={resetSession} className="text-sm font-semibold text-red-400 hover:text-red-300">&larr; Back to Scenarios</button>
                        </div>
                    </div>
                    <div ref={chatHistoryRef} className="flex-grow my-4 bg-black/30 rounded-lg p-4 space-y-4 overflow-y-auto custom-scrollbar">
                        {conversation.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <p className={`max-w-md rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>{msg.text}</p>
                            </div>
                        ))}
                         {isThinking && <div className="flex justify-start"><div className="rounded-lg px-4 py-2 bg-slate-700 animate-pulse">...</div></div>}
                    </div>
                    {debrief ? (
                        <div className="flex-shrink-0 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-green-300 text-lg flex items-center gap-2">Coach&apos;s Debrief</h3>
                            <div className="text-sm whitespace-pre-wrap mt-2 prose prose-invert prose-sm text-slate-300" dangerouslySetInnerHTML={{ __html: debrief.replace(/\n/g, '<br />').replace(/\*/g, '• ') }} />
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => startSimulation(activeScenario!, 'normal')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm">Try Again (Normal)</button>
                                <button onClick={() => startSimulation(activeScenario!, 'hard')} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg text-sm">Challenge: Hard Mode</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-shrink-0 flex items-center gap-2">
                             <UserInputForm onSubmit={handleUserResponse} isLoading={isThinking} />
                             <button onClick={generateDebrief} disabled={isThinking || conversation.length < 2} className="py-3 px-5 font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:bg-slate-600">End & Debrief</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- FIX: This is now the main component exported from this file ---
export default function ConfidenceGymPage() {
    return (
        <main className="bg-slate-900 h-screen w-screen text-white relative flex items-center justify-center p-4 md:p-8">
            <style>{`
                /* The aurora-bg style has been removed from here as it's no longer needed */
            `}</style>
            <div className="w-full h-full max-w-6xl z-10">
                <ConfidenceGym />
            </div>
        </main>
    );
}