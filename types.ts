export type Platform = 'iFood' | 'brendi';
export type Unit = 'un' | 'kg' | 'g' | 'l' | 'ml';
export type OutputReason = 'Venda' | 'Desperdício' | 'Uso Interno' | 'Vencimento' | 'Outros';

export interface Company {
  id: string;
  name: string;
  category: string;
  logo: string;
  description?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  cost: number;
}

export interface MenuItem {
  id: string;
  name: string;
  unit: Unit;
  cost: number;
  price: number;
  salesVolume: number;
  category: 'Estrela' | 'Burro de Carga' | 'Quebra-cabeça' | 'Cão';
  ingredients?: Ingredient[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Entrada' | 'Saída';
  category: string;
  platform?: Platform;
  amount: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  supplier: string;
  nfNumber: string;
  category: string;
  unit: Unit;
  quantity: number;
  cost: number;
  date: string;
}

export interface ProductOutput {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: Unit;
  reason: OutputReason;
  date: string;
  estimatedCost: number;
}

export interface FinancialStats {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  workingCapital: number;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}