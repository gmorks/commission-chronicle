import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MonthData } from "@/lib/commission-store";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResultsProps {
  results: {
    monthId: string;
    monthName: string;
    year: number;
    entries: {
      bookName: string;
      volumes: string;
    }[];
  }[];
  onMonthSelect: (monthId: string) => void;
}

export const SearchResults = ({ results, onMonthSelect }: SearchResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Search Results</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.monthId} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">
                  {result.monthName} {result.year}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMonthSelect(result.monthId)}
                >
                  Go to Month
                </Button>
              </div>
              <div className="space-y-2">
                {result.entries.map((entry, index) => (
                  <div key={index} className="text-sm">
                    {entry.bookName} (Volumes: {entry.volumes})
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};