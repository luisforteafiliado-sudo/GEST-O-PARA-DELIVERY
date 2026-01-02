import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, ComposedChart, Line, Legend } from 'recharts';
import { Transaction, MenuItem, Company } from '../types';
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Calendar, Loader2, ChevronDown, Check, Sparkles, AlertCircle, Activity } from 'lucide-react';

interface ReportsProps {
  company: Company;
  transactions: Transaction[];
  menuItems: MenuItem[];
}

type TimeRange = '7d' | '15d' | '30d' | '90d' | 'year';

const Reports: React.FC<ReportsProps> = ({ company, transactions, menuItems }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Referências para os blocos individuais
  const globalReportRef = useRef<HTMLDivElement>(null);
  const evolutionRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const categoryChartRef = useRef<HTMLDivElement>(null);
  const mixAnalysisRef = useRef<HTMLDivElement>(null);
  const platformTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsRangeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const referenceDate = new Date('2025-12-31');

  // Dados simulados para o gráfico de performance baseados no período
  const getEvolutionData = (range: TimeRange) => {
    const points = range === '7d' ? 7 : range === '15d' ? 15 : range === '30d' ? 10 : 12;
    const labels = range === 'year' ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] : Array.from({length: points}, (_, i) => `${i+1}`);
    
    return labels.map(label => {
      const rev = 5000 + Math.random() * 3000;
      const prof = rev * (0.15 + Math.random() * 0.1);
      return {
        name: label,
        faturamento: rev,
        lucro: prof,
        margem: (prof / rev) * 100,
        capitalGiro: 12000 + (Math.random() * 2000 - 1000)
      };
    });
  };

  const evolutionData = getEvolutionData(timeRange);

  const filterTransactionsByRange = (txs: Transaction[], range: TimeRange) => {
    return txs.filter(t => {
      const txDate = new Date(t.date);
      const diffTime = Math.abs(referenceDate.getTime() - txDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (range === '7d') return diffDays <= 7;
      if (range === '15d') return diffDays <= 15;
      if (range === '30d') return diffDays <= 30;
      if (range === '90d') return diffDays <= 90;
      if (range === 'year') return txDate.getFullYear() === referenceDate.getFullYear();
      return true;
    });
  };

  const filteredTransactions = filterTransactionsByRange(transactions, timeRange);
  const revenue = filteredTransactions.filter(t => t.type === 'Entrada').reduce((acc, t) => acc + t.amount, 0);
  const expenses = filteredTransactions.filter(t => t.type === 'Saída').reduce((acc, t) => acc + t.amount, 0);
  const profit = revenue - expenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'Saída')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const expensesData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  const itemPerformance = menuItems.map(item => ({
    name: item.name,
    totalProfit: (item.price - item.cost) * (item.salesVolume / 12),
    category: item.category
  })).sort((a, b) => (b.totalProfit as number) - (a.totalProfit as number)).slice(0, 5);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const rangeOptions = [
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '15d', label: 'Últimos 15 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: 'year', label: 'Este Ano (2025)' },
  ];

  // Cálculo dinâmico do desempenho por plataforma
  const platformStats = filteredTransactions
    .filter(t => t.type === 'Entrada')
    .reduce((acc: Record<string, { revenue: number, volume: number }>, t) => {
      const platformKey = t.platform || 'Venda Direta';
      if (!acc[platformKey]) acc[platformKey] = { revenue: 0, volume: 0 };
      acc[platformKey].revenue += t.amount;
      acc[platformKey].volume += 1;
      return acc;
    }, {});

  const platformPerformance = Object.entries(platformStats).map(([key, data]) => ({
    name: key === 'iFood' ? 'iFood Marketplace' : key === 'brendi' ? 'brendi (App Próprio)' : key,
    volume: data.volume,
    revenueValue: data.revenue,
    share: revenue > 0 ? (data.revenue / revenue) * 100 : 0,
    health: (data.revenue / (revenue || 1)) > 0.4 ? 'Excelente' : 'Normal'
  })).sort((a, b) => b.revenueValue - a.revenueValue);

  const exportBlockToPDF = async (ref: React.RefObject<HTMLDivElement>, blockName: string) => {
    if (!ref.current) return;
    const html2pdfLib = (window as any).html2pdf;
    if (!html2pdfLib) {
      alert("Aguarde o carregamento do motor de PDF.");
      return;
    }

    setIsGenerating(true);
    setGenerationStep(`Preparando ${blockName}...`);
    await new Promise(r => setTimeout(r, 700));
    setGenerationStep(`Processando inteligência de dados...`);
    await new Promise(r => setTimeout(r, 700));
    setGenerationStep(`Gerando arquivo final...`);

    const opt = {
      margin: 0.5,
      filename: `GIROCHEF_${blockName.replace(/\s+/g, '_')}_${company.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#020617' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdfLib().set(opt).from(ref.current).save();
    } catch (error) {
      console.error('Erro no bloco:', error);
      window.print();
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const selectedRangeLabel = rangeOptions.find(o => o.id === timeRange)?.label;

  const DownloadIcon = ({ onClick, title }: { onClick: () => void, title: string }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="p-1.5 hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 rounded-lg transition-all no-print group/btn"
      title={title}
    >
      <Download size={14} className="group-hover/btn:scale-110 transition-transform" />
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Overlay GIROCHEF AI */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 no-print">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute text-indigo-400 animate-pulse" size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-tight">Exportando Inteligência</h3>
              <div className="flex flex-col items-center gap-2">
                <p className="text-slate-400 text-sm font-medium h-5">{generationStep}</p>
                <div className="w-full max-w-[200px] bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>
            <div className="pt-4 flex items-start gap-3 text-left bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
              <AlertCircle size={18} className="text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                O GIROCHEF está gerando um extrato modular otimizado para sua gestão em <strong>{selectedRangeLabel}</strong>.
              </p>
            </div>
            <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">GIROCHEF modular reporting</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Gerenciais</h2>
          <p className="text-slate-400 text-sm">Visão analítica profunda da saúde financeira do {company.name}.</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsRangeMenuOpen(!isRangeMenuOpen)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 hover:border-slate-700 transition-all shadow-sm group"
            >
              <Calendar size={14} className="text-indigo-400" />
              <span className="font-medium">{selectedRangeLabel}</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${isRangeMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isRangeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-1">
                  {rangeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setTimeRange(option.id as TimeRange); setIsRangeMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${timeRange === option.id ? 'bg-indigo-600/10 text-indigo-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                      {option.label}
                      {timeRange === option.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => exportBlockToPDF(globalReportRef, 'Relatorio_Completo')}
            disabled={isGenerating}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group`}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isGenerating ? 'Processando...' : 'Relatório Completo'}
          </button>
        </div>
      </div>

      <div ref={globalReportRef} id="report-content" className="space-y-8 p-1">
        
        {/* Gráfico de Performance Combinada */}
        <div ref={evolutionRef} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl relative group/block">
          <div className="absolute right-4 top-4 z-10 opacity-0 group-hover/block:opacity-100 transition-opacity">
            <DownloadIcon onClick={() => exportBlockToPDF(evolutionRef, 'Performance_Evolutiva')} title="Exportar Performance" />
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Performance Evolutiva de Gestão</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Consolidado Financeiro ({selectedRangeLabel})</p>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                
                {/* Eixo Esquerdo: Valores R$ */}
                <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v >= 1000 ? (v/1000).toFixed(1) + 'k' : v}`} />
                
                {/* Eixo Direito: Margem % */}
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  formatter={(value: any, name: string) => [
                    name === 'margem' ? `${value.toFixed(1)}%` : `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 
                    name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
                  ]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }} />
                
                <Area yAxisId="left" type="monotone" dataKey="faturamento" name="Faturamento Bruto" fill="url(#colorRev)" stroke="#10b981" strokeWidth={3} />
                <Line yAxisId="left" type="monotone" dataKey="lucro" name="Lucro Líquido" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                <Line yAxisId="left" type="monotone" dataKey="capitalGiro" name="Capital de Giro" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line yAxisId="right" type="step" dataKey="margem" name="Margem Líquida" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bloco 1: Indicadores */}
        <div ref={indicatorsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative group/block">
          <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/block:opacity-100 transition-opacity">
            <DownloadIcon onClick={() => exportBlockToPDF(indicatorsRef, 'Indicadores_Chave')} title="Exportar Indicadores" />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-all hover:border-slate-700">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all"><DollarSign size={100} /></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Receita Total</p>
            <h3 className="text-2xl font-bold text-slate-100">R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase"><TrendingUp size={12} /> <span>+{timeRange === '30d' ? '8.4' : '3.2'}% vs ant.</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-all hover:border-slate-700">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all"><TrendingDown size={100} /></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Custo Operacional</p>
            <h3 className="text-2xl font-bold text-slate-100">R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <div className="mt-4 flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase"><TrendingUp size={12} /> <span>Estabilidade de Insumos</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-all hover:border-slate-700">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all"><TrendingUp size={100} /></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Lucro Líquido</p>
            <h3 className={`text-2xl font-bold ${profit >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase"><TrendingUp size={12} /> <span>Caixa Livre Disponível</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-all hover:border-slate-700">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all"><PieChartIcon size={100} /></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Margem Líquida</p>
            <h3 className="text-2xl font-bold text-amber-400">{margin.toFixed(1)}%</h3>
            <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase"><span>Ref. Setorial: 22%</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bloco 2: Gastos por Categoria */}
          <div ref={categoryChartRef} className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col shadow-sm relative group/block">
            <div className="absolute right-3 top-3 z-10 opacity-0 group-hover/block:opacity-100 transition-opacity">
              <DownloadIcon onClick={() => exportBlockToPDF(categoryChartRef, 'Gastos_por_Categoria')} title="Exportar Gastos" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2 text-slate-300">
              <TrendingDown size={16} className="text-rose-500" />
              Gastos por Categoria ({timeRange})
            </h3>
            {expensesData.length > 0 ? (
              <>
                <div className="h-[250px] w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expensesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" isAnimationActive={!isGenerating}>
                        {expensesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {expensesData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-200">R$ {(item.value as number).toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-2"><TrendingDown size={32} /><p className="text-xs">Dados insuficientes</p></div>
            )}
          </div>

          {/* Bloco 3: Análise BCG */}
          <div ref={mixAnalysisRef} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col shadow-sm relative group/block">
            <div className="absolute right-3 top-3 z-10 opacity-0 group-hover/block:opacity-100 transition-opacity">
              <DownloadIcon onClick={() => exportBlockToPDF(mixAnalysisRef, 'Analise_Mix_Produtos')} title="Exportar Análise BCG" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2 text-slate-300">
              <TrendingUp size={16} className="text-emerald-500" />
              Análise de Mix de Produtos (BCG)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={itemPerformance} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="totalProfit" radius={[0, 4, 4, 0]} isAnimationActive={!isGenerating}>
                    {itemPerformance.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0"><Sparkles size={20} /></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-tight">Sugestão Estratégica GIROCHEF:</p>
                <p className="text-xs font-medium text-slate-300">Foque na tração dos itens de maior lucro líquido. Pequenos ajustes no volume impactam severamente a margem total.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 4: Tabela de Canais */}
        <div ref={platformTableRef} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm relative group/block">
          <div className="absolute right-4 top-4 z-10 opacity-0 group-hover/block:opacity-100 transition-opacity">
            <DownloadIcon onClick={() => exportBlockToPDF(platformTableRef, 'Desempenho_Plataformas')} title="Exportar Canais" />
          </div>
          <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Desempenho por Plataforma de Venda</h3>
            <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest px-2 py-1 bg-indigo-500/5 rounded-lg border border-indigo-500/10">Share Operacional</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                  <th className="px-6 py-4">Plataforma</th>
                  <th className="px-6 py-4 text-right">Volume Est.</th>
                  <th className="px-6 py-4 text-right">Receita Bruta</th>
                  <th className="px-6 py-4 text-right">Participação</th>
                  <th className="px-6 py-4 text-center">Saúde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {platformPerformance.length > 0 ? (
                  platformPerformance.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-slate-200">{row.name}</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400">{row.volume} peds</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-100 font-bold">R$ {row.revenueValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400">{row.share.toFixed(0)}%</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${row.health === 'Excelente' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>{row.health}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-xs italic">
                      Nenhum lançamento de venda encontrado para o período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;