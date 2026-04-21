export type TransactionType = 'income' | 'expense';

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          type: TransactionType;
          icon?: string;
          color?: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          type: TransactionType;
          icon?: string;
          color?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          type?: TransactionType;
          icon?: string;
          color?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: number;
          type: TransactionType;
          amount: number;
          category_id: number;
          description: string;
          date: string;
          month_year: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          type: TransactionType;
          amount: number;
          category_id: number;
          description: string;
          date: string;
          month_year: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          type?: TransactionType;
          amount?: number;
          category_id?: number;
          description?: string;
          date?: string;
          month_year?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      budgets: {
        Row: {
          id: number;
          category_id: number;
          amount: number;
          month_year: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          category_id: number;
          amount: number;
          month_year: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          category_id?: number;
          amount?: number;
          month_year?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: number;
          user_id: string;
          currency: string;
          theme: 'light' | 'dark';
          monthly_budget_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          currency?: string;
          theme?: 'light' | 'dark';
          monthly_budget_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          currency?: string;
          theme?: 'light' | 'dark';
          monthly_budget_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type AppSettings = Database['public']['Tables']['settings']['Row'];
