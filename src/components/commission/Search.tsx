import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "./SearchResults";
import type { MonthData } from "@/lib/commission-store";

interface SearchProps {
  months: MonthData[];
  onMonthSelect: (monthId: string) => void;
}

export const Search = ({ months, onMonthSelect }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = searchTerm
    ? months
        .map((month) => {
          const matchingEntries = month.entries.filter((entry) =>
            entry.bookName.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (matchingEntries.length === 0) return null;

          return {
            monthId: month.id,
            monthName: month.month,
            year: month.year,
            entries: matchingEntries.map((entry) => ({
              bookName: entry.bookName,
              volumes: entry.volumes,
            })),
          };
        })
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-4 text-card-foreground">
      <h2 className="text-xl font-semibold mb-4">Buscar comisión por nombre</h2>
      <Input
        type="search"
        placeholder="Buscar comisión por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchResults results={searchResults} onMonthSelect={onMonthSelect} />
    </div>
  );
};