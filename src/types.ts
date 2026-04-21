export type TransactionType = 'income' | 'expense';

export interface Category {
  id?: number;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  categoryId: number;
  description: string;
  date: Date;
  monthYear: string; // Formatting YYYY-MM for easy filtering/grouping
}

export interface Budget {
  id?: number;
  categoryId: number;
  amount: number;
  monthYear: string;
}

export interface AppSettings {
  id?: number;
  monthlyBudgetGoal?: number;
  currency: string;
  theme: 'light' | 'dark';
}
