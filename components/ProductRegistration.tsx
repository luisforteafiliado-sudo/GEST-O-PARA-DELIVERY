
import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Plus, Pencil, Trash2, Package, Truck, Hash, Tag, Calendar, Weight, Calculator } from 'lucide-react';

interface ProductRegistrationProps {
  products: Product[];
  onAddClick: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (id: string) => void;
}

const ProductRegistration: React.FC<ProductRegistrationProps> = ({ products, onAddClick, onEditClick, onDeleteClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nfNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Cadastro de Produtos</h2>
          <p className="text-slate-400 text-sm">Gerencie seus insumos, fornecedores e notas fiscais.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/30 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por produto, fornecedor ou NF..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Nº Nota Fiscal</th>
                <th className="px-6 py-4">Qtd. Total</th>
                <th className="px-6 py-4 text-right">Custo Unit.</th>
                <th className="px-6 py-4 text-right">Valor Total</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                          <Package size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-200">{product.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Truck size={14} className="text-slate-600" />
                        <span className="text-sm">{product.supplier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Hash size={14} className="text-slate-600" />
                        <span className="text-sm font-mono">{product.nfNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Weight size={14} className="text-indigo-400/50" />
                        <span className="text-sm font-medium">{product.quantity} <span className="text-[10px] uppercase">{product.unit}</span></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-400">
                        R$ {product.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-emerald-400">
                        R$ {(product.quantity * product.cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEditClick(product)}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteClick(product.id)}
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
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <Package size={48} className="opacity-10 mb-2" />
                      <p className="font-medium">Nenhum produto cadastrado</p>
                      <p className="text-xs">Inicie o cadastro dos seus insumos clicando em "Novo Produto".</p>
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

export default ProductRegistration;
