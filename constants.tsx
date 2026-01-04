
import React from 'react';
import { Company, MenuItem, Transaction, Product, ProductOutput, Supplier } from './types';

export const COMPANIES: Company[] = [
  { id: '1', name: 'Burger Lab', category: 'Hamburgueria', logo: 'https://picsum.photos/seed/burger/200' },
  { id: '2', name: 'Sushi Zen', category: 'Japonesa', logo: 'https://picsum.photos/seed/sushi/200' },
  { id: '3', name: 'Pizza Master', category: 'Pizzaria', logo: 'https://picsum.photos/seed/pizza/200' },
];

export const MOCK_MENU_ITEMS: Record<string, MenuItem[]> = {
  '1': [
    { id: 'm1', name: 'Classic Burger', unit: 'un', cost: 12.5, price: 34.9, salesVolume: 450, category: 'Estrela' },
    { id: 'm2', name: 'Cheese Fries', unit: 'un', cost: 8.0, price: 18.0, salesVolume: 320, category: 'Burro de Carga' },
  ],
  '2': []
};

export const MOCK_TRANSACTIONS: Record<string, Transaction[]> = {
  '1': [
    { id: 't0', date: '2025-12-30', type: 'Entrada', category: 'VENDAS', platform: 'brendi', amount: 1500.0, description: 'VENDAS BRENDI' },
    { id: 't5', date: '2024-05-01', type: 'Entrada', category: 'Vendas', platform: 'iFood', amount: 4500.5, description: 'Repasse Semanal iFood' },
  ],
  '2': []
};

export const MOCK_PRODUCTS: Record<string, Product[]> = {
  '1': [
    { id: 'p1', name: 'Carne Bovina Moída', supplier: 'Friboi Alimentos', nfNumber: 'NF-99283', category: 'Proteínas', unit: 'kg', quantity: 25, cost: 45.90, date: '2025-12-28' },
    { id: 'p2', name: 'Pão de Brioche', supplier: 'Padaria Artesanal', nfNumber: 'NF-88210', category: 'Padaria', unit: 'un', quantity: 100, cost: 1.85, date: '2025-12-29' },
  ],
  '2': []
};

export const MOCK_PRODUCT_OUTPUTS: Record<string, ProductOutput[]> = {
  '1': [
    { id: 'o1', productId: 'p1', productName: 'Carne Bovina Moída', quantity: 2.5, unit: 'kg', reason: 'Desperdício', date: '2025-12-30', estimatedCost: 114.75 },
    { id: 'o2', productId: 'p2', productName: 'Pão de Brioche', quantity: 12, unit: 'un', reason: 'Venda', date: '2025-12-31', estimatedCost: 22.20 },
  ],
  '2': []
};

export const MOCK_SUPPLIERS: Record<string, Supplier[]> = {
  '1': [
    { id: 's1', name: 'Friboi Alimentos', contact: '(11) 98888-7777', category: 'Proteínas', rating: 5 },
    { id: 's2', name: 'Padaria Artesanal', contact: '(11) 97777-6666', category: 'Panificação', rating: 4 },
  ],
  '2': []
};
