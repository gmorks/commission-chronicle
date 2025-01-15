import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import useCommissionStore from "@/lib/commission-store";
import { toPng } from 'html-to-image';
import { Pencil, Trash2 } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const { currentMonth, months, createNewMonth, addEntry, editEntry, deleteEntry, loadMonth } = useCommissionStore();
  
  const [newEntry, setNewEntry] = useState({
    bookName: "",
    volumes: "",
    filesGenerated: 0,
    pricePerFile: 0,
  });

  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  
  const [newMonthData, setNewMonthData] = useState({
    month: "",
    year: new Date().getFullYear(),
  });

  const handleCreateMonth = () => {
    if (!newMonthData.month) {
      toast({
        title: "Error",
        description: "Please enter a month name",
        variant: "destructive",
      });
      return;
    }
    createNewMonth(newMonthData.month, newMonthData.year);
    toast({
      title: "Success",
      description: "New month created",
    });
  };

  const handleAddOrUpdateEntry = () => {
    if (!currentMonth) {
      toast({
        title: "Error",
        description: "Please select or create a month first",
        variant: "destructive",
      });
      return;
    }
    
    const totalPrice = newEntry.filesGenerated * newEntry.pricePerFile;
    
    if (editingEntry) {
      editEntry(editingEntry, { ...newEntry, totalPrice });
      setEditingEntry(null);
      toast({
        title: "Success",
        description: "Entry updated successfully",
      });
    } else {
      addEntry({ ...newEntry, totalPrice });
      toast({
        title: "Success",
        description: "Entry added successfully",
      });
    }
    
    setNewEntry({
      bookName: "",
      volumes: "",
      filesGenerated: 0,
      pricePerFile: 0,
    });
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry.id);
    setNewEntry({
      bookName: entry.bookName,
      volumes: entry.volumes,
      filesGenerated: entry.filesGenerated,
      pricePerFile: entry.pricePerFile,
    });
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId);
    toast({
      title: "Success",
      description: "Entry deleted successfully",
    });
  };

  const exportAsPng = async () => {
    if (!currentMonth) return;
    
    const element = document.getElementById('export-section');
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, {
        width: 512,
        height: Math.round((512 * element.offsetHeight) / element.offsetWidth),
      });
      const link = document.createElement('a');
      link.download = `${currentMonth.month}-${currentMonth.year}-commissions.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "Month exported as PNG",
      });
    } catch (err) {
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
        {/* Month Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Month</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  value={newMonthData.month}
                  onChange={(e) => setNewMonthData(prev => ({ ...prev, month: e.target.value }))}
                  placeholder="Enter month name"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newMonthData.year}
                  onChange={(e) => setNewMonthData(prev => ({ ...prev, year: Number(e.target.value) }))}
                />
              </div>
            </div>
            <Button onClick={handleCreateMonth}>Create New Month</Button>
          </div>
        </Card>

        {/* Month Navigation */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Month</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {months.map((month) => (
              <Button
                key={month.id}
                variant={currentMonth?.id === month.id ? "default" : "outline"}
                onClick={() => loadMonth(month.id)}
              >
                {month.month} {month.year}
              </Button>
            ))}
          </div>
        </Card>

        {currentMonth && (
          <>
            {/* New Entry Form */}
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
                <Button onClick={handleAddOrUpdateEntry}>
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </Button>
              </div>
            </Card>

            {/* Current Month Display */}
            <Card className="p-6" id="export-section">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentMonth.month} {currentMonth.year}
                </h2>
                <Button onClick={exportAsPng}>Export as PNG</Button>
              </div>
              
              <div className="space-y-4">
                {currentMonth.entries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Book Name</Label>
                        <p className="font-medium">{entry.bookName}</p>
                      </div>
                      <div>
                        <Label>Volumes</Label>
                        <p className="font-medium">{entry.volumes}</p>
                      </div>
                      <div>
                        <Label>Files</Label>
                        <p className="font-medium">{entry.filesGenerated}</p>
                      </div>
                      <div>
                        <Label>Total</Label>
                        <p className="font-medium">${entry.totalPrice}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">
                    Month Total: ${currentMonth.totalAmount}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;