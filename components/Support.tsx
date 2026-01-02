import React from 'react';
import { X, MessageSquare, Mail, BookOpen, Globe, ExternalLink, HelpCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const supportChannels = [
    {
      id: 'whatsapp',
      title: 'Expert em Gestão',
      description: 'Consultoria estratégica via WhatsApp.',
      icon: MessageSquare,
      color: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
      action: 'Chamar Especialista',
      link: '#'
    },
    {
      id: 'docs',
      title: 'Academy GiroChef',
      description: 'Aprenda a dominar seu caixa e estoque.',
      icon: BookOpen,
      color: 'bg-white/5 text-white border-white/20',
      action: 'Ver Masterclass',
      link: '#'
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0b0b0b] border border-[#2a2a2a] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-[#2a2a2a] flex justify-between items-center bg-[#0b0b0b]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-[1.5rem] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shadow-inner">
              <HelpCircle size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tighter">Concierge GiroChef</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Suporte de Alta Performance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportChannels.map((channel) => (
              <a key={channel.id} href={channel.link} target="_blank" className="group p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] hover:border-[#D4AF37]/50 hover:bg-black transition-all flex flex-col gap-6 relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${channel.color} group-hover:scale-110 transition-transform`}>
                  <channel.icon size={28} />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg group-hover:text-[#D4AF37] transition-colors">{channel.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 italic">{channel.description}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mt-2 group-hover:gap-4 transition-all">
                  {channel.action} <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>

          <div className="bg-black/50 p-8 rounded-[2rem] border border-[#2a2a2a] flex gap-6 items-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Sistemas Operantes</p>
              <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed">
                Nossa infraestrutura está operando em 99.9% de uptime para sua segurança.
              </p>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-black border-t border-[#2a2a2a] text-center">
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">GIROCHEF v1.5 PREMIUM BUILD</p>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;