import React from 'react';
import { MenuItem } from '../types';
import { Info, Plus, ArrowUpRight, ArrowDownRight, Target, Zap, Pencil, Trash2, Layers } from 'lucide-react';

interface MenuEngineeringProps {
  items: MenuItem[];
  onAddClick: () => void;
  onEditClick: (item: MenuItem) => void;
  onDeleteClick: (id: string) => void;
}

const MenuEngineering: React.FC<MenuEngineeringProps> = ({ items, onAddClick, onEditClick, onDeleteClick }) => {
  const avgMargin = items.length > 0 
    ? items.reduce((acc, item) => acc + (item.price - item.cost), 0) / items.length 
    : 0;
  
  const avgVolume = items.length > 0 
    ? items.reduce((acc, item) => acc + item.salesVolume, 0) / items.length 
    : 0;

  const getCalculatedStatus = (item: MenuItem) => {
    const margin = item.price - item.cost;
    const volume = item.salesVolume;
    if (margin >= avgMargin && volume >= avgVolume) return 'Estrela';
    if (margin < avgMargin && volume >= avgVolume) return 'Burro de Carga';
    if (margin >= avgMargin && volume < avgVolume) return 'Quebra-cabeça';
    return 'Cão';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Estrela': return <Zap className="text-[#D4AF37]" size={14} />;
      case 'Burro de Carga': return <Plus className="text-white" size={14} />;
      case 'Quebra-cabeça': return <Target className="text-slate-400" size={14} />;
      case 'Cão': return <ArrowDownRight className="text-rose-500" size={14} />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Estrela': return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40';
      case 'Burro de Carga': return 'bg-white/5 text-white border-white/20';
      case 'Quebra-cabeça': return 'bg-slate-800/40 text-slate-400 border-slate-700';
      case 'Cão': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-900 text-slate-500 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tighter">Engenharia de Cardápio</h2>
          <p className="text-slate-500 text-sm italic">Maximizando a lucratividade de cada prato.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-[#D4AF37] hover:bg-[#B8962D] text-black px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 gold-glow"
        >
          <Plus size={18} /> Novo Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/50 text-[#D4AF37]/60 text-[10px] font-black uppercase tracking-widest border-b border-[#2a2a2a]">
                  <th className="px-6 py-5">Item do Cardápio</th>
                  <th className="px-6 py-5">Custo CMV</th>
                  <th className="px-6 py-5">Venda</th>
                  <th className="px-6 py-5">Lucro Bruto</th>
                  <th className="px-6 py-5">Matriz BCG</th>
                  <th className="px-6 py-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {items.map((item) => {
                  const status = getCalculatedStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-black/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{item.unit || 'un'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm font-medium">
                        R$ {item.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-white font-black text-sm">
                        R$ {item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-[#D4AF37] font-black text-sm">
                        R$ {(item.price - item.cost).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border flex items-center justify-center gap-2 w-full max-w-[130px] ${getCategoryColor(status)}`}>
                          {getCategoryIcon(status)}
                          {status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => onEditClick(item)} className="p-2 hover:bg-black rounded-lg text-slate-500 hover:text-[#D4AF37] transition-all"><Layers size={18} /></button>
                          <button onClick={() => onDeleteClick(item.id)} className="p-2 hover:bg-black rounded-lg text-slate-500 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-[2rem] shadow-xl border-t-2 border-t-[#D4AF37]">
            <h3 className="font-black uppercase text-xs tracking-widest text-[#D4AF37] mb-4 flex items-center gap-2">
              <Info size={16} /> Inteligência de CMV
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              O GiroChef analisa a performance relativa de cada item. Atualmente, seu lucro médio é de <span className="text-white font-bold">R$ {avgMargin.toFixed(2)}</span> por prato.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-[2rem] shadow-xl border-t-2 border-t-[#D4AF37]/30">
            <h3 className="font-black uppercase text-xs tracking-widest text-[#D4AF37] mb-4 flex items-center gap-2">
              <Zap size={16} /> Estratégia GiroChef
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Itens <span className="text-[#D4AF37] font-black">ESTRELA</span> devem dominar seus anúncios. Itens <span className="text-white font-black">BURRO DE CARGA</span> precisam de revisão imediata na ficha técnica para reduzir custos ocultos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEngineering;