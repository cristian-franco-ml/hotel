import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export interface DashboardSummaryProps {
  avgPrice: number;
  hotelsWithChange: number;
  cheapestHotel: { name: string; price: number };
  mostExpensiveHotel: { name: string; price: number };
}

export function DashboardSummary({ avgPrice, hotelsWithChange, cheapestHotel, mostExpensiveHotel }: DashboardSummaryProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Precio promedio */}
        <Card className="relative bg-card p-2 flex flex-col items-center justify-center">
          <CardContent className="py-2 flex flex-col items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Precio promedio</div>
            <div className="text-2xl font-bold text-primary">${avgPrice.toFixed(0)}</div>
          </CardContent>
        </Card>
        {/* Hoteles con cambio de precio */}
        <Card className="relative bg-card p-2 flex flex-col items-center justify-center">
          <CardContent className="py-2 flex flex-col items-center justify-center">
            <TrendingUp className="w-6 h-6 text-muted-foreground mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Hoteles con cambio de precio</div>
            <div className="text-2xl font-bold text-primary">{hotelsWithChange}</div>
          </CardContent>
        </Card>
        {/* Hotel más barato */}
        <Card className="relative bg-green-50 dark:bg-green-900/30 p-2 flex flex-col items-center justify-center">
          <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">más barato</span>
          <CardContent className="py-2 flex flex-col items-center justify-center">
            <ArrowDownCircle className="w-6 h-6 text-green-600 mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Hotel más barato</div>
            <div className="text-base font-bold text-green-700 dark:text-green-300">{cheapestHotel.name}</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">${cheapestHotel.price.toFixed(0)}</div>
          </CardContent>
        </Card>
        {/* Hotel más caro */}
        <Card className="relative bg-red-50 dark:bg-red-900/30 p-2 flex flex-col items-center justify-center">
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">más caro</span>
          <CardContent className="py-2 flex flex-col items-center justify-center">
            <ArrowUpCircle className="w-6 h-6 text-red-600 mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Hotel más caro</div>
            <div className="text-base font-bold text-red-700 dark:text-red-300">{mostExpensiveHotel.name}</div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">${mostExpensiveHotel.price.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 