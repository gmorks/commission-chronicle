import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useCommissionStore from "@/lib/commission-store";
import { toPng } from 'html-to-image';
import { MonthCreation } from "@/components/commission/MonthCreation";
import { MonthSelector } from "@/components/commission/MonthSelector";
import { EntryForm } from "@/components/commission/EntryForm";
import { EntriesList } from "@/components/commission/EntriesList";

const Index = () => {
  const { toast } = useToast();
  const { 
    currentMonth, 
    months, 
    createNewMonth, 
    addEntry, 
    editEntry, 
    deleteEntry, 
    loadMonth 
  } = useCommissionStore();
  
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
    if (!currentMonth) {
      toast({
        title: "Error",
        description: "Please select or create a month first",
        variant: "destructive",
      });
      return;
    }
    
    if (editingEntry) {
      editEntry(editingEntry, entry);
      setEditingEntry(null);
      setEditingValues(null);
      toast({
        title: "Success",
        description: "Entry updated successfully",
      });
    } else {
      addEntry(entry);
      toast({
        title: "Success",
        description: "Entry added successfully",
      });
    }
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId);
    toast({
      title: "Success",
      description: "Entry deleted successfully",
    });
  };

  const exportAsText = () => {
    if (!currentMonth) return;
    
    let text = `Commission Report - ${currentMonth.month} ${currentMonth.year}\n\n`;
    
    currentMonth.entries.forEach((entry, index) => {
      text += `${index + 1}. ${entry.bookName}\n`;
      text += `   Volumes: ${entry.volumes}\n`;
      text += `   Files: ${entry.filesGenerated}\n\n`;
    });
    
    text += `\nMonth Total: $${currentMonth.totalAmount}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${currentMonth.month}-${currentMonth.year}-commissions.txt`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Text report exported successfully",
    });
  };

  const exportAsPng = async () => {
    if (!currentMonth) return;
    
    try {
      const exportDiv = document.createElement('div');
      exportDiv.className = 'p-6 bg-white';
      exportDiv.style.width = '512px';
      
      let content = `<h2 class="text-xl font-semibold mb-4">Commission Report - ${currentMonth.month} ${currentMonth.year}</h2>`;
      
      currentMonth.entries.forEach((entry, index) => {
        content += `
          <div class="mb-4">
            <p class="font-medium">${index + 1}. ${entry.bookName}</p>
            <p class="ml-4">Volumes: ${entry.volumes}</p>
            <p class="ml-4">Files: ${entry.filesGenerated}</p>
          </div>
        `;
      });
      
      content += `<p class="text-lg font-semibold mt-4">Month Total: $${currentMonth.totalAmount}</p>`;
      
      exportDiv.innerHTML = content;
      document.body.appendChild(exportDiv);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(exportDiv, {
        width: 512,
        height: exportDiv.offsetHeight,
        pixelRatio: 1,
        quality: 1,
        style: {
          transform: 'scale(1)',
        },
      });
      
      document.body.removeChild(exportDiv);
      
      const link = document.createElement('a');
      link.download = `${currentMonth.month}-${currentMonth.year}-commissions.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "Month exported as PNG",
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Error",
        description: "Failed to export as PNG",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Commission Tracker</h1>
      
      <div className="grid gap-8">
        <MonthCreation createNewMonth={createNewMonth} />
        <MonthSelector 
          months={months} 
          currentMonth={currentMonth} 
          onMonthSelect={loadMonth} 
        />

        {currentMonth && (
          <>
            <EntryForm 
              onSubmit={handleSubmit}
              editingEntry={editingEntry}
              initialValues={editingValues}
            />
            <EntriesList
              currentMonth={currentMonth}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExportText={exportAsText}
              onExportPng={exportAsPng}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;