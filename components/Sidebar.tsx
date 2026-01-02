import React from 'react';
import { LayoutDashboard, ReceiptText, UtensilsCrossed, BarChart3, Settings, HelpCircle, PackageSearch, PackageMinus } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSupportClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onSupportClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cashflow', label: 'Fluxo de Caixa', icon: ReceiptText },
    { id: 'products', label: 'Entrada de Produtos', icon: PackageSearch },
    { id: 'outputs', label: 'Saída de Produtos', icon: PackageMinus },
    { id: 'menu', label: 'Engenharia de Cardápio', icon: UtensilsCrossed },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0b0b0b] border-r border-[#1a1a1a] p-6 flex flex-col z-40">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-xl text-black shadow-lg shadow-[#D4AF37]/20">
            G
          </div>
          <h1 className="text-xl font-black text-[#D4AF37] uppercase tracking-tighter">
            GIROCHEF
          </h1>
        </div>
        <p className="text-[9px] text-slate-500 font-medium leading-tight uppercase tracking-widest pl-1 border-l border-[#D4AF37]/30">
          Você cuida da cozinha,<br/>nós cuidamos do caixa.
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                : 'text-slate-400 hover:bg-[#1a1a1a] hover:text-slate-200'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className={`font-semibold text-sm ${activeTab === item.id ? 'tracking-wide' : ''}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-[#1a1a1a] space-y-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
              : 'text-slate-400 hover:bg-[#1a1a1a] hover:text-slate-200'
          }`}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Configurações</span>
        </button>
        <button 
          onClick={onSupportClick}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-[#D4AF37] hover:bg-[#1a1a1a] rounded-xl transition-all"
        >
          <HelpCircle size={18} />
          <span className="text-sm font-medium">Suporte</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;