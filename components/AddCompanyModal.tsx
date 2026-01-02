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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0b0b0b] border border-[#2a2a2a] w-full max-w-lg rounded-[2.5rem] shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-[#2a2a2a] flex justify-between items-center bg-[#0b0b0b]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#D4AF37] uppercase tracking-tighter">Expandir Império</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Nova Unidade GiroChef</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-[#D4AF37] hover:bg-[#1a1a1a] rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest ml-1">Nome do Negócio</label>
              <input 
                type="text" 
                autoFocus
                required
                placeholder="Ex: Burger King, Sushi do Porto..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest ml-1">Segmento</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Hamburgueria, Pizzaria..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-2xl flex items-start gap-3">
            <Rocket size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              Ambiente de gestão isolado e inteligência GiroChef AI serão ativados para esta unidade.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-[#1a1a1a] border border-[#2a2a2a] transition-all"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest bg-[#D4AF37] hover:bg-[#B8962D] text-black shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-95 flex items-center justify-center gap-2 gold-glow"
            >
              <Save size={18} /> Criar Agora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;