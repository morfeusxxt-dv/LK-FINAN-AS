import React, { useState } from 'react';
import { Snowflake, Mail, Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password, name);
        if (result.success) {
          toast.success('Conta criada com sucesso! Verifique seu email.');
          setIsSignUp(false);
        } else {
          toast.error(result.error?.message || 'Erro ao criar conta');
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          toast.success('Login realizado com sucesso!');
        } else {
          toast.error(result.error?.message || 'Erro ao fazer login');
        }
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/40 border-slate-800 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -ml-16 -mb-16"></div>
        
        <CardHeader className="p-8 pb-4 relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Snowflake className="w-8 h-8 text-white relative z-10 transition-transform group-hover:rotate-45" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tighter text-white flex flex-col leading-none">
                <span className="text-sky-400 text-[10px] tracking-[0.3em] font-black mb-1">LK</span>
                <span className="text-white">FINANÇAS</span>
              </h1>
            </div>
          </div>
          <CardTitle className="text-center text-xl font-bold text-white">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </CardTitle>
          <p className="text-center text-slate-400 text-sm mt-2">
            {isSignUp ? 'Gerencie suas finanças com sua equipe' : 'Acesse suas finanças de qualquer lugar'}
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-4 relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300 text-sm font-medium">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-10 h-11 focus:border-sky-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-10 h-11 focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-10 h-11 focus:border-sky-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-lg shadow-sky-500/20 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Crie uma'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              <span className="text-sky-400 font-semibold">SYNC:</span> Seus dados ficam salvos na nuvem. Acesse de qualquer dispositivo e compartilhe com sua equipe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
