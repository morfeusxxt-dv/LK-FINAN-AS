import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn, formatCurrency, parseBRCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dbService } from "../lib/supabase-db";
import { Transaction, Category } from "../lib/supabase-types";
import { toast } from "sonner";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TransactionForm({ open, onOpenChange, onSuccess }: TransactionFormProps) {
  const ADMIN_ID = '00000000-0000-0000-0000-000000000000';
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    dbService.getCategories(ADMIN_ID).then(setCategories).catch(console.error);
  }, []);
  
  const form = useForm({
    defaultValues: {
      type: "expense",
      amount: "",
      categoryId: "",
      description: "",
      date: new Date(),
    },
  });

  const transactionType = form.watch("type");
  const filteredCategories = categories.filter(c => c.type === transactionType);

  // Reset categoryId when type changes
  React.useEffect(() => {
    form.setValue("categoryId", "");
  }, [transactionType, form]);

  const onSubmit = async (values: any) => {
    try {
      const transaction: Omit<Transaction, 'id' | 'created_at'> = {
        type: values.type as any,
        amount: parseBRCurrency(values.amount),
        category_id: parseInt(values.categoryId),
        description: values.description,
        date: values.date.toISOString(),
        month_year: format(values.date, "yyyy-MM"),
        user_id: ADMIN_ID,
      };

      await dbService.createTransaction(transaction);
      toast.success("Transação salva com sucesso!");
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar a transação.");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Nova Transação</DrawerTitle>
            <DrawerDescription>Registre seus ganhos ou gastos.</DrawerDescription>
          </DrawerHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">Gasto</SelectItem>
                        <SelectItem value="income">Ganho</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numeric = value.replace(/\D/g, "");
                          const formatted = formatCurrency(Number(numeric) / 100);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id?.toString() || ""}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter className="px-0 pt-6">
                <Button type="submit">Salvar Transação</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
