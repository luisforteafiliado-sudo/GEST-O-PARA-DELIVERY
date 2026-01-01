
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
  
  // Local state for profile inputs
  const [formData, setFormData] = useState({
    name: company.name,
    category: company.category,
    description: company.description || ''
  });

  // Update local state if company changes (e.g. from company selector)
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
        <h2 className="text-3xl font-bold">Configurações do Negócio</h2>
        <p className="text-slate-400">Gerencie a identidade visual e informações básicas da sua empresa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Identidade Visual */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl"></div>
            
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
              <ImageIcon size={16} className="text-indigo-400" /> Identidade Visual
            </h3>

            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-inner group-hover:border-indigo-500/50 transition-all duration-300">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                  />
                  <div 
                    onClick={triggerUpload}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                  >
                    <Upload size={24} className="text-white" />
                  </div>
                </div>
                <button 
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 p-2 bg-rose-600 text-white rounded-xl shadow-lg hover:bg-rose-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover Logo"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-slate-200">Logo da Empresa</p>
                <p className="text-xs text-slate-500 leading-relaxed px-4">Recomendado: Imagem quadrada, PNG ou JPG (máx. 2MB)</p>
              </div>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden" 
              />

              <button 
                onClick={triggerUpload}
                className="w-full py-4 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Upload size={16} /> Alterar Imagem
              </button>
            </div>
          </div>
        </div>

        {/* Lado Direito: Informações da Empresa */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={16} className="text-indigo-400" /> Perfil da Empresa
              </h3>
              {isSuccess && (
                <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-right-4 duration-300">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Salvo com sucesso!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Fantasia</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Segmento / Categoria</label>
                <input 
                  type="text" 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Descrição Curta</label>
              <textarea 
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Uma breve descrição da sua operação..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={handleSave}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold flex items-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Save size={18} /> Salvar Alterações
              </button>
            </div>
          </div>

          {/* Danger Zone: Deletar Empresa */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest">Zona Crítica</h3>
                <p className="text-xs text-slate-500">Ações irreversíveis para o seu negócio.</p>
              </div>
            </div>

            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-200">Excluir esta empresa</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  Ao excluir, todos os lançamentos financeiros, estoque e fichas técnicas serão permanentemente apagados.
                </p>
              </div>
              <button 
                onClick={() => onDeleteCompany(company.id)}
                className="px-6 py-3 bg-rose-600/10 border border-rose-600/20 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-rose-600/5"
              >
                <Trash2 size={16} /> Excluir permanentemente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
