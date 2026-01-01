
import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { Company } from '../types';

interface CompanySelectorProps {
  companies: Company[];
  selected: Company;
  onSelect: (company: Company) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ companies, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:border-slate-700 transition-colors"
      >
        <img src={selected.logo} alt={selected.name} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
        <div className="text-left">
          <p className="text-xs text-slate-500 font-medium leading-none mb-1">Empresa Ativa</p>
          <p className="text-sm font-semibold text-slate-200">{selected.name}</p>
        </div>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  onSelect(company);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selected.id === company.id ? 'bg-indigo-600/20' : 'hover:bg-slate-800'
                }`}
              >
                <img src={company.logo} className="w-8 h-8 rounded-full object-cover" />
                <div className="text-left">
                  <p className="text-sm font-semibold">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.category}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-slate-800">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300">
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
