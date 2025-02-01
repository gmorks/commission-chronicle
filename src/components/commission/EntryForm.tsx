import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { CommissionEntry } from "@/lib/commission-store";

interface EntryFormProps {
  onSubmit: (entry: Omit<CommissionEntry, 'id'>) => void;
  editingEntry: string | null;
  initialValues?: {
    bookName: string;
    volumes: string;
    filesGenerated: number;
    pricePerFile: number;
  };
}

export const EntryForm = ({ onSubmit, editingEntry, initialValues }: EntryFormProps) => {
  const { toast } = useToast();
  const [newEntry, setNewEntry] = useState(initialValues || {
    bookName: "",
    volumes: "",
    filesGenerated: 0,
    pricePerFile: 150,
  });

  const handleSubmit = () => {
    if (!newEntry.bookName) {
      toast({
        title: "Error",
        description: "Por favor, ingresa el nombre del libro",
        variant: "destructive",
      });
      return;
    }
    
    const totalPrice = newEntry.filesGenerated * newEntry.pricePerFile;
    onSubmit({ ...newEntry, totalPrice });
    
    setNewEntry({
      bookName: "",
      volumes: "",
      filesGenerated: 0,
      pricePerFile: 150,
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingEntry ? "Editar Entrada" : "Agregar Nueva Entrada"}
      </h2>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="bookName">Nombre del Libro</Label>
          <Input
            id="bookName"
            value={newEntry.bookName}
            onChange={(e) => setNewEntry(prev => ({ ...prev, bookName: e.target.value }))}
            placeholder="Ingresa el nombre del libro"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="volumes">Volúmenes</Label>
            <Input
              id="volumes"
              type="text"
              value={newEntry.volumes}
              onChange={(e) => setNewEntry(prev => ({ ...prev, volumes: e.target.value }))}
              placeholder="ej., 01-5"
            />
          </div>
          <div>
            <Label htmlFor="filesGenerated">Archivos Generados</Label>
            <Input
              id="filesGenerated"
              type="number"
              value={newEntry.filesGenerated}
              onChange={(e) => setNewEntry(prev => ({ ...prev, filesGenerated: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="pricePerFile">Precio por Archivo</Label>
            <Input
              id="pricePerFile"
              placeholder="150"
              type="number"
              value={newEntry.pricePerFile}
              onChange={(e) => setNewEntry(prev => ({ ...prev, pricePerFile: Number(e.target.value) }))}
            />
          </div>
        </div>
        <Button onClick={handleSubmit}>
          {editingEntry ? "Actualizar Entrada" : "Agregar Entrada"}
        </Button>
      </div>
    </Card>
  );
};