import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";

interface HeaderProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header = ({ onExport, onImport }: HeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Registro de Comisiones</h1>
      
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={onExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Datos
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Importar Datos
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImport}
          accept=".json"
          className="hidden"
        />
      </div>
    </>
  );
};