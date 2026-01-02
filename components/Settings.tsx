import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Building2, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Company } from '../types';

interface SettingsProps {
  company: Company;
  onUpdateCompany: (data: Partial<Company>) => void;
  onDeleteCompany: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ company, onUpdateCompany, onDeleteCompany }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: company.name,
    category: company.category,
    description: company.description || ''
  });

  useEffect(() => {
    setFormData({
      name: company.name,
      category: company.category,
      description: company.description || ''
    });
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCompany({ logo: reader.result as string });
        showSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateCompany(formData);
    showSuccess();
  };

  const showSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    onUpdateCompany({ logo: 'https://picsum.photos/seed/placeholder/200' });
    showSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-[#D4AF37] uppercase tracking-tighter">Gestão de Identidade</h2>
        <p className="text-slate-500 text-sm italic">Configure os pilares da sua presença no ecossistema GiroChef.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl"></div>
            
            <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
              <ImageIcon size={16} /> Marca Visual
            </h3>

            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="w-36 h-36 rounded-[2rem] overflow-hidden border-2 border-[#2a2a2a] bg-black shadow-inner group-hover:border-[#D4AF37]/50 transition-all duration-500">
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div onClick={triggerUpload} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload size={24} className="text-[#D4AF37]" />
                  </div>
                </div>
                <button onClick={removeLogo} className="absolute -top-2 -right-2 p-2.5 bg-rose-600 text-white rounded-xl shadow-xl hover:bg-rose-700 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>

              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

              <button onClick={triggerUpload} className="w-full py-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3">
                <Upload size={16} /> Alterar Logotipo
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-xl space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] flex items-center gap-2">
                <Building2 size={16} /> Informações Estratégicas
              </h3>
              {isSuccess && (
                <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-right-4 duration-300">
                  <CheckCircle2 size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Sincronizado</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Razão/Fantasia</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Segmento Principal</label>
                <input name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Manifesto do Negócio</label>
              <textarea rows={3} name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all resize-none"></textarea>
            </div>

            <div className="pt-6 border-t border-[#2a2a2a] flex justify-end">
              <button onClick={handleSave} className="px-10 py-4 bg-[#D4AF37] hover:bg-[#B8962D] text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 gold-glow">
                Confirmar Ajustes
              </button>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest">Zona de Risco</h3>
                  <p className="text-[11px] text-slate-500 italic">Excluir permanentemente todos os dados desta unidade.</p>
                </div>
              </div>
              <button onClick={() => onDeleteCompany(company.id)} className="px-6 py-3.5 bg-rose-600/10 border border-rose-600/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shrink-0">
                Encerrar Unidade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;