
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
import SupportModal from './components/Support';
import AddCompanyModal from './components/AddCompanyModal';
import ShoppingList from './components/ShoppingList';
import ManualShoppingListForm from './components/ManualShoppingListForm';
import Suppliers from './components/Suppliers';
import SupplierForm from './components/SupplierForm';
import { COMPANIES, MOCK_MENU_ITEMS, MOCK_TRANSACTIONS, MOCK_PRODUCTS, MOCK_PRODUCT_OUTPUTS, MOCK_SUPPLIERS } from './constants';
import { Sparkles, Bell } from 'lucide-react';
import { Transaction, MenuItem, Product, ProductOutput, Notification, Company, Supplier, ManualShoppingList, ManualShoppingItem } from './types';

// Utility to load data from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(`girochef_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
};

// Utility to save data to localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(`girochef_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistent States
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>(() => 
    loadFromStorage('availableCompanies', COMPANIES)
  );
  
  const [selectedCompany, setSelectedCompany] = useState<Company>(() => {
    const saved = loadFromStorage<Company | null>('selectedCompany', null);
    return (saved && availableCompanies.some(c => c.id === saved.id)) 
      ? saved 
      : availableCompanies[0];
  });

  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>(() => 
    loadFromStorage('transactions', MOCK_TRANSACTIONS)
  );

  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>(() => 
    loadFromStorage('menuItems', MOCK_MENU_ITEMS)
  );

  const [products, setProducts] = useState<Record<string, Product[]>>(() => 
    loadFromStorage('products', MOCK_PRODUCTS)
  );

  const [productOutputs, setProductOutputs] = useState<Record<string, ProductOutput[]>>(() => 
    loadFromStorage('productOutputs', MOCK_PRODUCT_OUTPUTS)
  );

  const [suppliers, setSuppliers] = useState<Record<string, Supplier[]>>(() => 
    loadFromStorage('suppliers', MOCK_SUPPLIERS)
  );

  const [manualShoppingLists, setManualShoppingLists] = useState<Record<string, ManualShoppingList[]>>(() => 
    loadFromStorage('manualShoppingLists', {})
  );

  // Persistence Sync Effects
  useEffect(() => saveToStorage('availableCompanies', availableCompanies), [availableCompanies]);
  useEffect(() => saveToStorage('selectedCompany', selectedCompany), [selectedCompany]);
  useEffect(() => saveToStorage('transactions', transactions), [transactions]);
  useEffect(() => saveToStorage('menuItems', menuItems), [menuItems]);
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('productOutputs', productOutputs), [productOutputs]);
  useEffect(() => saveToStorage('suppliers', suppliers), [suppliers]);
  useEffect(() => saveToStorage('manualShoppingLists', manualShoppingLists), [manualShoppingLists]);

  // UI States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAddingCompanyModalOpen, setIsAddingCompanyModalOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingOutput, setIsAddingOutput] = useState(false);
  const [editingOutput, setEditingOutput] = useState<ProductOutput | null>(null);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isAddingManualShoppingList, setIsAddingManualShoppingList] = useState(false);
  const [editingManualList, setEditingManualList] = useState<ManualShoppingList | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

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
  const currentSuppliers = suppliers[selectedCompany.id] || [];
  const currentManualLists = manualShoppingLists[selectedCompany.id] || [];

  useEffect(() => {
    const newNotifications: Notification[] = [];
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

    newNotifications.push({
      id: 'welcome-msg',
      type: 'info',
      title: 'GIROCHEF Ativo',
      message: `Monitorando ${selectedCompany.name} em tempo real. Novos insights de CMV disponíveis.`,
      timestamp: new Date().toISOString(),
      read: true
    });

    setNotifications(newNotifications);
  }, [selectedCompany.id, products, productOutputs]);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'transaction' | 'menuItem' | 'product' | 'output' | 'company' | 'supplier' | 'manualList';
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

  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      setSuppliers(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(s => 
          s.id === editingSupplier.id ? { ...supplierData, id: s.id } : s
        )
      }));
      setEditingSupplier(null);
    } else {
      const newSupplier: Supplier = { ...supplierData, id: Math.random().toString(36).substr(2, 9) };
      setSuppliers(prev => ({
        ...prev,
        [selectedCompany.id]: [...(prev[selectedCompany.id] || []), newSupplier]
      }));
      setIsAddingSupplier(false);
    }
  };

  const handleSaveManualShoppingList = (items: ManualShoppingItem[], name: string) => {
    const totalCost = items.reduce((acc, item) => acc + (item.quantity * item.estimatedCost), 0);
    
    if (editingManualList) {
      setManualShoppingLists(prev => ({
        ...prev,
        [selectedCompany.id]: (prev[selectedCompany.id] || []).map(l => 
          l.id === editingManualList.id ? { ...l, name, items, totalCost } : l
        )
      }));
      setEditingManualList(null);
    } else {
      const newList: ManualShoppingList = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || `Lista de Compras - ${new Date().toLocaleDateString('pt-BR')}`,
        date: new Date().toISOString(),
        totalCost,
        items: items
      };

      setManualShoppingLists(prev => ({
        ...prev,
        [selectedCompany.id]: [newList, ...(prev[selectedCompany.id] || [])]
      }));
      setIsAddingManualShoppingList(false);
    }
  };

  const handleLaunchItemFromShoppingList = (item: ManualShoppingItem) => {
    // Switch to product entry tab and pre-fill data
    setIsAddingManualShoppingList(false);
    setEditingManualList(null);
    setActiveTab('products');
    setEditingProduct({
      id: 'template', // Temporary ID to trigger the form
      name: item.name,
      supplier: item.supplier,
      cost: item.estimatedCost,
      quantity: item.quantity,
      unit: item.unit,
      date: new Date().toISOString().split('T')[0],
      nfNumber: '',
      category: 'Compras Manuais'
    });
    setIsAddingProduct(true);
  };

  const handleUpdateCompany = (updatedData: Partial<Company>) => {
    setAvailableCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, ...updatedData } : c));
    setSelectedCompany(prev => ({ ...prev, ...updatedData }));
  };

  const handleAddNewCompany = (companyData: Omit<Company, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newCompany: Company = {
      ...companyData,
      id: newId
    };
    setAvailableCompanies(prev => [...prev, newCompany]);
    setSelectedCompany(newCompany);
    setActiveTab('dashboard');
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
    } else if (type === 'supplier') {
       setSuppliers(prev => ({ ...prev, [selectedCompany.id]: prev[selectedCompany.id].filter(s => s.id !== id) }));
    } else if (type === 'manualList') {
       setManualShoppingLists(prev => ({ ...prev, [selectedCompany.id]: prev[selectedCompany.id].filter(l => l.id !== id) }));
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
    if (activeTab === 'suppliers' && (isAddingSupplier || editingSupplier)) {
      return <SupplierForm initialData={editingSupplier || undefined} onSave={handleSaveSupplier} onCancel={() => { setIsAddingSupplier(false); setEditingSupplier(null); }} />;
    }
    if (activeTab === 'shopping-list' && (isAddingManualShoppingList || editingManualList)) {
      return (
        <ManualShoppingListForm 
          availableProducts={currentProducts} 
          onSave={handleSaveManualShoppingList} 
          onCancel={() => { setIsAddingManualShoppingList(false); setEditingManualList(null); }} 
          onLaunchItem={handleLaunchItemFromShoppingList} 
          initialItems={editingManualList?.items}
          initialName={editingManualList?.name}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard company={selectedCompany} transactions={currentTransactions} menuItems={currentMenuItems} productOutputs={currentOutputs} />;
      case 'cashflow': return <CashFlow transactions={currentTransactions} onAddClick={() => setIsAddingTransaction(true)} onEditClick={setEditingTransaction} onDeleteClick={(id) => initiateDelete('transaction', id, 'Excluir Lançamento?', 'Esta ação é irreversível.')} onExport={() => {}} />;
      case 'products': return <ProductRegistration products={currentProducts} onAddClick={() => setIsAddingProduct(true)} onEditClick={setEditingProduct} onDeleteClick={(id) => initiateDelete('product', id, 'Excluir Produto?', 'Isso removerá o insumo do seu cadastro.')} />;
      case 'outputs': return <ProductOutputRegistration outputs={currentOutputs} onAddClick={() => setIsAddingOutput(true)} onEditClick={setEditingOutput} onDeleteClick={(id) => initiateDelete('output', id, 'Excluir Baixa?', 'Ao excluir, a quantidade será devolvida ao estoque.')} />;
      case 'shopping-list': return (
        <ShoppingList 
          products={currentProducts} 
          manualLists={currentManualLists} 
          onAddManualClick={() => setIsAddingManualShoppingList(true)} 
          onEditManualList={setEditingManualList}
          onDeleteManualList={(id) => initiateDelete('manualList', id, 'Dar Baixa na Lista?', 'Isso removerá a lista do seu histórico.')}
        />
      );
      case 'suppliers': return <Suppliers suppliers={currentSuppliers} onAddClick={() => setIsAddingSupplier(true)} onEditClick={(s) => setEditingSupplier(s)} onDeleteClick={(id) => initiateDelete('supplier', id, 'Excluir Fornecedor?', 'Isso removerá o fornecedor da base.')} />;
      case 'menu': return <MenuEngineering items={currentMenuItems} onAddClick={() => setIsAddingMenuItem(true)} onEditClick={(item) => setEditingMenuItem(item)} onDeleteClick={(id) => initiateDelete('menuItem', id, 'Excluir Item do Cardápio?', 'Isso removerá a ficha técnica permanentemente.')} />;
      case 'reports': return <Reports company={selectedCompany} transactions={currentTransactions} menuItems={currentMenuItems} />;
      case 'settings': return <Settings company={selectedCompany} onUpdateCompany={handleUpdateCompany} onDeleteCompany={(id) => initiateDelete('company', id, 'Excluir Empresa?', 'Isso apagará permanentemente todos os dados desta empresa. Tem certeza?')} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={(t) => { 
        setActiveTab(t); 
        setIsAddingTransaction(false); setEditingTransaction(null); 
        setIsAddingProduct(false); setEditingProduct(null); 
        setIsAddingOutput(false); setEditingOutput(null);
        setIsAddingMenuItem(false); setEditingMenuItem(null);
        setIsAddingSupplier(false); setEditingSupplier(null);
        setIsAddingManualShoppingList(false); setEditingManualList(null);
      }} onSupportClick={() => setIsSupportOpen(true)} />
      <main className="flex-1 ml-64 min-h-screen flex flex-col transition-all duration-300">
        <header className="sticky top-0 h-20 border-b border-[#1a1a1a] bg-black/80 backdrop-blur-md z-30 px-8 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize text-[#D4AF37]">{activeTab.replace(/-/g, ' ')}</h2>
            <div className="h-6 w-px bg-[#1a1a1a] mx-2 hidden sm:block"></div>
            <p className="text-slate-500 text-sm hidden sm:block">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAIModalOpen(true)} 
              className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all gold-glow group"
            >
              <Sparkles size={16} className="group-hover:animate-pulse" /> GIROCHEF AI
            </button>
            
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2.5 bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl text-white relative hover:border-[#D4AF37]/50 transition-colors ${unreadCount > 0 ? 'ring-2 ring-[#D4AF37]/20' : ''}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-black text-[8px] flex items-center justify-center font-black text-black">
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

            <CompanySelector 
              companies={availableCompanies} 
              selected={selectedCompany} 
              onSelect={setSelectedCompany} 
              onAddClick={() => setIsAddingCompanyModalOpen(true)}
            />
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full flex-1">{renderContent()}</div>
        <footer className="p-8 border-t border-[#1a1a1a] text-slate-600 text-xs text-center no-print">© 2024 GIROCHEF SaaS - Inteligência Financeira para Delivery.</footer>
      </main>
      <AIConsultant isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} contextData={contextData} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <AddCompanyModal 
        isOpen={isAddingCompanyModalOpen} 
        onClose={() => setIsAddingCompanyModalOpen(false)} 
        onSave={handleAddNewCompany} 
      />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} confirmLabel="Confirmar" onConfirm={handleConfirmDelete} onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default App;
