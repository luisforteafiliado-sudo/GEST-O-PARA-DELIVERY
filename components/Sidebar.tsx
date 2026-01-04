
import React from 'react';
import { LayoutDashboard, ReceiptText, UtensilsCrossed, BarChart3, Settings, HelpCircle, PackageSearch, PackageMinus, ShoppingBag, Truck, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSupportClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onSupportClick, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cashflow', label: 'Fluxo de Caixa', icon: ReceiptText },
    { id: 'products', label: 'Entrada de Produtos', icon: PackageSearch },
    { id: 'outputs', label: 'Saída de Produtos', icon: PackageMinus },
    { id: 'shopping-list', label: 'Lista de Compras', icon: ShoppingBag },
    { id: 'suppliers', label: 'Cadastro de Fornecedores', icon: Truck },
    { id: 'menu', label: 'Engenharia de Cardápio', icon: UtensilsCrossed },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#0b0b0b] border-r border-[#1a1a1a] p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex flex-col">
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
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 custom-scrollbar overflow-y-auto pr-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                  : 'text-slate-400 hover:bg-[#1a1a1a] hover:text-slate-200'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className={`font-semibold text-xs ${activeTab === item.id ? 'tracking-wide' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#1a1a1a] space-y-2">
          <button 
            onClick={() => handleTabClick('settings')}
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
    </>
  );
};

export default Sidebar;
