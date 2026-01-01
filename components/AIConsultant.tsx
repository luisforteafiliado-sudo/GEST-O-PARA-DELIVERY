
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

  const handleDownloadChat = () => {
    if (messages.length === 0) return;
    
    const timestamp = new Date().toLocaleString('pt-BR');
    let chatContent = `HISTÓRICO COMPLETO DE CONSULTORIA - CHEFMETRICS AI\n`;
    chatContent += `Data de exportação: ${timestamp}\n`;
    chatContent += `Empresa: ${contextData.company.name}\n`;
    chatContent += `==========================================\n\n`;
    
    messages.forEach((msg) => {
      const role = msg.role === 'user' ? 'VOCÊ' : 'CHEF AI';
      chatContent += `${role}:\n${msg.content}\n\n`;
      chatContent += `------------------------------------------\n\n`;
    });

    downloadFile(chatContent, `consultoria_completa_${contextData.company.name.toLowerCase().replace(/\s+/g, '_')}.txt`);
  };

  const handleDownloadSingleMessage = (role: 'user' | 'assistant', content: string) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const roleLabel = role === 'user' ? 'VOCÊ (Pergunta)' : 'CHEF AI (Insight)';
    const fileNamePrefix = role === 'user' ? 'pergunta' : 'insight';
    
    let chatContent = `INSIGHT INDIVIDUAL - CHEFMETRICS AI\n`;
    chatContent += `Data: ${timestamp}\n`;
    chatContent += `Empresa: ${contextData.company.name}\n`;
    chatContent += `==========================================\n\n`;
    chatContent += `${roleLabel}:\n${content}\n\n`;
    chatContent += `==========================================\n`;

    downloadFile(chatContent, `${fileNamePrefix}_chef_ai_${new Date().getTime()}.txt`);
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={20} />
          <h2 className="font-bold text-slate-200">Chef AI Consultant</h2>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button 
              onClick={handleDownloadChat}
              className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
              title="Baixar Conversa Completa"
            >
              <Download size={18} />
            </button>
          )}
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-indigo-400" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {msg.role === 'user' ? 'Você' : 'Chef AI'}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleDownloadSingleMessage(msg.role, msg.content)}
                  className={`p-1 rounded hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100 ${
                    msg.role === 'user' ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-indigo-400'
                  }`}
                  title="Baixar esta mensagem"
                >
                  <Download size={14} />
                </button>
              </div>
              
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
              <span className="text-xs text-slate-500 italic">Chef está analisando seus números...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre sua rentabilidade..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-2 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          Powered by Gemini AI Engine
        </p>
      </div>
    </div>
  );
};

export default AIConsultant;
