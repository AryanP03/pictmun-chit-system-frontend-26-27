import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ChitExportItem {
  id: string;
  conversationId: string;
  sender: string;
  senderPortfolio: string;
  receiver: string;
  receiverPortfolio: string;
  content: string;
  time: string;
  status: string;
  score?: number;
  committee: string;
}

export const exportChitsToExcel = (chits: ChitExportItem[], committee: string) => {
  // Required 6 columns in exact order
  const data = chits.map((item) => ({
    "Sender": item.sender,
    "Sender Portfolio": item.senderPortfolio,
    "Receiver": item.receiver,
    "Receiver Portfolio": item.receiverPortfolio,
    "Content": item.content,
    "Time": new Date(item.time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      "Sender",
      "Sender Portfolio",
      "Receiver",
      "Receiver Portfolio",
      "Content",
      "Time",
    ],
  });

  // Sensible column widths
  worksheet["!cols"] = [
    { wch: 22 }, // Sender
    { wch: 28 }, // Sender Portfolio
    { wch: 22 }, // Receiver
    { wch: 28 }, // Receiver Portfolio
    { wch: 60 }, // Content
    { wch: 22 }, // Time
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "EB Chits");

  const sanitizedCommittee = committee.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `PICT_MUN_${sanitizedCommittee}_EB_Chits_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportChitsToPDF = (chits: ChitExportItem[], committee: string) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  // Document Title and Committee Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(11, 43, 38);
  doc.text("PICT MUN 2026 — EB Chit Export", 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const genDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  doc.text(
    `Committee: ${committee}   |   Generated: ${genDate}   |   Total Chits: ${chits.length}`,
    40,
    58
  );

  // Table rows with 6 columns in exact order
  const tableRows = chits.map((item) => [
    item.sender,
    item.senderPortfolio,
    item.receiver,
    item.receiverPortfolio,
    item.content,
    new Date(item.time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  ]);

  autoTable(doc, {
    startY: 72,
    head: [
      [
        "Sender",
        "Sender Portfolio",
        "Receiver",
        "Receiver Portfolio",
        "Content",
        "Time",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [11, 43, 38], // PICT MUN deep emerald #0B2B26
      textColor: [255, 244, 214], // #FFF4D6
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 6,
      overflow: "linebreak",
      valign: "top",
    },
    columnStyles: {
      0: { cellWidth: 85 },  // Sender
      1: { cellWidth: 120 }, // Sender Portfolio
      2: { cellWidth: 85 },  // Receiver
      3: { cellWidth: 120 }, // Receiver Portfolio
      4: { cellWidth: 260 }, // Content
      5: { cellWidth: 90 },  // Time
    },
    didDrawPage: (data) => {
      // Footer with page number
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.width - 80,
        doc.internal.pageSize.height - 20
      );
    },
    showHead: "everyPage",
  });

  const sanitizedCommittee = committee.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `PICT_MUN_${sanitizedCommittee}_EB_Chits_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
