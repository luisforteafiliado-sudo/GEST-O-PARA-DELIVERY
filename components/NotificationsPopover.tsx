import React from 'react';
import { Bell, Check, Info, AlertTriangle, X, Zap } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsPopoverProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ 
  notifications, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b0b0b] border border-[#2a2a2a] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-5 border-b border-[#2a2a2a] bg-black/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#D4AF37]" />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Monitoramento Ativo</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onMarkAllAsRead}
            className="text-[9px] font-black uppercase text-[#D4AF37] hover:opacity-80 transition-opacity"
          >
            Marcar Lidas
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1a1a1a] rounded-lg text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          <div className="divide-y divide-[#2a2a2a]">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 hover:bg-[#1a1a1a]/40 transition-colors relative group cursor-default ${!n.read ? 'bg-[#D4AF37]/5' : ''}`}
              >
                {!n.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]"></div>
                )}
                <div className="flex gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
                    n.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    n.type === 'error' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                  }`}>
                    {n.type === 'warning' ? <AlertTriangle size={20} /> : 
                     n.type === 'error' ? <Zap size={20} /> : 
                     n.type === 'success' ? <Check size={20} /> : 
                     <Info size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${!n.read ? 'text-[#D4AF37]' : 'text-slate-300'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {n.message}
                    </p>
                    <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase tracking-widest">
                      {new Date(n.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center gap-4">
            <Bell size={48} className="text-[#1a1a1a]" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Silêncio Absoluto</p>
              <p className="text-[10px] text-slate-700 italic mt-1">Sua operação está sob controle total.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black border-t border-[#2a2a2a] text-center">
        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">GiroChef AI Sentinel</p>
      </div>
    </div>
  );
};

export default NotificationsPopover;