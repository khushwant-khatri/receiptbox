import { useEffect, useRef } from "react";
import AddReceipt from "./AddReceipt";
import "./ReceiptModal.css";

export default function ReceiptModal({
  token,
  receipt,
  onClose,
  onSaved,
  onSessionExpired,
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
      className="receipt-modal"
      aria-labelledby="receipt-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <AddReceipt
        token={token}
        receipt={receipt}
        onCancel={onClose}
        onAdded={onSaved}
        onSessionExpired={onSessionExpired}
      />
    </dialog>
  );
}
