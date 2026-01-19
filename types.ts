
export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  updatedAt: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  productCategory?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  timestamp: number;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  timestamp: number;
}

export interface AppSettings {
  adminId: string;
  adminPass: string;
  shopName: string;
  theme: 'light' | 'dark';
}

export type View = 'dashboard' | 'inventory' | 'sales' | 'expenses' | 'analytics' | 'settings';

export interface AppData {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  settings: AppSettings;
}
