import "./CategorySpending.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function CategorySpending({ receipts, loading, error }) {
  const totals = new Map();

  for (const receipt of receipts) {
    const amount = Number(receipt.amount);
    if (!Number.isFinite(amount) || amount <= 0) continue;

    const category = receipt.category?.trim().toLowerCase() || "other";

    totals.set(category, (totals.get(category) || 0) + amount);
  }

  const categories = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const total = categories.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <section className="category-spending" aria-label="Spending by category">
      <div className="spending-heading">
        <div>
          <h2>Where your money goes</h2>
          <p>Category breakdown across all saved receipts</p>
        </div>
        <span>INR</span>
      </div>

      {loading ? (
        <p role="status">Loading breakdown...</p>
      ) : error ? (
        <p>Breakdown unavailable. Please reload your receipts.</p>
      ) : categories.length === 0 ? (
        <p>Add a receipt to see your spending breakdown here.</p>
      ) : (
        <div className="spending-list">
          {categories.map(([category, amount]) => {
            const percentage = (amount / total) * 100;

            return (
              <div className="spending-item" key={category}>
                <div className="spending-item-label">
                  <span className="spending-category">{category}</span>
                  <span>
                    <strong>{currency.format(amount)}</strong>
                    <small>{percentage.toFixed(1)}%</small>
                  </span>
                </div>

                <div className="spending-track" aria-hidden="true">
                  <div style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
