import { LayoutDashboard, ReceiptText, Settings, PlusCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const items = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'transactions', label: 'Extrato', icon: ReceiptText },
    { id: 'add', label: 'Novo', icon: PlusCircle, primary: true },
    { id: 'categories', label: 'Categorias', icon: Bookmark },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#05070a]/90 backdrop-blur-xl border-t border-slate-800 pb-safe">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.primary) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center -mt-10"
              >
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/40 border border-indigo-400/20 active:scale-90 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <span className="text-[10px] mt-2 font-bold text-indigo-400 uppercase tracking-widest leading-none">Novo</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-all group",
                isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive ? "bg-slate-800 shadow-inner" : "group-hover:bg-slate-900"
              )}>
                <Icon className={cn("h-5 w-5", isActive && "text-indigo-400")} />
              </div>
              <span className={cn(
                "text-[9px] mt-1 font-bold uppercase tracking-widest leading-none transition-opacity",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
