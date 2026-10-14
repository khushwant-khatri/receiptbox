import "./ReceiptPagination.css";

export default function ReceiptPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="receipt-pagination" aria-label="Receipt pages">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>

      <span aria-live="polite">
        Page <strong>{page}</strong> of {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </nav>
  );
}
