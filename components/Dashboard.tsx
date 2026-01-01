
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Users, AlertCircle, Activity, ArrowUpRight, PackageMinus } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar, Area, Legend, Cell } from 'recharts';
import { Company, Transaction, MenuItem, ProductOutput } from '../types';

interface DashboardProps {
  company: Company;
  transactions: Transaction[];
  menuItems: MenuItem[];
  productOutputs: ProductOutput[];
}

const Dashboard: React.FC<DashboardProps> = ({ company, transactions, menuItems, productOutputs }) => {
  const [dashboardRange, setDashboardRange] = useState('7d');
  
  const revenue = transactions.filter(t => t.type === 'Entrada').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'Saída').reduce((acc, t) => acc + t.amount, 0);
  const totalLoss = productOutputs.filter(o => o.reason !== 'Venda').reduce((acc, o) => acc + o.estimatedCost, 0);
  const profit = revenue - expenses - totalLoss;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const rangeLabels: Record<string, string> = {
    'hoje': 'Hoje',
    '7d': '7 dias',
    '15d': '15 dias',
    '30d': '30 dias',
    '90d': '90 dias',
    'total': 'Período Total'
  };

  // Dados simulados atualizados com Desperdício/Quebra
  const data = [
    { name: 'Seg', faturamento: 4200, lucro: 1400, margem: 33, desperdicio: 150 },
    { name: 'Ter', faturamento: 3800, lucro: 1100, margem: 29, desperdicio: 120 },
    { name: 'Qua', faturamento: 2900, lucro: 600, margem: 21, desperdicio: 340 },
    { name: 'Qui', faturamento: 4100, lucro: 1550, margem: 37, desperdicio: 90 },
    { name: 'Sex', faturamento: 5800, lucro: 1900, margem: 32, desperdicio: 210 },
    { name: 'Sáb', faturamento: 7200, lucro: 2600, margem: 36, desperdicio: 180 },
    { name: 'Dom', faturamento: 6500, lucro: 2100, margem: 32, desperdicio: 250 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-slate-300 font-medium">{entry.name}</span>
                </div>
                <span className="text-xs font-bold text-white">
                  {entry.name.includes('%') ? `${entry.value.toFixed(1)}%` : `R$ ${entry.value.toLocaleString('pt-BR')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faturamento Bruto', value: `R$ ${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Lucro Líquido Real', value: `R$ ${profit.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Quebra / Perdas', value: `R$ ${totalLoss.toLocaleString()}`, icon: PackageMinus, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Margem Líquida', value: `${margin.toFixed(1)}%`, icon: PieChart, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:scale-110 transition-transform"><kpi.icon size={80} /></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/10">
                <ArrowUpRight size={10} /> 12%
              </div>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-100">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Fluxo de Performance Real</h3>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Analise custos de produtos vs faturamento • {rangeLabels[dashboardRange]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-lg">
            <select 
              value={dashboardRange}
              onChange={(e) => setDashboardRange(e.target.value)}
              className="bg-transparent border-none text-xs font-bold rounded-lg py-2 px-4 text-black outline-none cursor-pointer"
            >
              <option value="7d">Uma semana</option>
              <option value="15d">15 dias</option>
              <option value="30d">30 dias</option>
            </select>
          </div>
        </div>

        <div className="h-[450px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="areaProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={15} tick={{ fontWeight: 600 }} />
              <YAxis yAxisId="left" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v >= 1000 ? (v/1000).toFixed(1) + 'k' : v}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
              <Legend verticalAlign="top" align="right" height={40} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingBottom: '20px' }} />
              
              <Bar yAxisId="left" dataKey="faturamento" name="Faturamento" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32} />
              <Area yAxisId="left" type="monotone" dataKey="lucro" name="Lucro Real" stroke="#6366f1" fill="url(#areaProfit)" strokeWidth={3} />
              <Line yAxisId="left" type="monotone" dataKey="desperdicio" name="Custo Desperdício" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
              <Line yAxisId="right" type="monotone" dataKey="margem" name="Margem %" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
