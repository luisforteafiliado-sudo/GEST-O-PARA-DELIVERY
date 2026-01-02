import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, BrainCircuit, User, Bot, Loader2, Download } from 'lucide-react';
import { getAIInsight } from '../services/geminiService';

interface AIConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: any;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ isOpen, onClose, contextData }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      generateInitialInsight();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateInitialInsight = async () => {
    setIsLoading(true);
    const contextStr = JSON.stringify(contextData);
    const insight = await getAIInsight(`Dê um resumo executivo baseado nesses dados: ${contextStr}`);
    setMessages([{ role: 'assistant', content: insight || 'Olá! Como posso ajudar sua operação hoje?' }]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    const contextStr = JSON.stringify(contextData);
    const response = await getAIInsight(`A pergunta do usuário é: "${userMsg}". Use estes dados para responder: ${contextStr}`);
    setMessages(prev => [...prev, { role: 'assistant', content: response || 'Não consegui processar sua dúvida.' }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-black border-l border-[#1a1a1a] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
      <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-[#0b0b0b]">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#D4AF37]" size={20} />
          <h2 className="font-black text-[#D4AF37] uppercase text-sm tracking-widest">GiroChef AI</h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-[#D4AF37] hover:bg-[#1a1a1a] rounded-xl transition-all"><X size={20} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
              msg.role === 'user' 
                ? 'bg-[#D4AF37] text-black font-semibold rounded-tr-none shadow-lg' 
                : 'bg-[#1a1a1a] border border-[#1a1a1a] text-slate-300 rounded-tl-none'
            }`}>
              <div className="prose prose-invert prose-sm max-w-none">
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-[#1a1a1a] rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-[#D4AF37]" />
              <span className="text-xs text-slate-500 italic uppercase tracking-tighter">Processando Inteligência...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[#1a1a1a] bg-[#0b0b0b]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Consulte o seu caixa agora..."
            className="w-full bg-black border border-[#1a1a1a] rounded-2xl py-4 px-5 pr-14 text-sm focus:outline-none focus:border-[#D4AF37] transition-all text-white shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 top-3 p-2 bg-[#D4AF37] rounded-xl text-black hover:scale-105 transition-all disabled:opacity-50 gold-glow"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[9px] text-slate-600 mt-4 text-center font-bold uppercase tracking-[0.2em]">
          Powered by Gemini AI Engine
        </p>
      </div>
    </div>
  );
};

export default AIConsultant;