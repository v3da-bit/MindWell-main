'use client';

import React, { useState, useEffect } from 'react';

// --- Type Definitions for TypeScript ---
interface CalendarEvent {
    title: string;
    startDate: string;
    endDate?: string;
    type: 'Holiday' | 'Exam' | 'Event' | 'Deadline' | 'Vacation';
}

interface ActionStep {
    step: number;
    action: string;
    details?: string;
    link?: string;
    completed: boolean;
}

interface CalendarSuggestion {
    title: string;
    description: string;
    startTime: string; // ISO format
    endTime: string; // ISO format
}

// --- Parul University Calendar Data ---
// In a real app, this would come from a database or a separate data file.
const academicCalendar: CalendarEvent[] = [
    { title: "Rakshabandhan", startDate: "2025-08-08", type: "Holiday" },
    { title: "Independence Day", startDate: "2025-08-15", type: "Holiday" },
    { title: "T/W Submission", startDate: "2025-09-04", endDate: "2025-09-06", type: "Deadline" },
    { title: "Ganesh Chaturthi", startDate: "2025-09-27", type: "Holiday" },
    { title: "ESE Practical", startDate: "2025-09-19", endDate: "2025-09-27", type: "Exam" },
    { title: "ESE Theory", startDate: "2025-10-03", endDate: "2025-10-11", type: "Exam" },
    { title: "Diwali Vacation", startDate: "2025-10-20", endDate: "2025-11-01", type: "Holiday" },
    { title: "Marks Locking by Principal and Dean", startDate: "2025-10-20", type: "Deadline" },
    { title: "Result Declaration for Regular Exam", startDate: "2025-10-20", type: "Event" },
    { title: "End Sem Supplementary Exam", startDate: "2025-10-24", type: "Exam" }
];

const UniversityNavigator: React.FC = () => {
    // Hydration error fix: only render on client
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [actionPlan, setActionPlan] = useState<ActionStep[]>([]);
    const [calendarSuggestion, setCalendarSuggestion] = useState<CalendarSuggestion | null>(null);
    const [error, setError] = useState('');
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<CalendarEvent[]>([]);

    // --- API Configuration ---
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_URL = GEMINI_API_KEY
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
        : null;

    // --- Deadline Intelligence Engine ---
    useEffect(() => {
        if (!isClient) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = academicCalendar
            .filter(event => new Date(event.startDate) >= today)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 3);
        setUpcomingDeadlines(upcoming);
    }, [isClient]);

    // --- Core AI Function: The Navigator ---
    const getActionPlan = async (userQuery: string) => {
        if (!userQuery.trim() || isLoading) return;
        setIsLoading(true);
        setActionPlan([]);
        setCalendarSuggestion(null);
        setError('');
        setQuery(userQuery);

    // Make prompt stricter for Gemini
    const systemInstruction = `You are an expert AI assistant for \"Parul University\". Respond ONLY with a valid JSON array of steps, where each step is an object with: step (number), action (string), details (string, optional), link (string, optional). Do not include any markdown, code blocks, or extra text. If you cannot answer, respond with an empty array [].`;
        try {
            const planResponse = await callGeminiAPI(userQuery, systemInstruction);
            // Debug: log raw response
            console.log('Gemini raw planResponse:', planResponse);
            let parsedPlan: Omit<ActionStep, 'completed'>[] = [];
            try {
                const planJsonString = planResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                parsedPlan = JSON.parse(planJsonString);
            } catch {
                setError('AI response could not be parsed. See console for details.');
                setIsLoading(false);
                return;
            }
            setActionPlan(parsedPlan.map(step => ({ ...step, completed: false })));

            const calendarSystemInstruction = `Based on this action plan, suggest a single, relevant calendar event in valid JSON. Respond ONLY with valid JSON. Do not include any markdown, code blocks, or extra text.`;
            const calendarPrompt = `Action Plan: ${JSON.stringify(parsedPlan)}`;
            const calendarResponse = await callGeminiAPI(calendarPrompt, calendarSystemInstruction);
            // Debug: log raw response
            console.log('Gemini raw calendarResponse:', calendarResponse);
            let parsedCalendarSuggestion: CalendarSuggestion | null = null;
            try {
                const calendarJsonString = calendarResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                parsedCalendarSuggestion = JSON.parse(calendarJsonString);
            } catch {
                setError('AI calendar response could not be parsed. See console for details.');
                setIsLoading(false);
                return;
            }
            setCalendarSuggestion(parsedCalendarSuggestion);
        } catch (error) {
            console.error('Navigator Error:', error);
            setError('Sorry, I could not find a clear process for that query.');
        } finally {
            setIsLoading(false);
        }
    };

    const callGeminiAPI = async (prompt: string, systemInstruction: string): Promise<string> => {
        if (!GEMINI_API_URL) {
            throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
        }
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] }, })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', response.status, errorText);
            throw new Error('API Request Failed: ' + response.status + ' ' + errorText);
        }
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    };
    
    // --- Helper Functions ---
    const createICSFileForStep = (step: ActionStep) => {
        if (!isClient) return;
        const now = new Date();
        const startTime = now.toISOString();
        const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // +1 hour
        const formatICSDate = (isoString: string) => new Date(isoString).toISOString().replace(/-|:|\.\d{3}/g, '');
        const uid = `${now.getTime()}@mindwell.com`;
        const dtstamp = formatICSDate(now.toISOString());
        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtstamp}\nDTSTART:${formatICSDate(startTime)}\nDTEND:${formatICSDate(endTime)}\nSUMMARY:${step.action}\nDESCRIPTION:${step.details || ''}\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${step.action}.ics`;
        link.click();
    };

    // Helper for AI calendar suggestion
    const createICSFile = () => {
        if (!isClient || !calendarSuggestion) return;
        const now = new Date();
        const formatICSDate = (isoString: string) => new Date(isoString).toISOString().replace(/-|:|\.\d{3}/g, '');
        const uid = `${now.getTime()}@mindwell.com`;
        const dtstamp = formatICSDate(now.toISOString());
        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtstamp}\nDTSTART:${formatICSDate(calendarSuggestion.startTime)}\nDTEND:${formatICSDate(calendarSuggestion.endTime)}\nSUMMARY:${calendarSuggestion.title}\nDESCRIPTION:${calendarSuggestion.description}\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${calendarSuggestion.title}.ics`;
        link.click();
    };

    const toggleStepCompletion = (step: number) => {
        setActionPlan(prevPlan => 
            prevPlan.map(item => item.step === step ? { ...item, completed: !item.completed } : item)
        );
    };

    const commonQueries = [
        "I missed a midterm due to sickness. What is the re-test process?",
        "How do I pay my hostel fees online?",
        "What is the procedure for getting a 'No Dues' certificate?",
        "I lost my ID card, how do I get a new one?"
    ];

    const getDaysRemaining = (startDate: string) => {
        if (!isClient) return 0;
        const today = new Date();
        const eventDate = new Date(startDate);
        const diffTime = eventDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (!isClient) return null;
    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4 font-sans text-white relative">
            <div className="aurora-bg"></div>
            <style>{`
                .glass-container { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
                .aurora-bg { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140vw; height: 140vh; background-image: radial-gradient(circle at 0% 0%, #3b82f6, transparent 40%), radial-gradient(circle at 100% 0%, #10b981, transparent 40%), radial-gradient(circle at 100% 100%, #8b5cf6, transparent 40%), radial-gradient(circle at 0% 100%, #ef4444, transparent 40%); animation: aurora-move 20s infinite linear; z-index: -1; }
                @keyframes aurora-move { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
            `}</style>

            <div className="w-full max-w-4xl h-[90vh] glass-container bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-700 z-10">
                <div className="flex flex-col h-full text-slate-200 p-4 md:p-8">
                    <div className="text-center flex-shrink-0">
                        <h2 className="text-3xl font-bold text-slate-100">AI University Navigator</h2>
                        <p className="max-w-xl mt-2 mx-auto text-slate-400">Your personal guide to navigating university bureaucracy and deadlines.</p>
                    </div>
                    
                    <div className="mt-8 flex-grow flex flex-col overflow-y-hidden">
                        <div className="flex-shrink-0">
                            <h3 className="text-lg font-semibold text-left text-slate-300 mb-2">Deadline Intelligence</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {upcomingDeadlines.map(deadline => {
                                    const daysRemaining = getDaysRemaining(deadline.startDate);
                                    const isUrgent = daysRemaining <= 7;
                                    return (
                                        <div key={deadline.title} className={`p-3 rounded-lg ${isUrgent ? 'bg-red-900/50 border border-red-700/50' : 'bg-slate-700/50'}`}>
                                            <p className="font-bold text-slate-200">{deadline.title}</p>
                                            <p className={`text-sm font-semibold ${isUrgent ? 'text-red-300' : 'text-slate-400'}`}>
                                                {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Today'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4 flex-shrink-0">
                            <div className="grid grid-cols-2 gap-3">
                                {commonQueries.map(q => (
                                    <button key={q} onClick={() => getActionPlan(q)} className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-left font-semibold text-slate-300 transition-colors">
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); getActionPlan(query); }} className="mt-4 flex items-center gap-2">
                                <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Or type your own question here..." className="flex-grow bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                <button type="submit" disabled={isLoading} className="py-3 px-5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-slate-600">
                                    {isLoading ? 'Thinking...' : 'Solve'}
                                </button>
                            </form>
                        </div>
                        
                        {error && <p className="mt-4 text-center text-red-400 font-semibold">{error}</p>}
                        
                        {actionPlan.length > 0 && (
                            <div className="mt-8 flex-grow overflow-y-auto custom-scrollbar pr-2">
                                <h3 className="text-xl font-bold text-slate-100 mb-4">Your Action Plan:</h3>
                                <div className="space-y-4">
                                    {actionPlan.map(item => (
                                        <div key={item.step} className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors border-2 ${item.completed ? 'bg-green-800/60 border-green-400' : 'bg-slate-800/80 border-blue-400 hover:border-blue-500'}`}>
                                            <div onClick={() => toggleStepCompletion(item.step)} className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${item.completed ? 'bg-green-400 text-white' : 'bg-blue-500 text-white'}`}>
                                                {item.completed ? '✓' : item.step}
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className={`font-bold transition-colors ${item.completed ? 'text-green-300 line-through' : 'text-white'}`}>{item.action}</p>
                                                {item.details && <p className={`text-sm transition-colors ${item.completed ? 'text-green-200' : 'text-white'}`}>{item.details}</p>}
                                                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 hover:underline">Link &rarr;</a>}
                                            </div>
                                            <button onClick={() => createICSFileForStep(item)} className="ml-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs">Add to Calendar</button>
                                        </div>
                                    ))}
                                </div>
                                {calendarSuggestion && !isLoading && (
                                    <div className="mt-6 p-4 bg-purple-900/50 rounded-lg text-center">
                                        <p className="font-semibold text-purple-300">AI Suggestion:</p>
                                        <p className="mt-1 text-white">{calendarSuggestion.title}</p>
                                        <button onClick={createICSFile} className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm">
                                            Add to Calendar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversityNavigator;
