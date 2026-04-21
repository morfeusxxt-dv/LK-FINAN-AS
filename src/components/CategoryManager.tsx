import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dbService } from "../lib/supabase-db";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Category } from "../lib/supabase-types";

export function CategoryManager() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");

  useEffect(() => {
    if (!user) return;
    dbService.getCategories(user.id).then(setCategories).catch(console.error);
  }, [user]);

  const handleAdd = async () => {
    if (!newName.trim() || !user) return;
    
    try {
      await dbService.createCategory({
        name: newName,
        type: newType,
        color: newType === 'income' ? '#10b981' : '#ef4444',
        user_id: user.id,
      });
      setNewName("");
      toast.success("Categoria adicionada!");
    } catch (error) {
      toast.error("Erro ao adicionar categoria.");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !user) return;
    
    // Check if category is used in transactions
    const transactions = await dbService.getTransactions(user.id);
    const count = transactions.filter(t => t.category_id === id).length;
    if (count > 0) {
      toast.error("Esta categoria não pode ser excluída pois possui transações vinculadas.");
      return;
    }

    if (confirm("Deseja excluir esta categoria?")) {
      await dbService.deleteCategory(id, user.id);
      toast.success("Categoria removida.");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Nova Categoria</CardTitle>
          <CardDescription>Adicione categorias personalizadas para organizar melhor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <Input 
                placeholder="Nome da categoria" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <Select value={newType} onValueChange={(val: any) => setNewType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Gasto</SelectItem>
                <SelectItem value="income">Ganho</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="font-semibold px-1">Ganhos</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.filter(c => c.type === 'income').map(category => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleDelete(category.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <h3 className="font-semibold px-1 mt-4">Gastos</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.filter(c => c.type === 'expense').map(category => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleDelete(category.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
