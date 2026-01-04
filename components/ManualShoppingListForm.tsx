
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ShoppingBag, Plus, Trash2, Package, Truck, Calculator, Search, PackagePlus, FileEdit } from 'lucide-react';
import { Product, Unit, ManualShoppingItem } from '../types';

interface ManualShoppingListFormProps {
  availableProducts: Product[];
  onSave: (items: ManualShoppingItem[], name: string) => void;
  onCancel: () => void;
  onLaunchItem?: (item: ManualShoppingItem) => void;
  initialItems?: ManualShoppingItem[];
  initialName?: string;
}

const ManualShoppingListForm: React.FC<ManualShoppingListFormProps> = ({ 
  availableProducts, 
  onSave, 
  onCancel,
  onLaunchItem,
  initialItems,
  initialName
}) => {
  const [items, setItems] = useState<ManualShoppingItem[]>(initialItems || []);
  const [listName, setListName] = useState(initialName || `Lista de Compras - ${new Date().toLocaleDateString('pt-BR')}`);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
    if (initialName) {
      setListName(initialName);
    }
  }, [initialItems, initialName]);

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !items.some(item => item.name === p.name)
  );

  const addItemFromInventory = (product: Product) => {
    const newItem: ManualShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name,
      quantity: 1,
      unit: product.unit,
      estimatedCost: product.cost,
      supplier: product.supplier
    };
    setItems([...items, newItem]);
    setSearchTerm('');
    setIsSearching(false);
  };

  const addCustomItem = () => {
    if (!searchTerm.trim()) return;
    const newItem: ManualShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: searchTerm,
      quantity: 1,
      unit: 'un',
      estimatedCost: 0,
      supplier: 'Fornecedor não definido'
    };
    setItems([...items, newItem]);
    setSearchTerm('');
    setIsSearching(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ManualShoppingItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalCost = items.reduce((acc, item) => acc + (item.quantity * item.estimatedCost), 0);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-[#1a1a1a] rounded-full text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tighter">
            {initialItems ? 'Editar Lista Manual' : 'Nova Lista Manual'}
          </h2>
          <p className="text-slate-500 text-xs italic uppercase tracking-widest font-bold">Planejamento de Compras Sob Demanda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* List Name Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 mb-2 px-1">
              <FileEdit size={16} className="text-[#D4AF37]" />
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identificação da Lista Diária</label>
            </div>
            <input 
              type="text" 
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Ex: Compras Hortifruti - 04/01/2026"
              className="w-full bg-black border border-[#2a2a2a] rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#D4AF37] transition-all text-[#D4AF37] placeholder:text-slate-700"
            />
          </div>

          {/* Search/Add Section */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2rem] p-6 shadow-xl relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar no estoque ou digitar novo item..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => setIsSearching(true)}
                className="w-full bg-black border border-[#2a2a2a] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
              />
              
              {isSearching && (searchTerm || filteredProducts.length > 0) && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
                  {filteredProducts.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => addItemFromInventory(product)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors border-b border-[#1a1a1a] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Package size={16} className="text-[#D4AF37]" />
                        <span className="text-sm font-bold text-slate-200">{product.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-black text-slate-500">Estoque: {product.quantity} {product.unit}</span>
                    </button>
                  ))}
                  {searchTerm && (
                    <button 
                      onClick={addCustomItem}
                      className="w-full flex items-center gap-3 p-4 hover:bg-[#D4AF37]/10 text-[#D4AF37] transition-colors"
                    >
                      <Plus size={16} />
                      <span className="text-sm font-black uppercase tracking-widest">Adicionar "{searchTerm}" como novo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="bg-black/40 border border-[#2a2a2a] border-dashed rounded-[2.5rem] p-20 text-center space-y-4">
                <ShoppingBag size={48} className="text-[#1a1a1a] mx-auto" />
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic tracking-tight">Sua lista está vazia</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-[2rem] animate-in slide-in-from-right-4 duration-300 group">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1 min-w-0">
                      <input 
                        className="bg-transparent border-none text-white font-black text-lg focus:outline-none w-full"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      />
                      <div className="flex items-center gap-3 mt-1">
                        <Truck size={12} className="text-slate-600" />
                        <input 
                          className="bg-transparent border-none text-[10px] text-slate-500 font-bold uppercase tracking-widest focus:outline-none w-full"
                          value={item.supplier}
                          onChange={(e) => updateItem(item.id, 'supplier', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="flex flex-col gap-1 flex-1 md:flex-none">
                        <label className="text-[9px] font-black text-slate-600 uppercase">Qtd</label>
                        <div className="flex items-center gap-2 bg-black rounded-lg px-3 py-2 border border-[#2a2a2a]">
                          <input 
                            type="number"
                            className="bg-transparent border-none text-white text-sm font-bold w-12 focus:outline-none"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                          />
                          <select 
                            className="bg-transparent border-none text-[10px] text-[#D4AF37] font-black uppercase focus:outline-none"
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value as Unit)}
                          >
                            <option value="un">UN</option>
                            <option value="kg">KG</option>
                            <option value="g">G</option>
                            <option value="l">L</option>
                            <option value="ml">ML</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 flex-1 md:flex-none">
                        <label className="text-[9px] font-black text-slate-600 uppercase text-right">Custo Unit.</label>
                        <div className="flex items-center gap-1 bg-black rounded-lg px-3 py-2 border border-[#2a2a2a]">
                          <span className="text-[#D4AF37] text-[10px] font-black">R$</span>
                          <input 
                            type="number"
                            className="bg-transparent border-none text-white text-sm font-bold w-20 text-right focus:outline-none"
                            value={item.estimatedCost}
                            onChange={(e) => updateItem(item.id, 'estimatedCost', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onLaunchItem && (
                          <button 
                            type="button"
                            onClick={() => onLaunchItem(item)}
                            className="p-3 bg-[#D4AF37]/5 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/20 rounded-xl transition-all flex items-center gap-2 group/launch"
                            title="Lançar no Estoque"
                          >
                            <PackagePlus size={20} className="group-hover/launch:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Lançar</span>
                          </button>
                        )}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-[2.5rem] shadow-xl border-t-2 border-t-[#D4AF37]">
            <h3 className="font-black uppercase text-xs tracking-widest text-[#D4AF37] mb-6 flex items-center gap-2">
              <Calculator size={16} /> Resumo Financeiro
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#2a2a2a]">
                <span className="text-xs text-slate-500">Total de Itens</span>
                <span className="font-black text-white text-lg">{items.length}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-xs text-slate-500">Investimento Estimado</span>
                <span className="font-black text-[#D4AF37] text-xl">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button 
                onClick={() => onSave(items, listName)}
                disabled={items.length === 0}
                className="w-full py-5 bg-[#D4AF37] hover:bg-[#B8962D] text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed gold-glow flex items-center justify-center gap-3"
              >
                <Save size={20} /> Salvar Lista
              </button>
              <button 
                onClick={onCancel}
                className="w-full py-4 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
              >
                Descartar Mudanças
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualShoppingListForm;
