
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, Plus, ArrowUpRight, ArrowDownRight, FileSpreadsheet, FileText, FileCode, ChevronDown, Pencil, Trash2, X } from 'lucide-react';
import { Transaction } from '../types';

interface CashFlowProps {
  transactions: Transaction[];
  onAddClick: () => void;
  onEditClick: (transaction: Transaction) => void;
  onDeleteClick: (id: string) => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
}

const CashFlow: React.FC<CashFlowProps> = ({ transactions, onAddClick, onEditClick, onDeleteClick, onExport }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Entrada' | 'Saída'>('all');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportOptions = [
    { id: 'csv', label: 'Exportar como CSV', icon: FileCode },
    { id: 'excel', label: 'Exportar como Excel', icon: FileSpreadsheet },
    { id: 'pdf', label: 'Relatório em PDF', icon: FileText },
  ];

  // Apply Search and Status Filters
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Sort by date (descending)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Fluxo de Caixa</h2>
          <p className="text-slate-400 text-sm">Controle cada centavo que entra e sai da sua operação.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Button with Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="bg-slate-900/50 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-slate-700 active:scale-95 shadow-lg"
            >
              <Download size={18} />
              Exportar
              <ChevronDown size={14} className={`transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 space-y-1">
                  {exportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onExport(option.id as 'csv' | 'excel' | 'pdf');
                        setIsExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group"
                    >
                      <option.icon size={18} className="text-slate-500 group-hover:text-indigo-400" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={18} /> Lançar Movimento
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou categoria..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-400 ${filterType !== 'all' ? 'border-indigo-500/50 text-indigo-400' : ''}`}>
              <Filter size={18} />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg text-sm px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer outline-none"
            >
              <option value="all">Todos os tipos</option>
              <option value="Entrada">Entradas</option>
              <option value="Saída">Saídas</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Plataforma</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group animate-in fade-in duration-300">
                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                          t.type === 'Entrada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {t.type === 'Entrada' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                        <span className="text-sm font-medium text-slate-200">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 uppercase whitespace-nowrap">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {t.platform ? (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          t.platform === 'iFood' ? 'bg-red-500/10 text-red-500' :
                          t.platform === 'brendi' ? 'bg-indigo-500/10 text-indigo-400' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {t.platform}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold text-sm whitespace-nowrap ${
                      t.type === 'Entrada' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.type === 'Entrada' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(t);
                          }}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(t.id);
                          }}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Search size={32} className="opacity-20 mb-2" />
                      <p className="font-medium">Nenhuma transação encontrada</p>
                      <p className="text-xs">Tente ajustar seus filtros ou busca.</p>
                      {(searchTerm || filterType !== 'all') && (
                        <button 
                          onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                          className="mt-4 text-xs text-indigo-400 hover:underline"
                        >
                          Limpar todos os filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Exibindo {sortedTransactions.length} de {transactions.length} transações</span>
          <div className="flex gap-2">
            <button className="p-1 px-3 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors" disabled>Anterior</button>
            <button className="p-1 px-3 border border-slate-800 rounded hover:bg-slate-800 transition-colors">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;
