import { useState } from "react";
import { apiRequest } from "../utils/api";
import "./AddReceipt.css";

export default function AddReceipt({
  token,
  receipt,
  onAdded,
  onCancel,
  onSessionExpired,
}) {
  const isEditing = Boolean(receipt);

  const [form, setForm] = useState({
    merchant: receipt?.merchant || "",
    amount: receipt?.amount ?? "",
    category: receipt?.category || "",
    date: receipt?.date?.slice(0, 10) || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const amount = Number(form.amount);

    if (
      !form.merchant.trim() ||
      !form.category.trim() ||
      !form.date ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Please complete all fields and enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const path = isEditing ? `/receipts/${receipt._id}` : "/receipts";

      await apiRequest(path, {
        method: isEditing ? "PUT" : "POST",
        token,
        onUnauthorized: onSessionExpired,
        body: {
          merchant: form.merchant.trim(),
          amount,
          category: form.category.trim(),
          date: form.date,
        },
      });

      onAdded();
    } catch (error) {
      if (error.status !== 401) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="receipt-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="eyebrow">RECEIPTBOX</span>

        <h2 id="receipt-modal-title">
          {isEditing ? "Edit receipt" : "Add a receipt"}
        </h2>

        <p>Keep your everyday expenses organised.</p>
      </div>

      <fieldset disabled={loading} className="form-fields">
        <label htmlFor="merchant">Merchant / Shop name</label>
        <input
          id="merchant"
          name="merchant"
          value={form.merchant}
          onChange={handleChange}
          placeholder="Example: D Mart"
          required
        />

        <div className="form-row">
          <div>
            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="date">Receipt date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="category">Category</label>

        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>

          {[
            "Food",
            "Travel",
            "Medical",
            "Office",
            "Shopping",
            "Utilities",
            "Other",
          ].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit">
            {loading ? "Saving..." : isEditing ? "Save changes" : "Add receipt"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
