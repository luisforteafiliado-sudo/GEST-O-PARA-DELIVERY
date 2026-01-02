import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b0b0b] border border-[#2a2a2a] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20">
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onCancel}
              className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-tighter mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="p-8 bg-black/40 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-4 rounded-2xl text-xs font-bold text-slate-500 hover:text-white hover:bg-[#1a1a1a] border border-[#2a2a2a] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-lg active:scale-95 transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;