
import React, { useState } from 'react';
import { ShoppingBag, Printer, AlertTriangle, CheckCircle2, Package, Truck, Plus, Calendar, ChevronRight, Pencil, Trash2, Search, ShoppingCart, FileText, MessageSquare } from 'lucide-react';
import { Product, ManualShoppingList } from '../types';

interface ShoppingListProps {
  products: Product[];
  manualLists: ManualShoppingList[];
  onAddManualClick?: () => void;
  onEditManualList?: (list: ManualShoppingList) => void;
  onDeleteManualList?: (id: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  products, 
  manualLists, 
  onAddManualClick,
  onEditManualList,
  onDeleteManualList
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const lowStockThreshold = 10;
  const itemsToBuy = products.filter(p => p.quantity <= lowStockThreshold);

  const filteredLists = manualLists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = (list: ManualShoppingList) => {
    const header = `*GIROCHEF - ${list.name.toUpperCase()}*\n`;
    const date = `Gerado em: ${new Date(list.date).toLocaleDateString('pt-BR')}\n\n`;
    const items = list.items.map(item => 
      `• *${item.name}*: ${item.quantity} ${item.unit.toUpperCase()} (Fornecedor: ${item.supplier})`
    ).join('\n');
    const footer = `\n\n*Total Estimado: R$ ${list.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`;

    const message = encodeURIComponent(header + date + items + footer);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleDownloadPDF = (list: ManualShoppingList) => {
    const html2pdfLib = (window as any).html2pdf;
    if (!html2pdfLib) {
      alert("Aguarde o carregamento do motor de PDF.");
      return;
    }

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: 'Inter', sans-serif; background-color: #000; color: #fff; min-height: 1000px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px;">
          <div>
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px; text-transform: uppercase; font-weight: 900; letter-spacing: -1px;">GIROCHEF</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">Lista de Compras Diária</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 14px; color: #D4AF37; font-weight: 800; text-transform: uppercase;">${list.name}</p>
            <p style="margin: 5px 0 0; font-size: 10px; color: #666; font-weight: 700;">GERADO EM: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background-color: #111; color: #D4AF37; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 1px;">
              <th style="padding: 15px; text-align: left; border-bottom: 1px solid #222;">Item</th>
              <th style="padding: 15px; text-align: center; border-bottom: 1px solid #222;">Qtd</th>
              <th style="padding: 15px; text-align: right; border-bottom: 1px solid #222;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${list.items.map(item => `
              <tr style="border-bottom: 1px solid #111;">
                <td style="padding: 15px; font-size: 12px; font-weight: 800; color: #eee;">${item.name}</td>
                <td style="padding: 15px; font-size: 12px; text-align: center; font-weight: 800; color: #eee;">${item.quantity} ${item.unit}</td>
                <td style="padding: 15px; font-size: 12px; text-align: right; color: #D4AF37; font-weight: 900;">R$ ${(item.quantity * item.estimatedCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="display: flex; justify-content: flex-end;">
          <div style="background-color: #111; padding: 25px 40px; border-radius: 20px; border-top: 3px solid #D4AF37; min-width: 250px; text-align: right;">
            <p style="margin: 0; font-size: 10px; color: #666; text-transform: uppercase; font-weight: 900;">Investimento Total Estimado</p>
            <p style="margin: 8px 0 0; font-size: 28px; color: #D4AF37; font-weight: 900;">R$ ${list.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: 0,
      filename: `GIROCHEF_Lista_${list.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#000' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdfLib().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#D4AF37] uppercase tracking-tighter">Compras do Dia</h2>
          <p className="text-slate-500 text-xs lg:text-sm italic">Gestão e acompanhamento das suas ordens de compra.</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button 
            onClick={onAddManualClick}
            className="bg-[#D4AF37] hover:bg-[#B8962D] text-black px-4 lg:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 gold-glow shrink-0 flex items-center gap-2"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Nova Lista Manual</span><span className="sm:hidden">Nova Lista</span>
          </button>
          <button 
            onClick={handlePrint}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-slate-400 hover:text-white px-4 lg:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2"
          >
            <Printer size={18} /> <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {itemsToBuy.length > 0 && (
        <section className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-4 lg:p-6 no-print overflow-hidden">
          <h3 className="text-[9px] lg:text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
            <AlertTriangle size={14} /> Reposição Crítica
          </h3>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {itemsToBuy.map((item) => (
              <div key={item.id} className="bg-[#0b0b0b] border border-[#2a2a2a] px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl flex items-center gap-2 lg:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                <span className="text-[10px] lg:text-xs font-bold text-white truncate max-w-[100px] lg:max-w-none">{item.name}</span>
                <span className="text-[8px] lg:text-[10px] text-rose-400 font-black uppercase whitespace-nowrap">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="bg-[#1a1a1a] border border-[#1a1a1a] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-4 lg:p-6 bg-black/40 border-b border-[#2a2a2a] no-print">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-[#D4AF37]/50 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a]">
                <th className="px-4 lg:px-8 py-4 lg:py-5">Identificação</th>
                <th className="px-4 lg:px-8 py-4 lg:py-5 text-right">Valor</th>
                <th className="px-4 lg:px-8 py-4 lg:py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <tr key={list.id} className="hover:bg-black/40 transition-colors group">
                    <td className="px-4 lg:px-8 py-5 lg:py-6">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="hidden sm:flex w-10 h-10 bg-[#D4AF37]/10 rounded-xl items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                          <ShoppingCart size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs lg:text-sm font-black text-white uppercase tracking-tight truncate">{list.name}</span>
                          <span className="text-[8px] lg:text-[9px] text-slate-500 font-bold uppercase">{new Date(list.date).toLocaleDateString('pt-BR')} • {list.items.length} itens</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-8 py-5 lg:py-6 text-right">
                      <span className="text-xs lg:text-sm font-black text-[#D4AF37] whitespace-nowrap">
                        R$ {list.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 lg:px-8 py-5 lg:py-6">
                      <div className="flex items-center justify-center gap-1 lg:gap-3 no-print">
                        <button 
                          onClick={() => handleShareWhatsApp(list)}
                          className="p-2 lg:p-2.5 hover:bg-emerald-600 text-slate-500 hover:text-white rounded-xl transition-all"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(list)}
                          className="p-2 lg:p-2.5 hover:bg-indigo-600 text-slate-500 hover:text-white rounded-xl transition-all"
                        >
                          <FileText size={16} />
                        </button>
                        <button 
                          onClick={() => onEditManualList?.(list)}
                          className="p-2 lg:p-2.5 hover:bg-[#D4AF37] text-slate-500 hover:text-black rounded-xl transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => onDeleteManualList?.(list.id)}
                          className="p-2 lg:p-2.5 hover:bg-rose-600 text-slate-500 hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <ShoppingBag size={32} className="opacity-10 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">Nenhuma lista</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
