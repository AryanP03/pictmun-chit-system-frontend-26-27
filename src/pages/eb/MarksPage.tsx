import { useState, useMemo } from "react";
import { Loading } from "../../components/Loading";
import { useGetAllChitMarks } from "../../hooks/useGetAllChitMarks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortField = "portfolio" | "totalMessages" | "totalScore";
type SortDirection = "asc" | "desc" | "none";

interface ChitMark {
  delegateId: string;
  portfolio: string;
  username: string;
  totalMessages: number;
  totalScore: number;
}

const MarksPage = () => {
  const { chitMarks, loading } = useGetAllChitMarks();
  const [sortField, setSortField] = useState<SortField>("totalScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: desc -> asc -> none -> desc
      setSortDirection((prev) =>
        prev === "desc" ? "asc" : prev === "asc" ? "none" : "desc"
      );
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedChits = useMemo(() => {
    if (!chitMarks || sortDirection === "none") return chitMarks;

    return [...chitMarks].sort((a: ChitMark, b: ChitMark) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "portfolio":
          aValue = a.portfolio.toLowerCase();
          bValue = b.portfolio.toLowerCase();
          break;
        case "totalMessages":
          aValue = a.totalMessages;
          bValue = b.totalMessages;
          break;
        case "totalScore":
          aValue = a.totalScore;
          bValue = b.totalScore;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [chitMarks, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  if (loading) {
    return <Loading classes="w-full h-full" />;
  }

  return (
    <div className="w-full p-5">
      <h2 className="text-2xl md:text-3xl mb-1 font-semibold">
        Delegate Scores
      </h2>
      <p className="text-muted-foreground text-sm mb-5">
        There are {chitMarks?.length} delegates in the committee.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort("portfolio")}
                >
                  Portfolio
                  {getSortIcon("portfolio")}
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort("totalMessages")}
                >
                  Number of Chits
                  {getSortIcon("totalMessages")}
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-foreground hover:bg-transparent"
                  onClick={() => handleSort("totalScore")}
                >
                  Score
                  {getSortIcon("totalScore")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedChits?.map((chitMark: ChitMark, index: number) => (
              <TableRow
                key={chitMark.delegateId}
                className={`${
                  index % 2 === 0 ? "bg-muted/25" : "bg-background"
                } hover:bg-muted/50 transition-colors`}
              >
                <TableCell className="text-base font-medium">
                  {chitMark.portfolio}
                </TableCell>
                <TableCell className="text-base">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {chitMark.totalMessages}
                  </span>
                </TableCell>
                <TableCell className="text-base">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-semibold">
                    {chitMark.totalScore}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sort status indicator */}
      <div className="mt-4 text-sm text-muted-foreground">
        {sortDirection !== "none" && (
          <p>
            Sorted by{" "}
            <span className="font-medium">
              {sortField.replace(/([A-Z])/g, " $1").toLowerCase()}
            </span>{" "}
            ({sortDirection === "asc" ? "ascending" : "descending"}){" • "}Click
            column headers to change sorting
          </p>
        )}
        {sortDirection === "none" && (
          <p>Click column headers to sort the data</p>
        )}
      </div>
    </div>
  );
};

export default MarksPage;
