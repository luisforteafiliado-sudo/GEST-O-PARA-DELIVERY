
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calculator, Tag, Calendar, Weight } from 'lucide-react';
import { Product, ProductOutput, OutputReason } from '../types';

interface ProductOutputFormProps {
  availableProducts: Product[];
  initialData?: ProductOutput;
  onSave: (output: Omit<ProductOutput, 'id'>) => void;
  onCancel: () => void;
}

const ProductOutputForm: React.FC<ProductOutputFormProps> = ({ availableProducts, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: 'Desperdício' as OutputReason,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        productId: initialData.productId,
        quantity: initialData.quantity.toString(),
        reason: initialData.reason,
        date: initialData.date
      });
    }
  }, [initialData]);

  const selectedProduct = availableProducts.find(p => p.id === formData.productId);
  const qty = parseFloat(formData.quantity) || 0;
  const estimatedLoss = selectedProduct ? qty * selectedProduct.cost : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !qty || !selectedProduct) return;

    onSave({
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: qty,
      unit: selectedProduct.unit,
      reason: formData.reason,
      date: formData.date,
      estimatedCost: estimatedLoss
    });
  };

  const reasons: OutputReason[] = ['Venda', 'Desperdício', 'Uso Interno', 'Vencimento', 'Outros'];

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">
          {initialData ? 'Editar Baixa de Estoque' : 'Registrar Baixa de Estoque'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Tag size={14} /> Selecione o Insumo
            </label>
            <select
              required
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors text-slate-200"
            >
              <option value="">Selecione um produto cadastrado...</option>
              {availableProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity} {p.unit} em estoque)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Weight size={14} /> Quantidade da Baixa
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder="0.000"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors text-slate-200"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 uppercase">
                  {selectedProduct?.unit || '-'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Data da Movimentação
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Motivo da Saída</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {reasons.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, reason: r })}
                  className={`py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    formData.reason === r 
                    ? 'bg-amber-600/10 border-amber-500 text-amber-500' 
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <Calculator size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impacto no CMV (Custo)</p>
                <p className="text-[9px] text-slate-600 font-medium italic">Estimado com base no custo de entrada</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${formData.reason === 'Venda' ? 'text-indigo-400' : 'text-rose-500'}`}>
                R$ {estimatedLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-4 rounded-xl font-bold transition-all border border-slate-700">
            Cancelar
          </button>
          <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2">
            <Save size={18} />
            {initialData ? 'Atualizar Baixa' : 'Confirmar Baixa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductOutputForm;
