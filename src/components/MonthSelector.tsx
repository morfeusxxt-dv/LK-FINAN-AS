import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  currentMonth: Date;
  onChange: (date: Date) => void;
}

export function MonthSelector({ currentMonth, onChange }: MonthSelectorProps) {
  const nextMonth = () => onChange(addMonths(currentMonth, 1));
  const prevMonth = () => onChange(subMonths(currentMonth, 1));

  return (
    <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-full p-1.5 overflow-hidden shadow-inner">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={prevMonth}
        className="h-9 w-9 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/80 rounded-full shadow-lg border border-slate-700/50">
        <CalendarDays className="h-3.5 w-3.5 text-indigo-400" />
        <span className="font-bold text-sm tracking-tight text-white capitalize whitespace-nowrap">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={nextMonth}
        className="h-9 w-9 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
