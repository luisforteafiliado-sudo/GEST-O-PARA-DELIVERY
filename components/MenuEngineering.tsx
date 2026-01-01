
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
  // Cálculo das médias para determinar os quadrantes da Matriz BCG
  const avgMargin = items.length > 0 
    ? items.reduce((acc, item) => acc + (item.price - item.cost), 0) / items.length 
    : 0;
  
  const avgVolume = items.length > 0 
    ? items.reduce((acc, item) => acc + item.salesVolume, 0) / items.length 
    : 0;

  // Função para calcular o status automaticamente
  const getCalculatedStatus = (item: MenuItem) => {
    const margin = item.price - item.cost;
    const volume = item.salesVolume;

    // Estrela: Alta Rentabilidade + Alta Popularidade
    if (margin >= avgMargin && volume >= avgVolume) return 'Estrela';
    // Burro de Carga: Baixa Rentabilidade + Alta Popularidade
    if (margin < avgMargin && volume >= avgVolume) return 'Burro de Carga';
    // Quebra-cabeça: Alta Rentabilidade + Baixa Popularidade
    if (margin >= avgMargin && volume < avgVolume) return 'Quebra-cabeça';
    // Cão: Baixa Rentabilidade + Baixa Popularidade
    return 'Cão';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Estrela': return <Zap className="text-amber-400" size={14} />;
      case 'Burro de Carga': return <Plus className="text-emerald-400" size={14} />;
      case 'Quebra-cabeça': return <Target className="text-indigo-400" size={14} />;
      case 'Cão': return <ArrowDownRight className="text-rose-400" size={14} />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Estrela': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'Burro de Carga': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'Quebra-cabeça': return 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20';
      case 'Cão': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Engenharia de Cardápio</h2>
          <p className="text-slate-400 text-sm">Fichas técnicas e análise BCG de rentabilidade.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={18} /> Novo Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                  <th className="px-6 py-5">Prato / Unidade</th>
                  <th className="px-6 py-5">Custo</th>
                  <th className="px-6 py-5">Venda</th>
                  <th className="px-6 py-5">Margem R$</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item) => {
                  const status = getCalculatedStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-100">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{item.unit || 'un'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-600">R$</span>
                          <span>{item.cost.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-100 font-bold text-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-600">R$</span>
                          <span>{item.price.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-bold text-sm">
                        R$ {(item.price - item.cost).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border flex items-center justify-center gap-1.5 w-[140px] text-center ${getCategoryColor(status)} shadow-sm`}>
                          {getCategoryIcon(status)}
                          {status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onEditClick(item)}
                            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Ficha Técnica"
                          >
                            <Layers size={18} />
                          </button>
                          <button 
                            onClick={() => onDeleteClick(item.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                            title="Excluir Item"
                          >
                            <Trash2 size={18} />
                          </button>
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
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl border-t-4 border-t-indigo-500">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Info size={18} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Análise de CMV</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              O status do produto é calculado automaticamente comparando a performance deste item com a média do seu cardápio atual (Média de Margem: R$ {avgMargin.toFixed(2)}).
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl border-t-4 border-t-amber-500">
            <div className="flex items-center gap-2 mb-4 text-amber-400">
              <Zap size={18} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Ação Sugerida</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Itens <strong>Estrela</strong> devem ser promovidos. Itens <strong>Burro de Carga</strong> precisam de redução de custo (Ficha Técnica) ou reajuste de preço.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEngineering;
