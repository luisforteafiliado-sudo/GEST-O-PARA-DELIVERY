
import React from 'react';
import { Truck, Plus, Pencil, Trash2, Search, Star, Phone, Mail } from 'lucide-react';
import { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  onAddClick: () => void;
  onEditClick: (supplier: Supplier) => void;
  onDeleteClick: (id: string) => void;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAddClick, onEditClick, onDeleteClick }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tighter">Gestão de Fornecedores</h2>
          <p className="text-slate-500 text-sm italic">Parcerias estratégicas para o seu suprimento.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-[#D4AF37] hover:bg-[#B8962D] text-black px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 gold-glow flex items-center gap-2"
        >
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-4 bg-black/40 border-b border-[#2a2a2a]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-[#2a2a2a] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#D4AF37]/50 text-[10px] font-black uppercase tracking-widest border-b border-[#2a2a2a]">
                <th className="px-6 py-5">Nome do Fornecedor</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Contato</th>
                <th className="px-6 py-5">Avaliação</th>
                <th className="px-6 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-black/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                          <Truck size={18} />
                        </div>
                        <span className="text-sm font-bold text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase text-slate-500 bg-black px-2 py-1 rounded border border-[#2a2a2a]">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={12} className="text-[#D4AF37]/60" /> {s.contact}
                        </div>
                        {s.email && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail size={12} /> {s.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < (s.rating || 0) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-slate-800"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEditClick(s)} className="p-2 hover:bg-black rounded-lg text-slate-500 hover:text-[#D4AF37] transition-all"><Pencil size={18} /></button>
                        <button onClick={() => onDeleteClick(s.id)} className="p-2 hover:bg-black rounded-lg text-slate-500 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center opacity-40 uppercase tracking-widest text-[10px] font-black">Nenhum fornecedor encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
