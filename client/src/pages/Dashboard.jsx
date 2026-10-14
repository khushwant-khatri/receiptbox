import { useEffect, useState } from "react";
import ReceiptModal from "./ReceiptModal";
import ReceiptSummary from "./ReceiptSummary";
import ReceiptFilters from "./ReceiptFilters";
import ReceiptPagination from "./ReceiptPagination";
import { exportReceipts } from "../utils/exportReceipts";
import DashboardLayout from "../components/DashboardLayout";
import CategorySpending from "../components/CategorySpending";
import DeleteReceiptModal from "../components/DeleteReceiptModal";
import { apiRequest } from "../utils/api";
import "./Dashboard.css";

export default function Dashboard({ session, onLogout, onSessionExpired }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [sortBy, setSortBy] = useState("date-desc");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [receiptToDelete, setReceiptToDelete] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReceipts() {
      setLoading(true);
      setError("");

      try {
        const result = await apiRequest("/receipts", {
          token: session.token,
          signal: controller.signal,
          onUnauthorized: onSessionExpired,
        });

        if (controller.signal.aborted) return;

        const receiptList = Array.isArray(result) ? result : result?.data;

        if (!Array.isArray(receiptList)) {
          throw new Error("The server returned an invalid receipt list.");
        }

        setReceipts(receiptList);
      } catch (error) {
        if (
          !controller.signal.aborted &&
          error.name !== "AbortError" &&
          error.status !== 401
        ) {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchReceipts();

    return () => controller.abort();
  }, [session.token, refreshKey, onSessionExpired]);

  async function handleDelete(id) {
    if (deletingId) return;

    setDeletingId(id);
    setDeleteError("");
    setNotice("");

    try {
      await apiRequest(`/receipts/${id}`, {
        method: "DELETE",
        token: session.token,
        onUnauthorized: onSessionExpired,
      });

      setReceipts((previous) =>
        previous.filter((receipt) => receipt._id !== id),
      );

      setReceiptToDelete(null);
      setNotice("Receipt deleted successfully.");
    } catch (error) {
      if (error.status !== 401) {
        setDeleteError(error.message);
      }
    } finally {
      setDeletingId(null);
    }
  }

  function openAddModal() {
    setEditingReceipt(null);
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(receipt) {
    setEditingReceipt(receipt);
    setNotice("");
    setModalOpen(true);
  }

  function handleSaved() {
    setNotice(
      editingReceipt
        ? "Receipt updated successfully."
        : "Receipt added successfully.",
    );

    setModalOpen(false);
    setEditingReceipt(null);

    // Updated receipts dobara fetch karna.
    setRefreshKey((previous) => previous + 1);
  }

  const categories = [
    ...new Set(
      receipts
        .map((receipt) => receipt.category?.trim().toLowerCase())
        .filter(Boolean),
    ),
  ].sort();

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch = (receipt.merchant || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      category === "" || receipt.category?.trim().toLowerCase() === category;

    const receiptDate = receipt.date?.slice(0, 10) || "";

    const matchesFromDate =
      !fromDate || (receiptDate !== "" && receiptDate >= fromDate);

    const matchesToDate =
      !toDate || (receiptDate !== "" && receiptDate <= toDate);

    return matchesSearch && matchesCategory && matchesFromDate && matchesToDate;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);

      case "date-asc":
        return new Date(a.date) - new Date(b.date);

      case "amount-desc":
        return Number(b.amount) - Number(a.amount);

      case "amount-asc":
        return Number(a.amount) - Number(b.amount);

      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredReceipts.length / pageSize);

  // Delete/filter ke baad pages kam ho jaayein toh valid page dikhao.
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedReceipts = sortedReceipts.slice(
    startIndex,
    startIndex + pageSize,
  );
  return (
    <DashboardLayout user={session.user} onLogout={onLogout}>
      <main className="dashboard">
        <div className="dashboard-header" id="overview">
          <div>
            <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
            <h1>Your expense overview</h1>
            <p>
              Welcome, {session.user?.name || "User"}. Here’s your spending at a
              glance.
            </p>
          </div>
        </div>

        <ReceiptSummary receipts={receipts} loading={loading} error={error} />
        <CategorySpending receipts={receipts} loading={loading} error={error} />

        <div className="receipt-toolbar" id="receipts">
          <div>
            <span className="eyebrow">YOUR EXPENSES</span>
            <h2>Receipts</h2>
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="export-button"
              disabled={
                loading || Boolean(error) || sortedReceipts.length === 0
              }
              onClick={() => exportReceipts(sortedReceipts)}
            >
              Export CSV
            </button>

            <button type="button" className="add-button" onClick={openAddModal}>
              + Add Receipt
            </button>
          </div>
        </div>

        {notice && (
          <p className="success notice" role="status">
            {notice}
          </p>
        )}

        {modalOpen && (
          <ReceiptModal
            token={session.token}
            receipt={editingReceipt}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
            onSessionExpired={onSessionExpired}
          />
        )}

        <ReceiptFilters
          search={search}
          category={category}
          categories={categories}
          sortBy={sortBy}
          fromDate={fromDate}
          toDate={toDate}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          onSortChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
          onFromDateChange={(value) => {
            setFromDate(value);

            if (value && toDate && value > toDate) {
              setToDate(value);
            }

            setPage(1);
          }}
          onToDateChange={(value) => {
            setToDate(value);

            if (value && fromDate && value < fromDate) {
              setFromDate(value);
            }

            setPage(1);
          }}
          onClear={() => {
            setSearch("");
            setCategory("");
            setFromDate("");
            setToDate("");
            setPage(1);
          }}
        />

        {!loading && !error && (
          <p className="results-count">
            Showing {filteredReceipts.length === 0 ? 0 : startIndex + 1}
            {"–"}
            {Math.min(startIndex + pageSize, filteredReceipts.length)}
            {" of "}
            {filteredReceipts.length} matching receipts
          </p>
        )}

        {loading ? (
          <p>Loading receipts...</p>
        ) : error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : filteredReceipts.length === 0 ? (
          <div className="empty-state">
            <h3>
              {receipts.length === 0
                ? "No receipts yet"
                : "No matching receipts"}
            </h3>

            <p>
              {receipts.length === 0
                ? "Add your first receipt to start tracking expenses."
                : "Try another merchant name or clear your filters."}
            </p>
          </div>
        ) : (
          <div className="receipt-grid">
            {paginatedReceipts.map((receipt) => (
              <article className="receipt-card" key={receipt._id}>
                <div className="receipt-card-top">
                  <h3>{receipt.merchant}</h3>
                  <span className="category-badge">{receipt.category}</span>
                </div>

                <p className="receipt-amount">
                  ₹{Number(receipt.amount).toLocaleString("en-IN")}
                </p>

                <p className="receipt-date">
                  {receipt.date
                    ? new Date(receipt.date).toLocaleDateString("en-IN")
                    : "—"}
                </p>

                <div className="card-actions">
                  <button
                    className="secondary-button"
                    onClick={() => openEditModal(receipt)}
                    disabled={deletingId !== null}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => {
                      setDeleteError("");
                      setReceiptToDelete(receipt);
                    }}
                    disabled={deletingId !== null}
                  >
                    {deletingId === receipt._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && !error && (
          <ReceiptPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {receiptToDelete && (
          <DeleteReceiptModal
            receipt={receiptToDelete}
            loading={deletingId !== null}
            error={deleteError}
            onCancel={() => {
              if (deletingId) return;

              setReceiptToDelete(null);
              setDeleteError("");
            }}
            onConfirm={() => handleDelete(receiptToDelete._id)}
          />
        )}
      </main>
    </DashboardLayout>
  );
}
