import Dexie, { type Table } from 'dexie';
import { Transaction, Category, Budget, AppSettings } from '../types';

export class FinanceDB extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  budgets!: Table<Budget>;
  settings!: Table<AppSettings>;

  constructor() {
    super('FinanceDB');
    this.version(1).stores({
      transactions: '++id, type, categoryId, date, monthYear',
      categories: '++id, type, name',
      budgets: '++id, categoryId, monthYear',
      settings: '++id'
    });
  }
}

export const db = new FinanceDB();

// Initial data
export const seedDatabase = async () => {
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    await db.categories.bulkAdd([
      { name: 'Salário', type: 'income', color: '#10b981' },
      { name: 'Freelance', type: 'income', color: '#3b82f6' },
      { name: 'Investimentos', type: 'income', color: '#f59e0b' },
      { name: 'Alimentação', type: 'expense', color: '#ef4444' },
      { name: 'Transporte', type: 'expense', color: '#f97316' },
      { name: 'Moradia', type: 'expense', color: '#8b5cf6' },
      { name: 'Lazer', type: 'expense', color: '#ec4899' },
      { name: 'Saúde', type: 'expense', color: '#06b6d4' },
      { name: 'Educação', type: 'expense', color: '#6366f1' },
    ]);
  }

  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      currency: 'BRL',
      theme: 'light',
      monthlyBudgetGoal: 0
    });
  }
};
