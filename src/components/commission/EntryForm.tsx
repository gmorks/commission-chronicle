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
    pricePerFile: 0,
  });

  const handleSubmit = () => {
    if (!newEntry.bookName) {
      toast({
        title: "Error",
        description: "Please enter a book name",
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
      pricePerFile: 0,
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingEntry ? "Edit Entry" : "Add New Entry"}
      </h2>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="bookName">Book Name</Label>
          <Input
            id="bookName"
            value={newEntry.bookName}
            onChange={(e) => setNewEntry(prev => ({ ...prev, bookName: e.target.value }))}
            placeholder="Enter book name"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="volumes">Volumes</Label>
            <Input
              id="volumes"
              type="text"
              value={newEntry.volumes}
              onChange={(e) => setNewEntry(prev => ({ ...prev, volumes: e.target.value }))}
              placeholder="e.g., 01-5"
            />
          </div>
          <div>
            <Label htmlFor="filesGenerated">Files Generated</Label>
            <Input
              id="filesGenerated"
              type="number"
              value={newEntry.filesGenerated}
              onChange={(e) => setNewEntry(prev => ({ ...prev, filesGenerated: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="pricePerFile">Price per File</Label>
            <Input
              id="pricePerFile"
              type="number"
              value={newEntry.pricePerFile}
              onChange={(e) => setNewEntry(prev => ({ ...prev, pricePerFile: Number(e.target.value) }))}
            />
          </div>
        </div>
        <Button onClick={handleSubmit}>
          {editingEntry ? "Update Entry" : "Add Entry"}
        </Button>
      </div>
    </Card>
  );
};