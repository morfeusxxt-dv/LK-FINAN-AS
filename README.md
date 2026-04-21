<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LK Finanças

Sistema de gestão financeira pessoal com sincronização em nuvem via Supabase. Acesse seus dados de qualquer dispositivo e compartilhe com sua equipe.

## Recursos

- 📊 Dashboard com resumo financeiro
- 💰 Controle de gastos e ganhos
- 📈 Gráficos e análises
- 🏷️ Gerenciamento de categorias
- ☁️ Sincronização automática na nuvem (Supabase)
- 🔐 Autenticação de usuários
- 📱 Responsivo para todos os dispositivos

## Configuração do Supabase

Este projeto usa Supabase para armazenamento em nuvem e autenticação. Siga os passos abaixo para configurar:

### 1. Criar projeto Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Aguarde o projeto ser provisionado (cerca de 2 minutos)

### 2. Configurar o banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Copie e execute o script do arquivo [`supabase-setup.sql`](supabase-setup.sql)
3. Este script criará todas as tabelas necessárias e configurará as políticas de segurança

### 3. Obter credenciais

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Chave pública anônima

### 4. Configurar variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. No `.env.local`, substitua os valores do Supabase:
   ```env
   VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-chave-anonima"
   ```

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (veja seção acima)

3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy no Vercel

Este projeto está configurado para deploy no Vercel:

1. Configure as variáveis de ambiente no Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Deploy automático ao fazer push para o repositório

## Arquitetura

- **Frontend**: React + Vite + TypeScript
- **UI**: TailwindCSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Banco de Dados**: PostgreSQL via Supabase
- **Autenticação**: Supabase Auth
