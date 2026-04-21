import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
}

export function SummaryCards({ income, expenses, balance }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-900/40 border-slate-800 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-emerald-500/20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Ganhos</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-bold text-emerald-400">{formatCurrency(income)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/40 border-slate-800 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-rose-500/20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Gastos</CardTitle>
            <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-bold text-rose-400">{formatCurrency(expenses)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-indigo-600 rounded-2xl border-none relative overflow-hidden shadow-xl shadow-indigo-600/20 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-transparent to-indigo-900/40 transition-opacity group-hover:opacity-80"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2 relative z-10">
          <CardTitle className="text-xs font-semibold text-indigo-100/70 uppercase tracking-widest">Saldo Disponível</CardTitle>
          <Wallet className="h-4 w-4 text-indigo-200/60" />
        </CardHeader>
        <CardContent className="p-6 pt-0 relative z-10">
          <div className="text-4xl font-bold text-white tracking-tight">{formatCurrency(balance)}</div>
          <div className="mt-4 flex items-center justify-between text-indigo-100/50 text-[10px] font-bold uppercase tracking-wider">
            <span>Saldo Consolidado</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
              <span>Ativo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
