import React, { useState, useEffect, useRef } from 'react';
import { Send, Wine, Sparkles } from 'lucide-react';
import { createSommelierSession, ChatSession } from '../services/geminiService';
import { ChatMessage, Winery } from '../types';

interface GeminiSommelierProps {
  activeWinery: Winery | null;
}

export const GeminiSommelier: React.FC<GeminiSommelierProps> = ({ activeWinery }) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    const newSession = createSommelierSession();
    setSession(newSession);
    
    // Initial greeting
    setMessages([{
      role: 'model',
      text: "Welcome to the Canberra Wine Region! I'm your AI Sommelier. Select a winery on the map to learn more, or ask me anything about our local cool-climate wines.",
      timestamp: Date.now()
    }]);
  }, []);

  // Context switch when winery changes
  useEffect(() => {
    if (activeWinery && session) {
      const contextMessage = `The user is now looking at ${activeWinery.name}. It is located in ${activeWinery.district}. Known for: ${activeWinery.varieties.join(', ')}. Details: ${activeWinery.description}.`;
      
      // We send a hidden message to prime the model context without showing it in UI
      session.sendMessage(`[System Update]: ${contextMessage}. Briefly welcome the user to ${activeWinery.name} in one sentence.`).then((reply) => {
         setMessages(prev => [...prev, {
             role: 'model',
             text: reply,
             timestamp: Date.now()
         }]);
      });
    }
  }, [activeWinery, session]);

  const handleSend = async () => {
    if (!input.trim() || !session) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const replyText = await session.sendMessage(input);
      setMessages(prev => [...prev, { role: 'model', text: replyText, timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-xl border border-wine-300 shadow-sm overflow-hidden">
      <div className="p-4 bg-wine-700 text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-200" />
        <h3 className="font-serif font-bold text-lg">AI Sommelier</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-wine-700 text-white rounded-br-none' 
                : 'bg-white border border-wine-100 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white border border-wine-100 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-wine-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                 <span className="w-2 h-2 bg-wine-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                 <span className="w-2 h-2 bg-wine-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
               </div>
             </div>
           </div>
        )}
      </div>

      <div className="p-3 border-t border-wine-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about vintages, food pairings..."
            className="flex-1 px-4 py-2 rounded-full border border-wine-200 focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-wine-700 text-white rounded-full hover:bg-wine-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
