import { Transaction, Category } from "../lib/supabase-types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency, cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { dbService } from "../lib/supabase-db";
import { toast } from "sonner";

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  onSuccess?: () => void;
}

export function TransactionsTable({ transactions, categories, onSuccess }: TransactionsTableProps) {
  const ADMIN_ID = '00000000-0000-0000-0000-000000000000';
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(c => c.id === t.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categories, searchTerm]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      await dbService.deleteTransaction(id, ADMIN_ID);
      toast.success("Transação excluída.");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        <Input
          type="search"
          placeholder="Buscar transações..."
          className="pl-9 bg-slate-950/50 border-slate-800 rounded-xl text-sm placeholder:text-slate-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-4">Data</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-4">Categoria</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-4 text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => {
                const category = categories.find(c => c.id === t.categoryId);
                return (
                  <TableRow key={t.id} className="border-slate-800/40 hover:bg-slate-800/20 transition-colors group">
                    <TableCell className="px-4 py-4 border-none">
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-300">
                        {format(t.date, "dd MMM", { locale: ptBR })}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 border-none">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                          {category?.name || "Outros"}
                        </span>
                        {t.description && (
                          <span className="text-[10px] text-slate-500 font-medium line-clamp-1 italic">
                            {t.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 border-none text-right">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-sm font-black tracking-tight",
                          t.type === 'income' ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {t.type === 'income' ? "+" : "-"}{formatCurrency(t.amount)}
                        </span>
                        <div className="flex items-center gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                           <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            onClick={() => handleDelete(t.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 border-none">
                   <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-full mb-2">
                      <Search className="h-5 w-5 text-slate-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 italic">Nenhuma transação encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
