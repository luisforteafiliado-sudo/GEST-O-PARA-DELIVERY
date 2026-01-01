
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Utensils, DollarSign, BarChart3, Tag, Plus, Trash2, Scale } from 'lucide-react';
import { MenuItem, Ingredient, Unit } from '../types';

interface MenuItemFormProps {
  initialData?: MenuItem;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: 'un' as Unit,
    cost: 0,
    price: '',
    salesVolume: '',
    category: 'Estrela' as MenuItem['category'],
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        unit: initialData.unit,
        cost: initialData.cost,
        price: initialData.price.toString(),
        salesVolume: initialData.salesVolume.toString(),
        category: initialData.category,
      });
      setIngredients(initialData.ingredients || []);
    }
  }, [initialData]);

  // Calcula o custo total baseado nos insumos sempre que eles mudarem
  useEffect(() => {
    if (ingredients.length > 0) {
      const totalCost = ingredients.reduce((acc, ing) => acc + (ing.cost || 0), 0);
      setFormData(prev => ({ ...prev, cost: totalCost }));
    }
  }, [ingredients]);

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      quantity: 0,
      unit: 'un',
      cost: 0
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    onSave({
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      price: parseFloat(formData.price),
      salesVolume: parseInt(formData.salesVolume) || 0,
      category: formData.category,
      ingredients: ingredients
    });
  };

  const units: Unit[] = ['un', 'kg', 'g', 'l', 'ml'];
  const categories: MenuItem['category'][] = ['Estrela', 'Burro de Carga', 'Quebra-cabeça', 'Cão'];

  const marginValue = parseFloat(formData.price) - formData.cost;
  const marginPercent = parseFloat(formData.price) > 0 ? (marginValue / parseFloat(formData.price)) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">
          {initialData ? 'Editar Ficha Técnica' : 'Nova Ficha Técnica'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Informações Básicas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Utensils size={14} /> Dados do Prato
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome do Item</label>
              <input
                type="text"
                required
                placeholder="Ex: Classic Smash Burger"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vendas/Mês (Est.)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.salesVolume}
                  onChange={(e) => setFormData({ ...formData, salesVolume: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status BCG</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem['category'] })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-200"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <BarChart3 size={14} /> Resumo Financeiro
            </h3>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-xs text-slate-500">Custo Total (CMV)</span>
              <span className="font-bold text-slate-200 text-sm">R$ {formData.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-xs text-slate-500">Margem Nominal</span>
              <span className={`font-bold text-sm ${marginValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {marginValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-slate-500">Margem Percentual</span>
              <span className={`font-bold text-sm ${marginPercent >= 20 ? 'text-emerald-400' : marginPercent > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {marginPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Ficha Técnica (Insumos) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Scale size={16} /> Ficha Técnica (Insumos)
              </h3>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-[10px] font-bold uppercase bg-indigo-600/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Adicionar Insumo
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {ingredients.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-40 py-20">
                  <Utensils size={48} className="mb-4" />
                  <p className="text-sm font-medium">Nenhum insumo adicionado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ingredients.map((ing) => (
                    <div key={ing.id} className="grid grid-cols-12 gap-3 items-end bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 animate-in slide-in-from-right-2 duration-200">
                      <div className="col-span-5 space-y-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Nome do Insumo</label>
                        <input
                          type="text"
                          placeholder="Ex: Carne moída"
                          value={ing.name}
                          onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 px-1 py-1 text-sm focus:outline-none text-slate-300 transition-colors"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Qtd</label>
                        <input
                          type="number"
                          step="0.001"
                          placeholder="0.0"
                          value={ing.quantity || ''}
                          onChange={(e) => handleUpdateIngredient(ing.id, 'quantity', parseFloat(e.target.value))}
                          className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 px-1 py-1 text-sm focus:outline-none text-slate-300 transition-colors text-center"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Unid</label>
                        <select
                          value={ing.unit}
                          onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value as Unit)}
                          className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 px-1 py-1 text-sm focus:outline-none text-slate-300 transition-colors"
                        >
                          {units.map(u => <option key={u} value={u} className="bg-slate-900">{u.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Custo (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={ing.cost || ''}
                          onChange={(e) => handleUpdateIngredient(ing.id, 'cost', parseFloat(e.target.value))}
                          className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 px-1 py-1 text-sm focus:outline-none text-slate-300 transition-colors text-right"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center pb-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ing.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4 no-print">
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
                {initialData ? 'Atualizar Ficha' : 'Salvar Ficha'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
