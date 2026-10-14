import { useEffect, useRef } from "react";
import "./DeleteReceiptModal.css";

export default function DeleteReceiptModal({
  receipt,
  loading,
  error,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="delete-modal"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!loading) onCancel();
      }}
    >
      <div className="delete-modal-content" aria-busy={loading}>
        <div className="delete-modal-icon" aria-hidden="true">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14" />
            <path d="M10 10v6M14 10v6" />
          </svg>
        </div>

        <h2 id="delete-modal-title">Delete receipt?</h2>

        <p id="delete-modal-description">
          This will permanently delete the receipt from{" "}
          <strong>{receipt.merchant}</strong>. This action cannot be undone.
        </p>

        <div className="delete-receipt-details">
          <span>Receipt amount</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(Number(receipt.amount))}
          </strong>
        </div>

        {error && (
          <p className="delete-modal-error" role="alert">
            {error}
          </p>
        )}

        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-cancel"
            onClick={onCancel}
            disabled={loading}
            autoFocus
          >
            Keep receipt
          </button>

          <button
            type="button"
            className="delete-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete receipt"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
