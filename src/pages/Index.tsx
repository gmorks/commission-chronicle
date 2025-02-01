import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import useCommissionStore from "@/lib/commission-store";
import { toPng } from 'html-to-image';
import { MonthCreation } from "@/components/commission/MonthCreation";
import { MonthSelector } from "@/components/commission/MonthSelector";
import { Header } from "@/components/commission/Header";
import { EditManager } from "@/components/commission/EditManager";
import { Search } from "@/components/commission/Search";

const Index = () => {
  console.log("Index component rendering");

  const { toast } = useToast();
  const {
    currentMonth,
    months,
    createNewMonth,
    addEntry,
    editEntry,
    deleteEntry,
    loadMonth,
    exportToJson,
    importFromJson
  } = useCommissionStore();

  console.log("Current month:", currentMonth);
  console.log("Available months:", months);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importFromJson(file);
      toast({
        title: "Éxito",
        description: "Datos importados correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al importar datos. Por favor, verifica el formato del archivo.",
        variant: "destructive",
      });
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSubmit = (entry: any) => {
    if (!currentMonth) {
      toast({
        title: "Error",
        description: "Por favor selecciona o crea un mes primero",
        variant: "destructive",
      });
      return;
    }

    if (entry.id) {
      editEntry(entry.id, entry);
      toast({
        title: "Éxito",
        description: "Entrada actualizada correctamente",
      });
    } else {
      addEntry(entry);
      toast({
        title: "Éxito",
        description: "Entrada agregada correctamente",
      });
    }
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId);
    toast({
      title: "Éxito",
      description: "Entrada eliminada correctamente",
    });
  };

  const exportAsText = () => {
    if (!currentMonth) return;

    let text = `Informe de Comisiones - ${currentMonth.month} ${currentMonth.year}\n\n`;

    currentMonth.entries.forEach((entry, index) => {
      text += `${index + 1}. ${entry.bookName}\n`;
      text += `   Volúmenes: ${entry.volumes}\n`;
      text += `   Archivos: ${entry.filesGenerated}\n\n`;
    });

    text += `\nTotal del Mes: $${currentMonth.totalAmount}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${currentMonth.month}-${currentMonth.year}-comisiones.txt`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "Éxito",
      description: "Informe de texto exportado correctamente",
    });
  };

  const exportAsPng = async () => {
    if (!currentMonth) return;

    try {
      const exportDiv = document.createElement('div');
      exportDiv.className = 'p-6 bg-white';
      exportDiv.style.width = '512px';

      let content = `<h1 class="text-lg font-semibold mb-4">Comisiones Spiral - ${currentMonth.month} ${currentMonth.year}</h1>`;

      currentMonth.entries.forEach((entry, index) => {
        content += `
          <div class="mb-4" style="border: 1px solid #ccc; padding: 8px; margin: -1px 0;">
            <p class="font-medium">${index + 1}. ${entry.bookName}</p>
            <p class="ml-4">Volúmenes: ${entry.volumes}</p>
            <p class="ml-4">Archivos: ${entry.filesGenerated}</p>
          </div>
        `;
      });

      content += `<h2 class="text-xl font-semibold mt-4">Total del Mes: $${currentMonth.totalAmount}</h2>`;

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
      link.download = `${currentMonth.month}-${currentMonth.year}-comisiones.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Éxito",
        description: "Informe exportado como PNG correctamente",
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Error",
        description: "Error al exportar como PNG",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">


      <div className="grid gap-8">
        <Search months={months} onMonthSelect={loadMonth} />
        <MonthCreation createNewMonth={createNewMonth} />
        <MonthSelector
          months={months}
          currentMonth={currentMonth}
          onMonthSelect={loadMonth}
        />

        <EditManager
          currentMonth={currentMonth}
          onSubmit={handleSubmit}
          onEdit={editEntry}
          onDelete={handleDelete}
          onExportText={exportAsText}
          onExportPng={exportAsPng}
        />
      </div>
      <Header onExport={exportToJson} onImport={handleImport} />
    </div>
  );
};

export default Index;