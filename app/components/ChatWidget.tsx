import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Type Definitions for TypeScript ---
interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// --- BUG FIX: Created a stable component for the AI message to handle the typewriter effect ---
const AIMessage: React.FC<{ text: string }> = ({ text }) => {
    const pRef = useRef<HTMLParagraphElement>(null);
    const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const typewriterEffect = (element: HTMLParagraphElement, textToType: string) => {
            if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
            let i = 0;
            const words = textToType.split(' ');
            element.innerHTML = '';
            element.classList.add('typewriter-cursor');
            const chatHistory = element.closest('.custom-scrollbar');

            typewriterIntervalRef.current = setInterval(() => {
                if (i < words.length) {
                    element.innerHTML += (i > 0 ? ' ' : '') + words[i];
                    i++;
                    if (chatHistory) {
                        chatHistory.scrollTop = chatHistory.scrollHeight;
                    }
                } else {
                    if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
                    element.classList.remove('typewriter-cursor');
                }
            }, 80);
        };
        
        if (pRef.current) {
            typewriterEffect(pRef.current, text);
        }

        return () => {
            if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
        }
    }, [text]); // This effect now ONLY runs when the text prop changes

    return (
        <p ref={pRef} className="max-w-xs md:max-w-md rounded-2xl px-4 py-2 bg-white text-gray-700 shadow-sm">
            {text}
        </p>
    );
};

const MindWellChat: React.FC = () => {
    // --- State Management using React Hooks ---
    const [isLoading, setIsLoading] = useState(false);
    // --- BUG FIX: Initialized state with the welcome message directly ---
    const [conversationHistory, setConversationHistory] = useState<Message[]>([
        { sender: 'ai', text: "Hi, I'm here to support your well-being. I can help with stress, anxiety, burnout, and student well-being. How can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [language, setLanguage] = useState('English');
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    // --- Gemini API Configuration ---
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_URL = GEMINI_API_KEY
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
        : null;

    // --- System Prompt for AI Persona ---
    const systemPrompt = `You are "MindWell," a helpful AI mental health assistant for students in higher education. You must be supportive, gentle, and non-judgmental.
    RULES:
    1.  *Your Purpose:* Your ONLY purpose is to support students with their well-being. You can help with stress, anxiety, burnout, and student-life challenges.
    2.  *Stay Focused:* You MUST strictly refuse to answer any questions not related to mental health or student well-being. Politely state that your purpose is to provide wellness support.
    3.  *No Medical Advice:* You are NOT a doctor. You must never provide diagnoses or prescribe anything.
    4.  *Crisis Protocol:* If a user mentions a crisis or self-harm, you MUST gently recommend they speak to a professional counselor or a crisis hotline immediately.
    5.  *Language:* Respond ONLY in the language specified by the user in the prompt.`;
    
    // --- Helper to add messages to state ---
    const addMessage = useCallback((sender: 'user' | 'ai', text: string) => {
        setConversationHistory(prev => [...prev, { sender, text }]);
    }, []);
    
    // --- Auto-scroll chat history ---
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [conversationHistory]);

    // --- Core API Call Logic ---
    const callGeminiAPI = async (prompt: string, systemInstruction: string): Promise<string> => {
        const fullPrompt = `Language: ${language}. User said: "${prompt}"`;
        if (!GEMINI_API_URL) {
            throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
        }
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] },
            })
        });
        if (!response.ok) {
            let errorBody = null;
            try { errorBody = await response.json(); } catch {}
            console.error("API Error Response:", errorBody);
            throw new Error(`API Request Failed with status ${response.status}`);
        }
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    };

    // --- Form Submission Handler ---
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const messageText = userInput.trim();
        if (!messageText || isLoading) return;

        addMessage('user', messageText);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await callGeminiAPI(messageText, systemPrompt);
            addMessage('ai', response);
        } catch (error) {
            console.error("API Error:", error);
            addMessage('ai', 'Sorry, I encountered an error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .chat-container { font-family: 'Inter', sans-serif; background-color: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(200, 200, 200, 0.5); }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #a5d6a7; border-radius: 10px; }
                .typewriter-cursor::after { content: '▋'; animation: blink 1s step-end infinite; color: #4caf50; }
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
            <div className="chat-container w-full max-w-2xl rounded-2xl p-4 shadow-lg flex flex-col h-[48vh] max-h-[350px]">
                <div className="flex-shrink-0 mb-2 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Your Mental Health Companion</h2>
                        <p className="text-xs text-gray-600">This is not a substitute for professional care.</p>
                    </div>
                     <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-auto p-2">
                        <option value="English">English</option>
                        <option value="Hindi">हिन्दी (Hindi)</option>
                        <option value="Bengali">বাংলা (Bengali)</option>
                        <option value="Telugu">తెలుగు (Telugu)</option>
                        <option value="Marathi">मराठी (Marathi)</option>
                     </select>
                </div>

                <div ref={chatHistoryRef} className="custom-scrollbar flex-grow space-y-4 overflow-y-auto p-2">
                    {conversationHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' ? (
                                <AIMessage text={msg.text} />
                            ) : (
                                <p className="max-w-xs md:max-w-md rounded-2xl px-4 py-2 bg-green-500 text-white">
                                    {msg.text}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleFormSubmit} className="flex-shrink-0 mt-4 flex items-center">
                    <input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        type="text"
                        placeholder={isLoading ? "MindWell is thinking..." : "Type your message..."}
                        disabled={isLoading}
                        autoComplete="off"
                        className="flex-grow bg-white border border-gray-300 rounded-full p-3 pl-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-2 ml-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors text-white disabled:bg-gray-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </>
    );
};

export default MindWellChat;