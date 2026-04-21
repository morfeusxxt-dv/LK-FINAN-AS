import React, { useState, useEffect } from "react";
import { Download, Upload, Trash2, AlertTriangle, ShieldCheck, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dbService } from "../lib/supabase-db";
import { toast } from "sonner";
import { formatCurrency, parseBRCurrency } from "@/lib/utils";
import type { AppSettings } from "../lib/supabase-types";

export function Settings() {
  const ADMIN_ID = '00000000-0000-0000-0000-000000000000';
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [budgetGoal, setBudgetGoal] = useState("");

  useEffect(() => {
    dbService.getSettings(ADMIN_ID).then(setSettings).catch(console.error);
  }, []);

  const handleExport = async () => {
    try {
      const [transactions, categories, budgets, userSettings] = await Promise.all([
        dbService.getTransactions(ADMIN_ID),
        dbService.getCategories(ADMIN_ID),
        dbService.getBudgets(ADMIN_ID),
        dbService.getSettings(ADMIN_ID),
      ]);

      const data = {
        transactions,
        categories,
        budgets,
        settings: userSettings,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-financas-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Backup exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar backup.");
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.transactions || !data.categories) {
        throw new Error("Formato de arquivo inválido.");
      }

      toast.info("Importação de backup não está disponível no modo nuvem. Seus dados já estão salvos automaticamente.");
    } catch (error) {
      toast.error("Erro ao ler arquivo: " + (error as Error).message);
    }
  };

  const handleClearData = async () => {
    if (confirm("TEM CERTEZA? Isso excluirá TODOS os seus dados permanentemente da nuvem. Esta ação não pode ser desfeita.")) {
      try {
        const transactions = await dbService.getTransactions(ADMIN_ID);
        const categories = await dbService.getCategories(ADMIN_ID);
        
        await Promise.all([
          ...transactions.map(t => dbService.deleteTransaction(t.id, ADMIN_ID)),
          ...categories.map(c => dbService.deleteCategory(c.id, ADMIN_ID)),
        ]);
        
        toast.success("Todos os dados foram excluídos.");
        window.location.reload();
      } catch (error) {
        toast.error("Erro ao excluir dados.");
      }
    }
  };

  const handleSaveBudget = async () => {
    const amount = parseBRCurrency(budgetGoal);
    
    try {
      if (settings) {
        await dbService.updateSettings(ADMIN_ID, { monthly_budget_goal: amount });
      } else {
        await dbService.createSettings({
          user_id: ADMIN_ID,
          currency: 'BRL',
          theme: 'dark',
          monthly_budget_goal: amount,
        });
      }
      toast.success("Meta de gastos atualizada!");
    } catch (error) {
      toast.error("Erro ao atualizar meta.");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <Card className="border-sky-200 bg-sky-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Cloud className="h-5 w-5 text-sky-600 shrink-0" />
            <p className="text-sm text-sky-800">
              Seus dados ficam salvos <strong>na nuvem</strong> automaticamente. Acesse de qualquer dispositivo e compartilhe com sua equipe.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta de Gastos</CardTitle>
          <CardDescription>Defina quanto você pretende gastar mensalmente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="R$ 0,00"
              value={budgetGoal || (settings?.monthly_budget_goal ? formatCurrency(settings.monthly_budget_goal) : "")}
              onChange={(e) => {
                const value = e.target.value;
                const numeric = value.replace(/\D/g, "");
                setBudgetGoal(formatCurrency(Number(numeric) / 100));
              }}
            />
            <Button onClick={handleSaveBudget}>Salvar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup e Restauração</CardTitle>
          <CardDescription>Mova seus dados entre dispositivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Exportar Dados (JSON)
            </Button>
            <div className="relative">
              <Button variant="outline" className="justify-start w-full" asChild>
                <label className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" /> Importar Backup
                  <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-600">Zona de Perigo</CardTitle>
          <CardDescription>Ações irreversíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={handleClearData}>
            <Trash2 className="mr-2 h-4 w-4" /> Limpar Todos os Dados
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
