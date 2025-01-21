import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MonthData } from "@/lib/commission-store";

interface MonthSelectorProps {
  months: MonthData[];
  currentMonth: MonthData | null;
  onMonthSelect: (monthId: string) => void;
}

export const MonthSelector = ({ months, currentMonth, onMonthSelect }: MonthSelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Seleccionar Mes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {months.map((month) => (
          <Button
            key={month.id}
            variant={currentMonth?.id === month.id ? "default" : "outline"}
            onClick={() => onMonthSelect(month.id)}
          >
            {month.month} {month.year}
          </Button>
        ))}
      </div>
    </Card>
  );
};