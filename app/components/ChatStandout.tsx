declare global {
    interface Window {
        chatQueue: Array<{ ts: number; text: number }>;
    }
}
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UserDropdown from '@/app/components/UserDropdown';
import { appendPoint } from '@/app/lib/activityStore';

// --- Type Definitions for TypeScript ---
interface Message {
    sender: 'user' | 'ai';
    text: string;
}

function estimateTextIntensity(text: string) {
  const len = text.trim().length;
  const capped = Math.min(500, len);
  return Math.max(0.05, Math.min(1, capped / 500));
}

function recordTextActivityFromMessage(msg: string) {
    const intensity = estimateTextIntensity(msg);
  appendPoint({ speech: intensity, ts: Date.now() });
        // --- Batching logic for chat events ---
        const BATCH_SIZE = 10;
        if (!window.chatQueue) window.chatQueue = [];
        window.chatQueue.push({ ts: Date.now(), text: intensity });
        if (window.chatQueue.length >= BATCH_SIZE) {
            fetch('/api/emotion/chat-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: window.chatQueue }),
            });
            window.chatQueue = [];
        }
}


const MindWellAdvancedChat: React.FC = () => {
    // --- State Management using React Hooks ---
    // Example usage to avoid unused warning
    useEffect(() => { recordTextActivityFromMessage('Hello!'); }, []);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
    const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const [language, setLanguage] = useState('English');
    // Removed unused typewriterIntervalRef
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    // --- Gemini API Configuration ---
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_URL = GEMINI_API_KEY
        ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
        : null;
    
    // --- System Prompts for AI ---
    const mainSystemPrompt = `You are "MindWell Assistant," a supportive AI for students. Your goal is to help with mental health topics like stress, anxiety, and burnout. You must strictly refuse to answer off-topic questions. You are not a doctor and cannot give medical advice. If a user is in crisis, gently guide them to a professional. Respond ONLY in the language the user specifies.`;
    const summarySystemPrompt = `Summarize the key points and feelings expressed in the following user-AI conversation into a concise, empathetic paragraph for the user's private reflection.`;
    const moodAnalysisSystemPrompt = `Based on the following conversation, analyze the user's likely emotional state. Describe it in one short, gentle, and encouraging sentence. For example: "It sounds like you're feeling stressed, but also hopeful about finding solutions."`;

    // --- Helper to add messages and handle state ---
    const addMessage = useCallback((sender: 'user' | 'ai', text: string) => {
        setConversationHistory(prev => [...prev, { sender, text }]);
    }, []);

    // --- Load initial data from localStorage on component mount ---
    useEffect(() => {
        const savedConversation = localStorage.getItem('mindWellConversation');
        const savedPins = localStorage.getItem('mindWellPinned');

        if (savedConversation) {
            setConversationHistory(JSON.parse(savedConversation));
        } else {
            addMessage('ai', 'Hello! I\'m here to support your well-being. How can I help you today?');
        }

        if (savedPins) {
            setPinnedMessages(JSON.parse(savedPins));
        }
    }, [addMessage]);

    // --- Save data to localStorage whenever it changes ---
    useEffect(() => {
        localStorage.setItem('mindWellConversation', JSON.stringify(conversationHistory));
    }, [conversationHistory]);

    useEffect(() => {
        localStorage.setItem('mindWellPinned', JSON.stringify(pinnedMessages));
    }, [pinnedMessages]);
    
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
            const errorBody = await response.json();
            console.error("API Error Response:", errorBody);
            throw new Error(`API Request Failed with status ${response.status}`);
        }
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    };
    
    // --- Main Query Processing ---
    const processQuery = async (query: string) => {
        setIsLoading(true);
        try {
            const response = await callGeminiAPI(query, mainSystemPrompt);
            addMessage('ai', response);
        } catch (error) {
            console.error("API Error:", error);
            addMessage('ai', 'Sorry, I encountered an error. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const messageText = userInput.trim();
        if (!messageText || isLoading) return;
        addMessage('user', messageText);
        setUserInput('');
        processQuery(messageText);
    };

    const handleAutomatedQuery = (topic: string) => {
        if (isLoading) return;
        addMessage('user', `Let's talk about ${topic}.`);
        processQuery(`Tell me more about how to deal with ${topic}.`);
    };

    // --- Tools & Insights Logic ---
    const handleSummarize = async () => { if (isLoading || conversationHistory.length < 2) { alert("Have a brief conversation first."); return; } setIsLoading(true); try { const fullConvo = conversationHistory.map(m => `${m.sender}: ${m.text}`).join('\n'); const summary = await callGeminiAPI(fullConvo, summarySystemPrompt); addMessage('ai', `Here's a summary of our chat:\n\n${summary}`); } catch { addMessage('ai', 'Sorry, I couldn\'t create a summary right now.'); } finally { setIsLoading(false); } };
    const handleAnalyzeMood = async () => { if (isLoading || conversationHistory.length < 2) { alert("Have a brief conversation first."); return; } setIsLoading(true); try { const fullConvo = conversationHistory.map(m => `${m.sender}: ${m.text}`).join('\n'); const mood = await callGeminiAPI(fullConvo, moodAnalysisSystemPrompt); addMessage('ai', `Based on our chat, here's a gentle observation:\n\n${mood}`); } catch { addMessage('ai', 'Sorry, I couldn\'t analyze the mood right now.'); } finally { setIsLoading(false); } };
    const handleClearChat = () => { setConversationHistory([]); addMessage('ai', 'Chat history cleared. How can I help you now?'); };

    // --- Pinning Logic ---
    const pinMessage = (text: string) => { if (!pinnedMessages.includes(text)) { setPinnedMessages(prev => [text, ...prev].slice(0, 10)); } };
    const unpinMessage = (text: string) => { setPinnedMessages(prev => prev.filter(p => p !== text)); };

    return (
    <div className="bg-slate-900 w-full flex items-center justify-center p-4 font-sans text-white">
            <style>{`
                .glass-container { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
                .ai-message-bubble:hover .pin-button { opacity: 1; }
            `}</style>

            <div className="w-full max-w-5xl glass-container bg-slate-900/60 rounded-2xl p-4 md:p-6 shadow-2xl border border-slate-700 h-[90vh] max-h-[800px] grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* UserDropdown positioned above chat box */}
                <div className="absolute top-4 right-4 z-50">
                  <UserDropdown />
                </div>
                {/* Left Panel: Chat Interface */}
                <div className="md:col-span-2 flex flex-col h-full">
                    <div className="flex-shrink-0 flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-slate-100">MindWell Assistant</h1>
                            <p className="text-xs text-blue-400">Your Private Wellness Companion</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-800/80 border border-slate-600/50 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5">
                                <option value="English">English</option>
                                <option value="Hindi">हिन्दी (Hindi)</option>
                                <option value="Bengali">বাংলা (Bengali)</option>
                                <option value="Telugu">తెలుగు (Telugu)</option>
                            </select>
                            <button onClick={handleClearChat} title="Clear chat history" className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </div>

                    <div ref={chatHistoryRef} className="custom-scrollbar flex-grow bg-black/30 rounded-lg p-4 space-y-4 overflow-y-auto h-0 min-h-[200px] max-h-[calc(70vh)]">
                        {conversationHistory.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 relative group ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200 ai-message-bubble'}`}>
                                    {msg.text}
                                    {msg.sender === 'ai' && (
                                        <button onClick={() => pinMessage(msg.text)} title="Pin Message" className="pin-button absolute -top-2 -right-2 bg-slate-600 p-1.5 rounded-full text-slate-300 hover:bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleFormSubmit} className="flex-shrink-0 mt-4 flex items-center space-x-2">
                        <div className="flex-grow flex items-center bg-slate-800 rounded-full border border-slate-600">
                            <input value={userInput} onChange={(e) => setUserInput(e.target.value)} type="text" placeholder={isLoading ? "MindWell is thinking..." : "Type your message..."} disabled={isLoading} autoComplete="off" className="flex-grow bg-transparent p-3 pl-5 text-slate-200 focus:outline-none" />
                            <button type="submit" disabled={isLoading} className="p-2 m-1 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors text-white disabled:bg-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Panel: Insights & Tools */}
                <div className="md:col-span-1 flex flex-col space-y-4 h-full">
                    <div>
                        <h2 className="text-lg font-bold text-slate-100 mb-2">Insights & Tools</h2>
                        <div className="bg-black/30 rounded-lg p-3 space-y-2">
                             <button onClick={handleSummarize} className="w-full flex items-center gap-3 text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"><svg className="text-purple-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg><span className="font-semibold text-slate-200">Smart Summary</span></button>
                             <button onClick={handleAnalyzeMood} className="w-full flex items-center gap-3 text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"><svg className="text-teal-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c.51.53.84 1.22.84 2c0 1.38-1.12 2.5-2.5 2.5S11 5.88 11 4.5c0-.78.33-1.47.84-2A10 10 0 0 0 12 2Z"></path><path d="M12 12a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z"></path><path d="M12 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z"></path></svg><span className="font-semibold text-slate-200">Analyze Mood</span></button>
                        </div>
                    </div>
                     <div>
                         <h2 className="text-lg font-bold text-slate-100 mb-2">Conversation Topics</h2>
                         <div className="bg-black/30 rounded-lg p-3 grid grid-cols-2 gap-2">
                            {['Exam Stress', 'Overwhelm', 'Loneliness', 'Motivation'].map(topic => (
                                <button key={topic} onClick={() => handleAutomatedQuery(topic)} className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-slate-300 text-sm font-semibold">{topic}</button>
                            ))}
                         </div>
                    </div>
                    <div className="flex-grow flex flex-col">
                        <h2 className="text-lg font-bold text-slate-100 mb-2">Pinned Messages</h2>
                        <div className="custom-scrollbar bg-black/30 rounded-lg p-2 flex-grow overflow-y-auto">
                           {pinnedMessages.length === 0 ? (
                                <p className="text-slate-400 text-sm p-2 text-center">Click the pin icon on a message to save it here.</p>
                           ) : (
                                pinnedMessages.map((text, index) => (
                                    <div key={index} className="p-2 bg-slate-800/50 rounded-lg mb-2 text-sm text-slate-300 relative group">
                                        <p>{text}</p>
                                        <button onClick={() => unpinMessage(text)} className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                                ))
                           )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MindWellAdvancedChat;