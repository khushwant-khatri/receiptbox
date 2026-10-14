import "./ReceiptSummary.css";

export default function ReceiptSummary({ receipts, loading, error }) {
  const totalAmount = receipts.reduce(
    (total, receipt) => total + Number(receipt.amount),
    0,
  );

  const categoryCount = new Set(
    receipts
      .map((receipt) => receipt.category?.trim().toLowerCase())
      .filter(Boolean),
  ).size;

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(totalAmount);

  function displayValue(value) {
    if (loading) return "…";
    if (error) return "—";
    return value;
  }

  return (
    <section className="receipt-summary" aria-label="Receipt overview">
      <article className="summary-card summary-card-primary">
        <p className="summary-label">Total Spending</p>
        <h2>{displayValue(formattedAmount)}</h2>
        <p className="summary-caption">Across your saved receipts</p>
      </article>

      <article className="summary-card">
        <p className="summary-label">Total Receipts</p>
        <h2>{displayValue(receipts.length)}</h2>
        <p className="summary-caption">Your bills in one place</p>
      </article>

      <article className="summary-card">
        <p className="summary-label">Categories</p>
        <h2>{displayValue(categoryCount)}</h2>
        <p className="summary-caption">Different expense categories</p>
      </article>
    </section>
  );
}
