-- Setup script for LK Finanças Supabase Database
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT,
  color TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  month_year TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  month_year TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  currency TEXT DEFAULT 'BRL',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  monthly_budget_goal DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_month_year ON transactions(month_year);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(month_year);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- Disable Row Level Security (RLS) for simple auth system
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Drop existing foreign key constraints if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'categories_user_id_fkey' AND table_name = 'categories') THEN
    ALTER TABLE categories DROP CONSTRAINT categories_user_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_user_id_fkey' AND table_name = 'transactions') THEN
    ALTER TABLE transactions DROP CONSTRAINT transactions_user_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'budgets_user_id_fkey' AND table_name = 'budgets') THEN
    ALTER TABLE budgets DROP CONSTRAINT budgets_user_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'settings_user_id_fkey' AND table_name = 'settings') THEN
    ALTER TABLE settings DROP CONSTRAINT settings_user_id_fkey;
  END IF;
END $$;

-- Insert initial categories for admin user
INSERT INTO categories (name, type, color, user_id) VALUES
  ('Salário', 'income', '#10b981', '00000000-0000-0000-0000-000000000000'),
  ('Freelance', 'income', '#3b82f6', '00000000-0000-0000-0000-000000000000'),
  ('Investimentos', 'income', '#f59e0b', '00000000-0000-0000-0000-000000000000'),
  ('Alimentação', 'expense', '#ef4444', '00000000-0000-0000-0000-000000000000'),
  ('Transporte', 'expense', '#f97316', '00000000-0000-0000-0000-000000000000'),
  ('Moradia', 'expense', '#8b5cf6', '00000000-0000-0000-0000-000000000000'),
  ('Lazer', 'expense', '#ec4899', '00000000-0000-0000-0000-000000000000'),
  ('Saúde', 'expense', '#06b6d4', '00000000-0000-0000-0000-000000000000'),
  ('Educação', 'expense', '#6366f1', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Insert initial settings for admin user
INSERT INTO settings (user_id, currency, theme, monthly_budget_goal) VALUES
  ('00000000-0000-0000-0000-000000000000', 'BRL', 'dark', 0)
ON CONFLICT (user_id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for settings table
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
