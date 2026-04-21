import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Snowflake, LogOut } from "lucide-react";
import { simpleAuth } from "./lib/simple-auth";
import { dbService } from "./lib/supabase-db";
import { Navigation } from "./components/Navigation";
import { SummaryCards } from "./components/SummaryCards";
import { DashboardCharts } from "./components/DashboardCharts";
import { TransactionsTable } from "./components/TransactionsTable";
import { TransactionForm } from "./components/TransactionForm";
import { MonthSelector } from "./components/MonthSelector";
import { Settings } from "./components/Settings";
import { CategoryManager } from "./components/CategoryManager";
import { SimpleLogin } from "./components/SimpleLogin";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Progress, ProgressTrack, ProgressIndicator } from "../components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { formatCurrency } from "./lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import type { Transaction, Category, AppSettings } from "./lib/supabase-types";

function AppContent() {
  const isAuthenticated = simpleAuth.isAuthenticated();
  const user = simpleAuth.getUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // ID fixo para usuário admin (não usamos mais user_id do Supabase)
  const ADMIN_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const monthStr = format(selectedMonth, "yyyy-MM");
        const [transData, catsData, settingsData] = await Promise.all([
          dbService.getTransactions(ADMIN_ID, monthStr),
          dbService.getCategories(ADMIN_ID),
          dbService.getSettings(ADMIN_ID),
        ]);
        setTransactions(transData || []);
        setCategories(catsData || []);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const transSubscription = dbService.subscribeToTransactions(ADMIN_ID, () => {
      loadData();
    });
    const catsSubscription = dbService.subscribeToCategories(ADMIN_ID, () => {
      loadData();
    });
    const settingsSubscription = dbService.subscribeToSettings(ADMIN_ID, () => {
      loadData();
    });

    return () => {
      transSubscription.unsubscribe();
      catsSubscription.unsubscribe();
      settingsSubscription.unsubscribe();
    };
  }, [isAuthenticated, selectedMonth]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const hasVisited = localStorage.getItem("has_visited_finance_app_v3");
    if (!hasVisited) {
      toast("Bem-vindo!", {
        description: "Seus dados ficam salvos na nuvem.",
        duration: 10000,
      });
      localStorage.setItem("has_visited_finance_app_v3", "true");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  const monthStr = format(selectedMonth, "yyyy-MM");

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const budgetProgress = useMemo(() => {
    if (!settings?.monthly_budget_goal || settings.monthly_budget_goal === 0) return null;
    const progress = (totals.expenses / settings.monthly_budget_goal) * 100;
    return Math.min(progress, 100);
  }, [totals.expenses, settings]);

  const handleTabChange = (tab: string) => {
    if (tab === "add") {
      setFormOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSignOut = () => {
    simpleAuth.logout();
    toast.success('Logout realizado com sucesso!');
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <SummaryCards {...totals} />
            
            {settings?.monthlyBudgetGoal && settings.monthlyBudgetGoal > 0 && (
              <Card className="bg-slate-900/40 border-slate-800 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-rose-500/20"></div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta de Gastos</CardTitle>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded leading-none">
                      {Math.round((budgetProgress || 0))}% UTILIZADO
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-2">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-2xl font-black text-slate-200 tracking-tight">
                      {formatCurrency(totals.expenses)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      LIMITE: {formatCurrency(settings.monthly_budget_goal || 0)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Progress value={budgetProgress} className="gap-0">
                      <ProgressTrack className="h-1.5 bg-slate-800">
                        <ProgressIndicator className="bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-500" />
                      </ProgressTrack>
                    </Progress>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right italic opacity-60">
                    Otimize seus gastos para manter o saldo positivo
                  </p>
                </CardContent>
              </Card>
            )}

            <DashboardCharts transactions={transactions} categories={categories} />
            
            <div className="pb-6">
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Fluxo de Caixa Mensal</h3>
                <div className="h-px flex-1 bg-slate-800/50 mx-4"></div>
              </div>
              <TransactionsTable transactions={transactions.slice(0, 5)} categories={categories} />
            </div>
          </motion.div>
        );
      case "transactions":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold mb-4">Extrato Detalhado</h2>
            <TransactionsTable transactions={transactions} categories={categories} />
          </motion.div>
        );
      case "categories":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <CategoryManager />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Settings />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#05070a]/80 backdrop-blur-md">
        <div className="container mx-auto max-w-lg px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Snowflake className="w-6 h-6 text-white relative z-10 transition-transform group-hover:rotate-45" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white flex flex-col leading-none">
              <span className="text-sky-400 text-[10px] tracking-[0.3em] font-black mb-1">LK</span>
              <span className="text-white">FINANÇAS</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right">
              {format(new Date(), "EE, d MMM", { locale: ptBR })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-lg px-4 pt-6 pb-32">
        <div className="mb-8">
          <MonthSelector currentMonth={selectedMonth} onChange={setSelectedMonth} />
        </div>
        
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>

        {activeTab === "dashboard" && (
           <footer className="mt-12 bg-sky-500/5 border border-sky-500/20 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
              <p className="text-xs text-sky-200/80 leading-relaxed">
                <span className="font-bold text-sky-400">SYNC:</span> Seus dados ficam salvos na nuvem. Acesse de qualquer dispositivo e compartilhe com sua equipe.
              </p>
            </div>
          </footer>
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} />
      <TransactionForm open={formOpen} onOpenChange={setFormOpen} />
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
