
import React, { useState } from 'react';
import { X, Building2, Save, Rocket } from 'lucide-react';
import { Company } from '../types';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Omit<Company, 'id'>) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    
    onSave({
      name,
      category,
      logo: `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '')}/200`,
      description: ''
    });
    
    setName('');
    setCategory('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Expandir Operação</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Nova Empresa GIROCHEF</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Fantasia do Negócio</label>
              <input 
                type="text" 
                autoFocus
                required
                placeholder="Ex: Burger King, Sushi do Porto..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Segmento / Categoria</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Hamburgueria, Pizzaria, Vegano..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
            <Rocket size={18} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              Ao adicionar uma nova empresa, a GIROCHEF AI preparará um novo ambiente de gestão isolado para monitorar suas métricas exclusivas.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-4 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Criar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
