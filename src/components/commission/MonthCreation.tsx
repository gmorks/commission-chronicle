import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface MonthCreationProps {
  createNewMonth: (month: string, year: number) => void;
}

export const MonthCreation = ({ createNewMonth }: MonthCreationProps) => {
  const { toast } = useToast();
  const [newMonthData, setNewMonthData] = useState({
    month: "",
    year: new Date().getFullYear(),
  });

  const handleCreateMonth = () => {
    if (!newMonthData.month) {
      toast({
        title: "Error",
        description: "Por favor, ingresa el nombre del mes",
        variant: "destructive",
      });
      return;
    }
    createNewMonth(newMonthData.month, newMonthData.year);
    toast({
      title: "Éxito",
      description: "Nuevo mes creado",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Crear Nuevo Mes</h2>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="month">Mes</Label>
            <Input
              id="month"
              value={newMonthData.month}
              onChange={(e) => setNewMonthData(prev => ({ ...prev, month: e.target.value }))}
              placeholder="Ingresa el nombre del mes"
            />
          </div>
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              value={newMonthData.year}
              onChange={(e) => setNewMonthData(prev => ({ ...prev, year: Number(e.target.value) }))}
            />
          </div>
        </div>
        <Button onClick={handleCreateMonth}>Crear Nuevo Mes</Button>
      </div>
    </Card>
  );
};