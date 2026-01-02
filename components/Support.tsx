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
      title: 'Suporte via WhatsApp',
      description: 'Fale diretamente com um especialista em gestão.',
      icon: MessageSquare,
      color: 'bg-emerald-500/10 text-emerald-500',
      action: 'Chamar agora',
      link: 'https://wa.me/5500000000000'
    },
    {
      id: 'docs',
      title: 'Central de Ajuda',
      description: 'Tutoriais e guias passo a passo da plataforma.',
      icon: BookOpen,
      color: 'bg-indigo-500/10 text-indigo-500',
      action: 'Ver guias',
      link: '#'
    },
    {
      id: 'email',
      title: 'Enviar E-mail',
      description: 'Ideal para sugestões ou questões técnicas.',
      icon: Mail,
      color: 'bg-blue-500/10 text-blue-500',
      action: 'Enviar ticket',
      link: 'mailto:suporte@girochef.com'
    }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Central de Suporte</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">GIROCHEF AI Concierge</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportChannels.map((channel) => (
              <a 
                key={channel.id}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-slate-950/50 border border-slate-800 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all flex flex-col gap-4 relative overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${channel.color} group-hover:scale-110 transition-transform`}>
                  <channel.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{channel.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{channel.description}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-2">
                  {channel.action} <ExternalLink size={12} />
                </div>
              </a>
            ))}
            
            {/* System Status Card */}
            <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl flex flex-col justify-center items-center text-center gap-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Sistema On-line</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                Todos os serviços operando normalmente em nossa infraestrutura.
              </p>
            </div>
          </div>

          {/* Quick FAQ / Note */}
          <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800/50 flex gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Horário de Atendimento</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Nosso suporte humano funciona de Segunda a Sexta, das 09h às 18h. Para urgências operacionais, utilize o canal prioritário via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-950/50 border-t border-slate-800 text-center flex items-center justify-center gap-4">
          <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em]">v1.5.0 build • GIROCHEF SaaS</p>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;