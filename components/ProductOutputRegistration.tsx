
import React, { useState } from 'react';
import { ProductOutput } from '../types';
import { Search, Plus, Trash2, PackageMinus, Pencil } from 'lucide-react';

interface ProductOutputRegistrationProps {
  outputs: ProductOutput[];
  onAddClick: () => void;
  onEditClick: (output: ProductOutput) => void;
  onDeleteClick: (id: string) => void;
}

const ProductOutputRegistration: React.FC<ProductOutputRegistrationProps> = ({ outputs, onAddClick, onEditClick, onDeleteClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOutputs = outputs.filter(o => 
    o.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Saída de Produtos</h2>
          <p className="text-slate-400 text-sm">Registre baixas de estoque, desperdícios e perdas operacionais.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20 active:scale-95"
        >
          <Plus size={18} /> Registrar Baixa
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/30 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por insumo ou motivo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors text-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Insumo</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4 text-right">Custo Estimado</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOutputs.length > 0 ? (
                filteredOutputs.map((output) => (
                  <tr key={output.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(output.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                          <PackageMinus size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-200">{output.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                        output.reason === 'Desperdício' ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' :
                        output.reason === 'Venda' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                        'border-slate-500/30 text-slate-400 bg-slate-500/5'
                      }`}>
                        {output.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-medium">
                        {output.quantity} <span className="text-[10px] uppercase text-slate-500">{output.unit}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold ${output.reason === 'Desperdício' || output.reason === 'Vencimento' ? 'text-rose-400' : 'text-slate-300'}`}>
                        R$ {output.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEditClick(output)}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteClick(output.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <PackageMinus size={48} className="opacity-10 mb-2" />
                      <p className="font-medium">Nenhuma saída registrada</p>
                      <p className="text-xs">Registre as baixas de estoque para um CMV real.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductOutputRegistration;
