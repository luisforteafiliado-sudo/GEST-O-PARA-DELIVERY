
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, DollarSign, Calendar, Tag, Smartphone, FileText } from 'lucide-react';
import { Platform, Transaction } from '../types';

interface TransactionFormProps {
  initialData?: Transaction;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'Saída' as 'Entrada' | 'Saída',
    category: '',
    platform: undefined as Platform | undefined,
    amount: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        description: initialData.description,
        type: initialData.type,
        category: initialData.category,
        platform: initialData.platform,
        amount: initialData.amount.toString(),
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) return;

    onSave({
      date: formData.date,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      platform: formData.platform,
      amount: parseFloat(formData.amount),
    });
  };

  const categories = formData.type === 'Entrada' 
    ? ['Vendas', 'Investimento', 'Empréstimo', 'Outros']
    : ['Insumos', 'Aluguel', 'Marketing', 'Salários', 'Manutenção', 'Impostos', 'Outros'];

  const platforms: Platform[] = ['iFood', 'brendi'];

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">
            {initialData ? 'Editar Movimento' : 'Lançar Movimento'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'Entrada' })}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                formData.type === 'Entrada' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              ENTRADA
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'Saída' })}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                formData.type === 'Saída' 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              SAÍDA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Data
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14} /> Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Descrição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Compra de embalagens, Repasse iFood..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Categoria
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Smartphone size={14} /> Plataforma (Opcional)
              </label>
              <select
                value={formData.platform || ''}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform || undefined })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="">Nenhuma</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-4 rounded-xl font-bold transition-all border border-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {initialData ? 'Atualizar Movimento' : 'Salvar Lançamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
