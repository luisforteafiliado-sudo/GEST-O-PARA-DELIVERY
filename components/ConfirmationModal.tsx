
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onCancel}
              className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="p-6 bg-slate-950/50 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
