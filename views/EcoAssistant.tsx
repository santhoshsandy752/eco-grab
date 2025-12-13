
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToEcoBot } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, Loader2, Info } from 'lucide-react';

const EcoAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm EcoBot 🌿. Ask me anything about wildlife, the ocean, or how to save the planet!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToEcoBot(messages, input);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-green-50">
      <div className="bg-emerald-600 p-4 text-white shadow-md z-10">
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <Bot size={24} />
            </div>
            <div>
                <h2 className="font-bold text-lg leading-tight">Eco Assistant</h2>
                <p className="text-emerald-100 text-xs">Powered by Gemini AI</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 text-emerald-800 text-xs py-1 px-3 rounded-full flex items-center gap-1">
                <Info size={12}/> I only answer eco-friendly questions!
            </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-emerald-500" size={16} />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-2 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about pandas, recycling..."
            className="flex-1 bg-transparent px-3 py-1 focus:outline-none text-slate-800 placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-full transition-all ${
                !input.trim() || isLoading ? 'bg-slate-300 text-slate-500' : 'bg-emerald-600 text-white shadow-md active:scale-90'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcoAssistant;
