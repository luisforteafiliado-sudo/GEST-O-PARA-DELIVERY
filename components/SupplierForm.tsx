
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Truck, Phone, Mail, Tag, Star } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierFormProps {
  initialData?: Supplier;
  onSave: (supplier: Omit<Supplier, 'id'>) => void;
  onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    email: '',
    rating: 5,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        contact: initialData.contact,
        email: initialData.email || '',
        rating: initialData.rating || 5,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.category) return;

    onSave({
      name: formData.name,
      category: formData.category,
      contact: formData.contact,
      email: formData.email,
      rating: formData.rating,
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-[#1a1a1a] rounded-full text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tighter">
            {initialData ? 'Editar Parceiro' : 'Novo Fornecedor'}
          </h2>
          <p className="text-slate-500 text-xs italic uppercase tracking-widest font-bold">Gestão de Suprimentos Estratégicos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-xl space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Truck size={14} /> Nome da Empresa / Fornecedor
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Friboi Alimentos, AMBEV..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Tag size={14} /> Categoria de Insumo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Proteínas, Bebidas, Limpeza..."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Phone size={14} /> Contato Principal
                </label>
                <input
                  type="text"
                  required
                  placeholder="(00) 00000-0000"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Mail size={14} /> E-mail Corporativo (Opcional)
              </label>
              <input
                type="email"
                placeholder="contato@fornecedor.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Star size={14} /> Nível de Confiança / Avaliação
              </label>
              <div className="flex gap-4 p-4 bg-black rounded-2xl border border-[#2a2a2a] justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform active:scale-90"
                  >
                    <Star 
                      size={28} 
                      className={star <= formData.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#2a2a2a]"} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-[#1a1a1a] border border-[#2a2a2a] transition-all"
          >
            Descartar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] bg-[#D4AF37] hover:bg-[#B8962D] text-black shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-95 flex items-center justify-center gap-3 gold-glow"
          >
            <Save size={20} />
            {initialData ? 'Atualizar Parceiro' : 'Confirmar Cadastro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
