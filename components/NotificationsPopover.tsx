
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
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-200">Notificações Operacionais</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onMarkAllAsRead}
            className="text-[10px] font-bold uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Lidas
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-500">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 hover:bg-slate-800/50 transition-colors relative group cursor-default ${!n.read ? 'bg-indigo-500/5' : ''}`}
              >
                {!n.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                )}
                <div className="flex gap-3">
                  <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                    n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                    n.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    {n.type === 'warning' ? <AlertTriangle size={18} /> : 
                     n.type === 'error' ? <Zap size={18} /> : 
                     n.type === 'success' ? <Check size={18} /> : 
                     <Info size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-2 font-medium">
                      {new Date(n.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  {!n.read && (
                    <button 
                      onClick={() => onMarkAsRead(n.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-400 transition-all"
                      title="Marcar como lida"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <Bell size={40} className="text-slate-800" />
            <p className="text-sm font-medium text-slate-500">Tudo em ordem por aqui!</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Nenhuma alerta no momento</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 bg-slate-950/30 border-t border-slate-800 text-center">
          <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">ChefMetrics IA Monitorando sua operação 24/7</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
