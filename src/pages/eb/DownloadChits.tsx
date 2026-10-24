import React, { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../../lib/axiosInstance";
import { useAuthContext } from "../../context/AuthContext";
import { Loading } from "../../components/Loading";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCcw,
  AlertCircle,
  Inbox,
  ChevronDown,
} from "lucide-react";
import {
  type ChitExportItem,
  exportChitsToExcel,
  exportChitsToPDF,
} from "../../utils/exportChits";
import { toast } from "sonner";
import { formatMessageTime } from "../../lib/utils";

const DownloadChits: React.FC = () => {
  const { authUser } = useAuthContext();
  const [chits, setChits] = useState<ChitExportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [committee, setCommittee] = useState<string>(authUser?.committee || "");

  const fetchCommitteeChits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend enforces committee isolation using req.user.committee from authenticated session
      const res = await axiosInstance.get("/admin/committee-chits");
      if (res.data?.success) {
        setChits(res.data.chits || []);
        if (res.data.committee) {
          setCommittee(res.data.committee);
        }
      } else {
        throw new Error(res.data?.message || "Failed to fetch committee chits");
      }
    } catch (err: any) {
      console.error("Error fetching chits for download:", err);
      const msg =
        err.response?.data?.message || err.message || "An error occurred while loading chits";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommitteeChits();
  }, [fetchCommitteeChits]);

  const handleDownloadExcel = () => {
    if (chits.length === 0) {
      toast.error("No chits available to download");
      return;
    }
    try {
      exportChitsToExcel(chits, committee || "Committee");
      toast.success("Excel spreadsheet downloaded successfully");
    } catch (err) {
      console.error("Failed to export Excel:", err);
      toast.error("Failed to generate Excel export");
    }
  };

  const handleDownloadPDF = () => {
    if (chits.length === 0) {
      toast.error("No chits available to download");
      return;
    }
    try {
      exportChitsToPDF(chits, committee || "Committee");
      toast.success("PDF document downloaded successfully");
    } catch (err) {
      console.error("Failed to export PDF:", err);
      toast.error("Failed to generate PDF export");
    }
  };

  return (
    <div className="p-5 sm:p-6 w-full h-full max-h-full flex flex-col min-h-0 overflow-hidden bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Download All Chits
            </h1>
            <span className="py-0.5 px-2.5 rounded-full bg-[#174A3A] border border-[#A67C52]/50 text-[#FFF4D6] text-xs font-semibold">
              {committee || authUser?.committee}
            </span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Complete preview and export of all individual EB-routed chits for{" "}
            <span className="text-primary font-medium">{committee || authUser?.committee}</span>
            {chits.length > 0 && ` (${chits.length} record${chits.length === 1 ? "" : "s"})`}
          </p>
        </div>

        <Button
          onClick={fetchCommitteeChits}
          variant="outline"
          size="sm"
          disabled={loading}
          className="self-start sm:self-auto gap-2 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB] hover:bg-[#174A3A] hover:text-[#FFF4D6]"
        >
          <RefreshCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-0">
          <Loading classes="w-full h-full" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 border border-destructive/40 rounded-xl bg-destructive/10 text-destructive text-center gap-3">
          <AlertCircle className="size-8" />
          <p className="font-semibold">{error}</p>
          <Button onClick={fetchCommitteeChits} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      ) : chits.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border border-border rounded-xl bg-[#0B2B26]/30 text-center gap-3">
          <Inbox className="size-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-[#F2E9DB]">No EB Chits Found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            No chits have been transmitted through the Executive Board workflow for{" "}
            {committee || authUser?.committee} yet.
          </p>
        </div>
      ) : (
        /* Vertically scrollable preview table container */
        <div
          id="chits-preview-container"
          data-testid="chits-preview-container"
          className="flex-1 min-h-0 overflow-auto border border-border rounded-xl bg-[#0B2B26]/40 shadow-inner relative"
        >
          <table className="w-full text-left text-sm border-collapse min-w-[850px]">
            <thead className="sticky top-0 z-10 bg-[#0B2B26] border-b border-[#A67C52]/40 shadow-sm">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#FFF4D6] w-[14%]">Sender</th>
                <th className="py-3 px-4 font-semibold text-[#FFF4D6] w-[18%]">
                  Sender Portfolio
                </th>
                <th className="py-3 px-4 font-semibold text-[#FFF4D6] w-[14%]">Receiver</th>
                <th className="py-3 px-4 font-semibold text-[#FFF4D6] w-[18%]">
                  Receiver Portfolio
                </th>
                <th className="py-3 px-4 font-semibold text-[#FFF4D6] w-[22%]">Content</th>
                <th className="py-3 px-4 font-semibold text-[#FFF4D6] w-[14%] text-right">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A67C52]/20">
              {chits.map((chit, idx) => (
                <tr
                  key={chit.id || idx}
                  className="hover:bg-[#174A3A]/30 transition-colors duration-150"
                >
                  <td className="py-3 px-4 font-medium text-[#F2E9DB] align-top">
                    {chit.sender}
                  </td>
                  <td className="py-3 px-4 text-primary font-medium align-top">
                    {chit.senderPortfolio}
                  </td>
                  <td className="py-3 px-4 text-[#F2E9DB] align-top">{chit.receiver}</td>
                  <td className="py-3 px-4 text-primary font-medium align-top">
                    {chit.receiverPortfolio}
                  </td>
                  <td className="py-3 px-4 text-[#F2E9DB]/90 align-top whitespace-pre-wrap break-words">
                    {chit.content}
                    <div className="mt-1 flex items-center gap-1.5">
                      {chit.status === "PENDING" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-amber-300 bg-amber-950/60 border border-amber-600/40 font-medium">
                          Pending
                        </span>
                      )}
                      {chit.status === "APPROVED" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 font-medium">
                          Approved
                        </span>
                      )}
                      {chit.status === "REJECTED" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-rose-300 bg-rose-950/60 border border-rose-600/40 font-medium">
                          Rejected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground text-right align-top whitespace-nowrap">
                    {chit.time ? formatMessageTime(chit.time) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gold Download Control Bar (Outside the scrollable table area) */}
      <div className="flex-shrink-0 pt-4 mt-2 border-t border-[#A67C52]/25 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground order-2 sm:order-1">
          Showing {chits.length} individual chit{chits.length === 1 ? "" : "s"} for committee{" "}
          <strong className="text-[#FFF4D6]">{committee || authUser?.committee}</strong>
        </div>

        <div className="order-1 sm:order-2 self-end sm:self-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="download-all-chits-btn"
                data-testid="download-all-chits-btn"
                disabled={loading || chits.length === 0}
                className="bg-gradient-to-r from-[#A67C52] via-[#F5DEB3]/90 to-[#8C6239] text-[#0B2B26] hover:from-[#B88B5D] hover:via-[#FFF4D6] hover:to-[#9B6E43] font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="size-4" />
                <span>Download</span>
                <ChevronDown className="size-4 opacity-75" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#0B2B26] border border-[#A67C52]/50 text-[#F2E9DB] p-1.5 shadow-2xl rounded-xl z-50"
            >
              <DropdownMenuItem
                id="download-excel-option"
                data-testid="download-excel-option"
                onClick={handleDownloadExcel}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#174A3A] focus:bg-[#174A3A] text-sm text-[#F2E9DB] hover:text-[#FFF4D6] transition-colors"
              >
                <FileSpreadsheet className="size-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-semibold">Download Excel</span>
                  <span className="text-[10px] text-muted-foreground">Microsoft Excel (.xlsx)</span>
                </div>
              </DropdownMenuItem>

              <div className="h-px bg-[#A67C52]/25 my-1" />

              <DropdownMenuItem
                id="download-pdf-option"
                data-testid="download-pdf-option"
                onClick={handleDownloadPDF}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#174A3A] focus:bg-[#174A3A] text-sm text-[#F2E9DB] hover:text-[#FFF4D6] transition-colors"
              >
                <FileText className="size-4 text-rose-400" />
                <div className="flex flex-col">
                  <span className="font-semibold">Download PDF</span>
                  <span className="text-[10px] text-muted-foreground">Document (.pdf)</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DownloadChits;
