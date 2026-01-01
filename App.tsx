
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CashFlow from './components/CashFlow';
import ProductRegistration from './components/ProductRegistration';
import ProductForm from './components/ProductForm';
import ProductOutputRegistration from './components/ProductOutputRegistration';
import ProductOutputForm from './components/ProductOutputForm';
import MenuEngineering from './components/MenuEngineering';
import Reports from './components/Reports';
import CompanySelector from './components/CompanySelector';
import AIConsultant from './components/AIConsultant';
import TransactionForm from './components/TransactionForm';
import MenuItemForm from './components/MenuItemForm';
import ConfirmationModal from './components/ConfirmationModal';
import NotificationsPopover from './components/NotificationsPopover';
import Settings from './components/Settings';
import { COMPANIES, MOCK_MENU_ITEMS, MOCK_TRANSACTIONS, MOCK_PRODUCTS, MOCK_PRODUCT_OUTPUTS } from './constants';
import { Sparkles, Bell } from 'lucide-react';
import { Transaction, MenuItem, Product, ProductOutput, Notification, Company } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>(COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<Company>(availableCompanies[0]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // States
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>(MOCK_TRANSACTIONS);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>(MOCK_MENU_ITEMS);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const [products, setProducts] = useState<Record<string, Product[]>>(MOCK_PRODUCTS);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productOutputs, setProductOutputs] = useState<Record<string, ProductOutput[]>>(MOCK_PRODUCT_OUTPUTS);
  const [isAddingOutput, setIsAddingOutput] = useState(false);
  const [editingOutput, setEditingOutput] = useState<ProductOutput | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Effect to close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTransactions = transactions[selectedCompany.id] || [];
  const currentMenuItems = menuItems[selectedCompany.id] || [];
  const currentProducts = products[selectedCompany.id] || [];
  const currentOutputs = productOutputs[selectedCompany.id] || [];

  // Generate dynamic notifications based on operation data
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // 1. Low Stock Check
    currentProducts.forEach(p => {
      if (p.quantity <= 10) {
        newNotifications.push({
          id: `low-stock-${p.id}`,
          type: 'warning',
          title: 'Alerta de Estoque Baixo',
          message: `O insumo "${p.name}" está com apenas ${p.quantity} ${p.unit} em estoque. Considere reposição em breve.`,
          timestamp: new Date().toISOString(),
          read: false
        });
      }
    });

    // 2. High Waste Check
    const recentWaste = currentOutputs.filter(o => o.reason === 'Desperdício').reduce((acc, o) => acc + o.estimatedCost, 0);
    if (recentWaste > 100) {
      newNotifications.push({
        id: 'high-waste-alert',
        type: 'error',
        title: 'Desperdício Elevado',
        message: `Detectamos R$ ${recentWaste.toLocaleString('pt-BR')} em quebras recentes. Analise os processos de produção.`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    // 3. Welcome / Info
    newNotifications.push({
      id: 'welcome-msg',
      type: 'info',
      title: 'ChefMetrics Ativo',
      message: `Monitorando ${selectedCompany.name} em tempo real. Novos insights de CMV disponíveis.`,
      timestamp: new Date().toISOString(),
      read: true
    });

    setNotifications(newNotifications);
  }, [selectedCompany.id, products, productOutputs]);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'transaction' | 'menuItem' | 'product' | 'output' | 'company';
    id: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'transaction',
    id: '',
    title: '',
    message: ''
  });

  const contextData = {
    company: selectedCompany,
    stats: {
      revenue: currentTransactions.filter(t => t.type === 'Entrada').reduce((acc, t) => acc + t.amount, 0),
      expenses: currentTransactions.filter(t => t.type === 'Saída').reduce((acc, t) => acc + t.amount, 0),
      stockLoss: currentOutputs.filter(o => o.reason !== 'Venda').reduce((acc, o) => acc + o.estimatedCost, 0)
    },
    menu: currentMenuItems,
    products: currentProducts,
    outputs: currentOutputs
  };

  // Handlers
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...txData, id: Math.random().toString(36).substr(2, 9) };
    if (editingTransaction) {
      setTransactions(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(t => t.id === editingTransaction.id ? { ...txData, id: t.id } : t)
      }));
      setEditingTransaction(null);
    } else {
      setTransactions(prev => ({
        ...prev,
        [selectedCompany.id]: [newTx, ...(prev[selectedCompany.id] || [])]
      }));
      setIsAddingTransaction(false);
    }
  };

  const handleSaveMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    if (editingMenuItem) {
      setMenuItems(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(m => m.id === editingMenuItem.id ? { ...itemData, id: m.id } : m)
      }));
      setEditingMenuItem(null);
    } else {
      const newItem: MenuItem = { ...itemData, id: Math.random().toString(36).substr(2, 9) };
      setMenuItems(prev => ({
        ...prev,
        [selectedCompany.id]: [...(prev[selectedCompany.id] || []), newItem]
      }));
      setIsAddingMenuItem(false);
    }
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: Math.random().toString(36).substr(2, 9) };
    if (editingProduct) {
      setProducts(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(p => p.id === editingProduct.id ? { ...productData, id: p.id } : p)
      }));
      setEditingProduct(null);
    } else {
      setProducts(prev => ({
        ...prev,
        [selectedCompany.id]: [...(prev[selectedCompany.id] || []), newProduct]
      }));
      setIsAddingProduct(false);
    }
  };

  const handleSaveOutput = (outputData: Omit<ProductOutput, 'id'>) => {
    if (editingOutput) {
      setProducts(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(p => {
          if (p.id === editingOutput.productId) {
            return { ...p, quantity: p.quantity + editingOutput.quantity - outputData.quantity };
          }
          if (p.id === outputData.productId && p.id !== editingOutput.productId) {
             return { ...p, quantity: p.quantity - outputData.quantity };
          }
          return p;
        })
      }));

      setProductOutputs(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(o => 
          o.id === editingOutput.id ? { ...outputData, id: o.id } : o
        )
      }));
      setEditingOutput(null);
    } else {
      const newOutput: ProductOutput = { ...outputData, id: Math.random().toString(36).substr(2, 9) };
      
      setProductOutputs(prev => ({
        ...prev,
        [selectedCompany.id]: [newOutput, ...(prev[selectedCompany.id] || [])]
      }));

      setProducts(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(p => 
          p.id === outputData.productId ? { ...p, quantity: Math.max(0, p.quantity - outputData.quantity) } : p
        )
      }));

      setIsAddingOutput(false);
    }
  };

  const handleUpdateCompany = (updatedData: Partial<Company>) => {
    setAvailableCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, ...updatedData } : c));
    setSelectedCompany(prev => ({ ...prev, ...updatedData }));
  };

  const initiateDelete = (type: any, id: string, title: string, message: string) => {
    setConfirmModal({ isOpen: true, type, id, title, message });
  };

  const handleConfirmDelete = () => {
    const { type, id } = confirmModal;
    if (type === 'transaction') {
      setTransactions(prev => ({ ...prev, [selectedCompany.id]: prev[selectedCompany.id].filter(t => t.id !== id) }));
    } else if (type === 'menuItem') {
      setMenuItems(prev => ({ ...prev, [selectedCompany.id]: prev[selectedCompany.id].filter(m => m.id !== id) }));
    } else if (type === 'product') {
      setProducts(prev => ({ ...prev, [selectedCompany.id]: prev[selectedCompany.id].filter(p => p.id !== id) }));
    } else if (type === 'output') {
      const outputToRemove = currentOutputs.find(o => o.id === id);
      if (outputToRemove) {
        setProducts(prev => ({
          ...prev,
          [selectedCompany.id]: (prev[selectedCompany.id] || []).map(p => 
            p.id === outputToRemove.productId ? { ...p, quantity: p.quantity + outputToRemove.quantity } : p
          )
        }));
      }
      setProductOutputs(prev => ({ ...prev, [selectedCompany.id]: prev[selectedCompany.id].filter(o => o.id !== id) }));
    } else if (type === 'company') {
      const remaining = availableCompanies.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setAvailableCompanies(remaining);
        setSelectedCompany(remaining[0]);
        setActiveTab('dashboard');
      } else {
        alert("Você deve manter pelo menos uma empresa cadastrada.");
      }
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    if (activeTab === 'cashflow' && (isAddingTransaction || editingTransaction)) {
      return <TransactionForm initialData={editingTransaction || undefined} onSave={handleSaveTransaction} onCancel={() => { setIsAddingTransaction(false); setEditingTransaction(null); }} />;
    }
    if (activeTab === 'menu' && (isAddingMenuItem || editingMenuItem)) {
      return <MenuItemForm initialData={editingMenuItem || undefined} onSave={handleSaveMenuItem} onCancel={() => { setIsAddingMenuItem(false); setEditingMenuItem(null); }} />;
    }
    if (activeTab === 'products' && (isAddingProduct || editingProduct)) {
      return <ProductForm initialData={editingProduct || undefined} onSave={handleSaveProduct} onCancel={() => { setIsAddingProduct(false); setEditingProduct(null); }} />;
    }
    if (activeTab === 'outputs' && (isAddingOutput || editingOutput)) {
      return <ProductOutputForm availableProducts={currentProducts} initialData={editingOutput || undefined} onSave={handleSaveOutput} onCancel={() => { setIsAddingOutput(false); setEditingOutput(null); }} />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard company={selectedCompany} transactions={currentTransactions} menuItems={currentMenuItems} productOutputs={currentOutputs} />;
      case 'cashflow': return <CashFlow transactions={currentTransactions} onAddClick={() => setIsAddingTransaction(true)} onEditClick={setEditingTransaction} onDeleteClick={(id) => initiateDelete('transaction', id, 'Excluir Lançamento?', 'Esta ação é irreversível.')} onExport={() => {}} />;
      case 'products': return <ProductRegistration products={currentProducts} onAddClick={() => setIsAddingProduct(true)} onEditClick={setEditingProduct} onDeleteClick={(id) => initiateDelete('product', id, 'Excluir Produto?', 'Isso removerá o insumo do seu cadastro.')} />;
      case 'outputs': return <ProductOutputRegistration outputs={currentOutputs} onAddClick={() => setIsAddingOutput(true)} onEditClick={setEditingOutput} onDeleteClick={(id) => initiateDelete('output', id, 'Excluir Baixa?', 'Ao excluir, a quantidade será devolvida ao estoque.')} />;
      case 'menu': return <MenuEngineering items={currentMenuItems} onAddClick={() => setIsAddingMenuItem(true)} onEditClick={(item) => setEditingMenuItem(item)} onDeleteClick={(id) => initiateDelete('menuItem', id, 'Excluir Item do Cardápio?', 'Isso removerá a ficha técnica permanentemente.')} />;
      case 'reports': return <Reports company={selectedCompany} transactions={currentTransactions} menuItems={currentMenuItems} />;
      case 'settings': return <Settings company={selectedCompany} onUpdateCompany={handleUpdateCompany} onDeleteCompany={(id) => initiateDelete('company', id, 'Excluir Empresa?', 'Isso apagará permanentemente todos os dados desta empresa. Tem certeza?')} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={(t) => { 
        setActiveTab(t); 
        setIsAddingTransaction(false); setEditingTransaction(null); 
        setIsAddingProduct(false); setEditingProduct(null); 
        setIsAddingOutput(false); setEditingOutput(null);
        setIsAddingMenuItem(false); setEditingMenuItem(null);
      }} />
      <main className="flex-1 ml-64 min-h-screen flex flex-col transition-all duration-300">
        <header className="sticky top-0 h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-30 px-8 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
            <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>
            <p className="text-slate-500 text-sm hidden sm:block">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAIModalOpen(true)} className="bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-lg group">
              <Sparkles size={16} className="group-hover:animate-pulse" /> Chef AI Insight
            </button>
            
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white relative hover:border-slate-600 transition-colors ${unreadCount > 0 ? 'ring-2 ring-indigo-500/20' : ''}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-900 text-[8px] flex items-center justify-center font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <NotificationsPopover 
                  notifications={notifications} 
                  onClose={() => setIsNotificationsOpen(false)}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                />
              )}
            </div>

            <CompanySelector companies={availableCompanies} selected={selectedCompany} onSelect={setSelectedCompany} />
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full flex-1">{renderContent()}</div>
        <footer className="p-8 border-t border-slate-900 text-slate-600 text-xs text-center no-print">© 2024 ChefMetrics SaaS - Inteligência Financeira para Delivery.</footer>
      </main>
      <AIConsultant isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} contextData={contextData} />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} confirmLabel="Excluir" onConfirm={handleConfirmDelete} onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default App;
