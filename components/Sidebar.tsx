
import React from 'react';
import { LayoutDashboard, ReceiptText, UtensilsCrossed, BarChart3, Settings, HelpCircle, PackageSearch, PackageMinus } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cashflow', label: 'Fluxo de Caixa', icon: ReceiptText },
    { id: 'products', label: 'Entrada de Produtos', icon: PackageSearch },
    { id: 'outputs', label: 'Saída de Produtos', icon: PackageMinus },
    { id: 'menu', label: 'Engenharia de Cardápio', icon: UtensilsCrossed },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col z-40">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
          C
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          ChefMetrics
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800 space-y-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Settings size={18} />
          <span>Configurações</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-slate-200">
          <HelpCircle size={18} />
          <span>Suporte</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
