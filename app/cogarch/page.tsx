'use client';

import React, { useState } from 'react';
import type { ReactNode } from 'react';

// --- Type Definitions ---
interface BlueprintItem {
    time: string;
    title: string;
    description: string;
    icon: 'focus' | 'relax' | 'creative' | 'social' | 'light' | 'wind-down';
    action?: {
        type: 'link' | 'mindscape';
        label: string;
        url?: string;
    };
    insight?: string; 
}
interface BlueprintResult {
    chronotype: string;
    tagline: string;
    blueprint: BlueprintItem[];
}

const CognitiveArchitectPage: React.FC = () => {
    // --- State Management ---
    const [step, setStep] = useState<'intro' | 'loading' | 'blueprint'>('intro');
    const [blueprint, setBlueprint] = useState<BlueprintResult | null>(null);
    const [error, setError] = useState('');

    // --- API Configuration ---
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_URL = GEMINI_API_KEY
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
        : null;
    
    // --- Core AI Function: The Holistic Wellness Audit ---
    const startWellnessAudit = async () => {
        setStep('loading');
        setError('');

        // --- REAL DATA INTEGRATION ---
        // We now read real data from localStorage where the main chat app saves its history.
        const savedConversation = localStorage.getItem('mindWellConversation');
        const recentHistory = savedConversation ? JSON.parse(savedConversation)
            .slice(-10) // Get the last 10 messages for relevance
            .map((msg: {sender: string, text: string}) => `${msg.sender}: ${msg.text}`)
            .join('\n')
            : "No conversation history found.";
            
        // For the demo, we still use a quiz for the chronotype
        const simulatedQuizAnswers = { q1: "After 9 AM", q2: "Late Night", q3: "A little sleepy" };

        const systemInstruction = `You are an AI-powered performance and wellness coach for a university student. Your task is to perform a "Holistic Wellness Audit" by synthesizing the user's quiz answers and their recent chat history.
        1. First, determine their chronotype (Lion, Bear, or Wolf) from the quiz.
        2. Then, analyze their recent chat topics to understand their current challenges.
        3. Finally, create a hyper-personalized daily 'Cognitive Blueprint' that directly addresses their specific challenges. For any focus blocks, suggest a relevant, helpful external resource link.
        Return ONLY a valid JSON object with this structure: { "chronotype": string, "tagline": string, "blueprint": [ { "time": string, "title": string, "description": string, "icon": string, "action": { "type": "link" | "mindscape", "label": string, "url": string }, "insight": string } ] }.
        The 'insight' key MUST explain WHY you are recommending that specific activity based on the user's data.`;

        const prompt = `Perform a Holistic Wellness Audit for this student.
        Their Chronotype Quiz Answers: ${JSON.stringify(simulatedQuizAnswers)}
        Their Recent Chat History: "${recentHistory}"`;
        
        try {
            const blueprintResponse = await callGeminiAPI(prompt, systemInstruction);
            const jsonString = blueprintResponse.replace(/json/g, '').replace(/`/g, '').trim();
            const parsedBlueprint: BlueprintResult = JSON.parse(jsonString);
            
            setBlueprint(parsedBlueprint);
            setStep('blueprint');

        } catch (error) {
            console.error("Blueprint Generation Error:", error);
            setError("Sorry, the AI couldn't perform the audit right now. Make sure you've had a recent conversation in the AI Assistant tab.");
            setStep('intro');
        }
    };

    const callGeminiAPI = async (prompt: string, systemInstruction: string): Promise<string> => {
        if (!GEMINI_API_URL) {
            throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
        }
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
        });
        if (!response.ok) throw new Error('API Request Failed');
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    };
    
    // --- New Feature: Share Intention ---
    const handleShare = () => {
        if (!blueprint) return;
        const mainGoal = blueprint.blueprint.find(b => b.icon === 'focus');
        const intentionText = `My MindWell AI just built me a Cognitive Blueprint to work as a ${blueprint.chronotype}. My main goal today is to tackle: "${mainGoal ? mainGoal.title : 'my key tasks'}". Wish me luck! #MindWell #StudentWellness`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(intentionText);
            alert("Intention copied to clipboard! Share it with a friend.");
        }
    };

    // --- Icon Mapping for Display ---
    const iconMap: { [key: string]: ReactNode } = {
        focus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>,
        relax: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9.3 15.3 5.4-5.4"></path></svg>,
        creative: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"></path></svg>,
        social: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
        light: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m4.93 19.07 1.41-1.41"></path><path d="m17.66 6.34 1.41-1.41"></path></svg>,
        'wind-down': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
    };

    const renderStep = () => {
        switch (step) {
            case 'intro':
                return (
                     <div className="text-center m-auto">
                        <h2 className="text-3xl font-bold text-slate-100">The Cognitive Architect</h2>
                        <p className="max-w-xl mt-4 mx-auto text-slate-400">Ready to build a smarter day? Our AI will perform a private wellness audit of your platform activity to design a hyper-personalized blueprint, optimizing your schedule for your unique mind.</p>
                        <button
    onClick={startWellnessAudit}
    className="mt-8 px-8 py-4 text-lg font-bold rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-lg border-2 border-pink-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
>
    Start My Wellness Audit
</button>
                        {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}
                    </div>
                );
            case 'loading':
                return (
                    <div className="m-auto">
                        <h2 className="text-3xl font-bold text-slate-100 animate-pulse">Performing Wellness Audit...</h2>
                        <p className="mt-2 text-slate-400">Your AI is synthesizing your patterns to architect your day.</p>
                    </div>
                );
            case 'blueprint':
                return blueprint && (
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-shrink-0 text-center">
                             <button onClick={() => setStep('intro')} className="text-sm text-blue-400 hover:underline mb-4">&larr; Start Over</button>
                            <h2 className="text-3xl font-bold text-slate-100">Your Cognitive Blueprint: The <span className="text-purple-400">{blueprint.chronotype}</span></h2>
                            <p className="mt-2 text-slate-400 italic">&quot;{blueprint.tagline}&quot;</p>
                        </div>
                        <div className="mt-6 flex-grow space-y-4 text-left custom-scrollbar pr-2 overflow-y-auto">
                            {blueprint.blueprint.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-black/20 rounded-lg">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-slate-700 text-purple-400">{iconMap[item.icon]}</div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-slate-200">{item.time} - {item.title}</p>
                                        <p className="text-sm text-slate-400">{item.description}</p>
                                        {item.insight && <p className="text-xs text-purple-300 italic mt-2"><strong>AI Insight:</strong> {item.insight}</p>}
                                    </div>
                                    {item.action && (
                                        <a href={item.action.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-3 py-1 bg-slate-600 hover:bg-slate-500 text-xs font-semibold rounded-full self-center">
                                            {item.action.label}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                         <div className="flex-shrink-0 mt-6 text-center">
                            <button onClick={handleShare} className="px-6 py-3 font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                Share Today&apos;s Intention
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <main className="bg-slate-900 h-screen w-screen text-white relative flex items-center justify-center p-4">
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; } .glass-container { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }`}</style>
            <div className="w-full h-full max-w-6xl z-10">
                <div className="flex flex-col h-full text-center p-4 md:p-8 text-slate-200 bg-slate-800/80 rounded-2xl glass-container border border-slate-700">
                    {renderStep()}
                </div>
            </div>
        </main>
    );
};

export default CognitiveArchitectPage;