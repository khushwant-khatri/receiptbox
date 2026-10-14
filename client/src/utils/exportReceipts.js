function escapeCsv(value) {
  let text = String(value ?? "");

  // Spreadsheet formula ki tarah interpret hone se bachao.
  if (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) {
    text = "'" + text;
  }

  // Quotes ko escape karo; commas/newlines ko same cell mein rakho.
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportReceipts(receipts) {
  if (receipts.length === 0) return;

  const rows = [
    ["Merchant", "Amount (INR)", "Category", "Date"],

    ...receipts.map((receipt) => [
      receipt.merchant,
      receipt.amount,
      receipt.category,
      receipt.date?.slice(0, 10) || "",
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "receiptbox-receipts.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
