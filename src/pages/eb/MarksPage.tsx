import { useState, useMemo } from "react";
import { Loading } from "../../components/Loading";
import { useGetAllChitMarks } from "../../hooks/useGetAllChitMarks";
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
    <div className="p-5 sm:p-6 w-full h-full max-h-full flex flex-col min-h-0 overflow-hidden bg-background">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl md:text-3xl mb-1 font-semibold tracking-tight text-foreground">
          Delegate Scores
        </h2>
        <p className="text-muted-foreground text-sm">
          There are {chitMarks?.length || 0} delegates in the committee.
        </p>
      </div>

      {/* Scrollable table container with full vertical scrollbar */}
      <div
        id="marks-table-container"
        data-testid="marks-table-container"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-xl border border-border bg-[#0B2B26]/30 shadow-inner relative"
      >
        <table className="w-full text-left text-sm border-collapse min-w-[500px]">
          <thead className="sticky top-0 z-10 bg-[#0B2B26] border-b border-[#A67C52]/40 shadow-sm backdrop-blur-md">
            <tr className="border-b border-[#A67C52]/30">
              <th className="font-semibold py-3 px-4 text-[#FFF4D6]">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-[#FFF4D6] hover:bg-transparent hover:text-primary transition-colors"
                  onClick={() => handleSort("portfolio")}
                >
                  Portfolio
                  {getSortIcon("portfolio")}
                </Button>
              </th>
              <th className="font-semibold py-3 px-4 text-[#FFF4D6]">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-[#FFF4D6] hover:bg-transparent hover:text-primary transition-colors"
                  onClick={() => handleSort("totalMessages")}
                >
                  Number of Chits
                  {getSortIcon("totalMessages")}
                </Button>
              </th>
              <th className="font-semibold py-3 px-4 text-[#FFF4D6]">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-[#FFF4D6] hover:bg-transparent hover:text-primary transition-colors"
                  onClick={() => handleSort("totalScore")}
                >
                  Score
                  {getSortIcon("totalScore")}
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#A67C52]/20">
            {sortedChits && sortedChits.length > 0 ? (
              sortedChits.map((chitMark: ChitMark, index: number) => (
                <tr
                  key={chitMark.delegateId}
                  className={`${
                    index % 2 === 0 ? "bg-[#174A3A]/20" : "bg-[#0B2B26]/40"
                  } hover:bg-[#174A3A]/50 transition-colors border-b border-[#A67C52]/15`}
                >
                  <td className="text-base font-medium py-3 px-4 text-[#F2E9DB]">
                    {chitMark.portfolio}
                  </td>
                  <td className="text-base py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold text-sm">
                      {chitMark.totalMessages}
                    </span>
                  </td>
                  <td className="text-base py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-semibold text-sm">
                      {chitMark.totalScore}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  No delegates found in this committee.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sort status indicator */}
      <div className="flex-shrink-0 mt-3 pt-2 text-xs sm:text-sm text-muted-foreground border-t border-[#A67C52]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
        {sortDirection !== "none" && (
          <p>
            Sorted by{" "}
            <span className="font-medium text-[#FFF4D6]">
              {sortField.replace(/([A-Z])/g, " $1").toLowerCase()}
            </span>{" "}
            ({sortDirection === "asc" ? "ascending" : "descending"}){" • "}Click
            column headers to change sorting
          </p>
        )}
        {sortDirection === "none" && (
          <p>Click column headers to sort the data</p>
        )}
        <p className="text-xs text-muted-foreground/80">
          Showing all {chitMarks?.length || 0} portfolios
        </p>
      </div>
    </div>
  );
};

export default MarksPage;
