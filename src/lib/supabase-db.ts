import { supabase } from './supabase';
import { Category, Transaction, Budget, AppSettings, TransactionType } from './supabase-types';

export const dbService = {
  // Transactions
  async getTransactions(userId: string, monthYear?: string) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          type,
          color,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (monthYear) {
      query = query.eq('month_year', monthYear);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getTransaction(id: number, userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          type,
          color,
          icon
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTransaction(id: number, transaction: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTransaction(id: number, userId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Categories
  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getCategory(id: number, userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: number, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: number, userId: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Budgets
  async getBudgets(userId: string, monthYear?: string) {
    let query = supabase
      .from('budgets')
      .select(`
        *,
        categories (
          id,
          name,
          type,
          color,
          icon
        )
      `)
      .eq('user_id', userId);

    if (monthYear) {
      query = query.eq('month_year', monthYear);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async createBudget(budget: Omit<Budget, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBudget(id: number, budget: Partial<Budget>) {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBudget(id: number, userId: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Settings
  async getSettings(userId: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return null
        return null;
      }
      throw error;
    }
    return data;
  },

  async createSettings(settings: Omit<AppSettings, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('settings')
      .insert(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSettings(userId: string, settings: Partial<AppSettings>) {
    const { data, error } = await supabase
      .from('settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Seed initial data
  async seedInitialData(userId: string) {
    const existingCategories = await this.getCategories(userId);
    
    if (existingCategories.length === 0) {
      const defaultCategories: Omit<Category, 'id' | 'created_at'>[] = [
        { name: 'Salário', type: 'income', color: '#10b981', user_id: userId },
        { name: 'Freelance', type: 'income', color: '#3b82f6', user_id: userId },
        { name: 'Investimentos', type: 'income', color: '#f59e0b', user_id: userId },
        { name: 'Alimentação', type: 'expense', color: '#ef4444', user_id: userId },
        { name: 'Transporte', type: 'expense', color: '#f97316', user_id: userId },
        { name: 'Moradia', type: 'expense', color: '#8b5cf6', user_id: userId },
        { name: 'Lazer', type: 'expense', color: '#ec4899', user_id: userId },
        { name: 'Saúde', type: 'expense', color: '#06b6d4', user_id: userId },
        { name: 'Educação', type: 'expense', color: '#6366f1', user_id: userId },
      ];

      await Promise.all(
        defaultCategories.map(cat => this.createCategory(cat))
      );
    }

    const existingSettings = await this.getSettings(userId);
    
    if (!existingSettings) {
      await this.createSettings({
        user_id: userId,
        currency: 'BRL',
        theme: 'dark',
        monthly_budget_goal: 0,
      });
    }
  },

  // Real-time subscriptions
  subscribeToTransactions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('transactions-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToCategories(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('categories-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToSettings(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('settings-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'settings',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};
