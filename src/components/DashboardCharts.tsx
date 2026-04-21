import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Category } from "@/types";

interface DashboardChartsProps {
  transactions: Transaction[];
  categories: Category[];
}

export function DashboardCharts({ transactions, categories }: DashboardChartsProps) {
  // Expenses by category
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc: any, t) => {
      const category = categories.find(c => c.id === t.categoryId);
      const name = category?.name || 'Outros';
      acc[name] = (acc[name] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  // Income vs Expenses
  const comparisonData = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return [
      { name: 'Ganhos', value: totalIncome },
      { name: 'Gastos', value: totalExpense },
    ];
  }, [transactions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#0891b2'];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">Gastos por Categoria</CardTitle>
          <CardDescription className="text-xs text-slate-500">Distribuição no período selecionado</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pt-0">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-full">
                <PieChart className="h-5 w-5 opacity-20" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest italic opacity-50">Nenhum gasto registrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest">Ganhos vs Gastos</CardTitle>
          <CardDescription className="text-xs text-slate-500">Comparativo financeiro mensal</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
