import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import type { MonthData } from "@/lib/commission-store";

interface EntriesListProps {
  currentMonth: MonthData;
  onEdit: (entryId: string) => void;
  onDelete: (entryId: string) => void;
  onExportText: () => void;
  onExportPng: () => void;
}

export const EntriesList = ({ 
  currentMonth, 
  onEdit, 
  onDelete,
  onExportText,
  onExportPng
}: EntriesListProps) => {
  return (
    <Card className="p-6" id="export-section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {currentMonth.month} {currentMonth.year}
        </h2>
        <div className="flex gap-2">
          <Button onClick={onExportText}>Exportar como Texto</Button>
          <Button onClick={onExportPng}>Exportar como PNG</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {currentMonth.entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <Label>Nombre del Libro</Label>
                  <p className="font-medium">{entry.bookName}</p>
                </div>
                <div className="text-right">
                  <Label>Total</Label>
                  <p className="font-medium text-lg">${entry.totalPrice}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Volúmenes</Label>
                  <p className="font-medium">{entry.volumes}</p>
                </div>
                <div>
                  <Label>Archivos</Label>
                  <p className="font-medium">{entry.filesGenerated}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(entry.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">
            Total del Mes: ${currentMonth.totalAmount}
          </p>
        </div>
      </div>
    </Card>
  );
};