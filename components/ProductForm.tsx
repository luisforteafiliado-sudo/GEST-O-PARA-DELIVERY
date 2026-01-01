
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, Truck, Hash, Tag, DollarSign, Calendar, Weight, Calculator } from 'lucide-react';
import { Product, Unit } from '../types';

interface ProductFormProps {
  initialData?: Product;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    nfNumber: '',
    category: '',
    unit: 'kg' as Unit,
    quantity: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        supplier: initialData.supplier,
        nfNumber: initialData.nfNumber,
        category: initialData.category,
        unit: initialData.unit,
        quantity: initialData.quantity.toString(),
        cost: initialData.cost.toString(),
        date: initialData.date
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.supplier || !formData.cost || !formData.quantity) return;

    onSave({
      name: formData.name,
      supplier: formData.supplier,
      nfNumber: formData.nfNumber,
      category: formData.category,
      unit: formData.unit,
      quantity: parseFloat(formData.quantity),
      cost: parseFloat(formData.cost),
      date: formData.date
    });
  };

  const units: Unit[] = ['un', 'kg', 'g', 'l', 'ml'];
  
  const quantityNum = parseFloat(formData.quantity) || 0;
  const costNum = parseFloat(formData.cost) || 0;
  const totalValue = quantityNum * costNum;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">
          {initialData ? 'Editar Produto' : 'Cadastrar Novo Produto'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Package size={14} /> Nome do Produto / Insumo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Filé de Frango, Óleo de Soja..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Truck size={14} /> Nome do Fornecedor
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Atacadão S.A."
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Hash size={14} /> Número da NF
              </label>
              <input
                type="text"
                placeholder="Ex: NF-12345"
                value={formData.nfNumber}
                onChange={(e) => setFormData({ ...formData, nfNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Categoria / Objetivo
              </label>
              <input
                type="text"
                placeholder="Ex: Insumos, Embalagens..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Data da Compra
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unidade</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-200"
              >
                {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Weight size={14} /> Qtd na Nota
              </label>
              <input
                type="number"
                step="0.001"
                required
                placeholder="0.000"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14} /> Custo Unit. (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>
          </div>

          {/* Valor Total do Produto (Calculado) */}
          <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Calculator size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valor Total do Produto</p>
                <p className="text-[9px] text-slate-600 font-medium">({formData.quantity || '0'} {formData.unit} × R$ {formData.cost || '0,00'})</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-4 rounded-xl font-bold transition-all border border-slate-700">
            Cancelar
          </button>
          <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
            <Save size={18} />
            {initialData ? 'Atualizar Produto' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
