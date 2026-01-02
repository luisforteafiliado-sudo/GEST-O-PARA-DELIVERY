import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { Company } from '../types';

interface CompanySelectorProps {
  companies: Company[];
  selected: Company;
  onSelect: (company: Company) => void;
  onAddClick: () => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ companies, selected, onSelect, onAddClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-xl hover:border-[#D4AF37]/40 transition-colors shadow-lg"
      >
        <img src={selected.logo} alt={selected.name} className="w-8 h-8 rounded-full border border-[#2a2a2a] object-cover" />
        <div className="text-left">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Operação Ativa</p>
          <p className="text-sm font-bold text-[#D4AF37] leading-tight">{selected.name}</p>
        </div>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 space-y-1">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  onSelect(company);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selected.id === company.id ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'hover:bg-[#1a1a1a] text-slate-400 hover:text-white'
                }`}
              >
                <img src={company.logo} className="w-8 h-8 rounded-full object-cover border border-[#2a2a2a]" />
                <div className="text-left">
                  <p className="text-sm font-bold">{company.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{company.category}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-[#2a2a2a] bg-black">
            <button 
              onClick={() => {
                onAddClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all"
            >
              <Building2 size={14} />
              Adicionar Nova Empresa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;