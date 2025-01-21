import { useState } from "react";
import { EntryForm } from "./EntryForm";
import { EntriesList } from "./EntriesList";
import type { MonthData } from "@/lib/commission-store";
import type { CommissionEntry } from "@/lib/commission-store";

interface EditManagerProps {
  currentMonth: MonthData | null;
  onSubmit: (entry: Omit<CommissionEntry, 'id'>) => void;
  onEdit: (entryId: string, updatedEntry: Omit<CommissionEntry, 'id'>) => void;
  onDelete: (entryId: string) => void;
  onExportText: () => void;
  onExportPng: () => void;
}

export const EditManager = ({
  currentMonth,
  onSubmit,
  onEdit,
  onDelete,
  onExportText,
  onExportPng
}: EditManagerProps) => {
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<any>(null);

  const handleEdit = (entryId: string) => {
    const entry = currentMonth?.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    setEditingEntry(entryId);
    setEditingValues({
      bookName: entry.bookName,
      volumes: entry.volumes,
      filesGenerated: entry.filesGenerated,
      pricePerFile: entry.pricePerFile,
    });
  };

  const handleSubmit = (entry: any) => {
    if (editingEntry) {
      onEdit(editingEntry, entry);
    } else {
      onSubmit(entry);
    }
    setEditingEntry(null);
    setEditingValues(null);
  };

  return currentMonth ? (
    <>
      <EntryForm 
        onSubmit={handleSubmit}
        editingEntry={editingEntry}
        initialValues={editingValues}
      />
      <EntriesList
        currentMonth={currentMonth}
        onEdit={handleEdit}
        onDelete={onDelete}
        onExportText={onExportText}
        onExportPng={onExportPng}
      />
    </>
  ) : null;
};