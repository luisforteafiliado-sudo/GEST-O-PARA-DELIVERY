
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

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-[#D4AF37]">Fluxo de Caixa</h2>
          <p className="text-slate-500 text-xs lg:text-sm italic">Controle absoluto de cada centavo.</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
          <div className="relative shrink-0" ref={menuRef}>
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="bg-[#1a1a1a] hover:bg-black text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border border-[#1a1a1a] active:scale-95"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Exportar</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 space-y-1">
                  {exportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onExport(option.id as 'csv' | 'excel' | 'pdf');
                        setIsExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-xs text-slate-300 hover:bg-black hover:text-[#D4AF37] rounded-lg transition-colors group"
                    >
                      <option.icon size={16} className="text-slate-500 group-hover:text-[#D4AF37]" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onAddClick}
            className="bg-[#D4AF37] hover:bg-[#B8962D] text-black px-4 lg:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 gold-glow shrink-0 flex items-center gap-2"
          >
            <Plus size={18} /> <span className="hidden xs:inline">Lançar Movimento</span><span className="xs:hidden">Lançar</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-black/40 border-b border-[#1a1a1a] flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-[#1a1a1a] rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-slate-200"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-black border border-[#1a1a1a] rounded-xl text-sm px-4 py-2.5 text-slate-300 focus:outline-none focus:border-[#D4AF37] outline-none w-full sm:w-auto"
          >
            <option value="all">Todos</option>
            <option value="Entrada">Receitas</option>
            <option value="Saída">Despesas</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#D4AF37]/50 text-[9px] lg:text-[10px] font-black uppercase tracking-widest border-b border-[#1a1a1a]">
                <th className="px-4 lg:px-6 py-4 lg:py-5">Data</th>
                <th className="px-4 lg:px-6 py-4 lg:py-5">Descrição</th>
                <th className="px-4 lg:px-6 py-4 lg:py-5 text-right whitespace-nowrap">Valor</th>
                <th className="px-4 lg:px-6 py-4 lg:py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-black/40 transition-colors group">
                    <td className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-medium text-slate-500 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          t.type === 'Entrada' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {t.type === 'Entrada' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs lg:text-sm font-bold text-slate-200 truncate">{t.description}</span>
                          <span className="text-[8px] lg:text-[10px] font-bold uppercase text-slate-600 truncate">{t.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 lg:px-6 py-4 text-right font-black text-xs lg:text-sm whitespace-nowrap ${
                      t.type === 'Entrada' ? 'text-[#D4AF37]' : 'text-rose-500'
                    }`}>
                      R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => onEditClick(t)} className="p-2 lg:p-2.5 hover:bg-black rounded-lg text-slate-500 hover:text-[#D4AF37] transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => onDeleteClick(t.id)} className="p-2 lg:p-2.5 hover:bg-black rounded-lg text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="py-20 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest italic opacity-40">Vazio</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;
