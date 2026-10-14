import "./ReceiptFilters.css";

export default function ReceiptFilters({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onClear,
  sortBy,
  onSortChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) {
  return (
    <div className="receipt-filters">
      <div className="filter-search">
        <label htmlFor="receipt-search">Search receipts</label>

        <input
          id="receipt-search"
          type="search"
          placeholder="Search by merchant..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-category">
        <label htmlFor="receipt-category">Category</label>

        <select
          id="receipt-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-sort">
        <label htmlFor="receipt-sort">Sort by</label>

        <select
          id="receipt-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Amount: high to low</option>
          <option value="amount-asc">Amount: low to high</option>
        </select>
      </div>
      <div className="filter-date">
        <label htmlFor="receipt-from-date">From date</label>

        <input
          id="receipt-from-date"
          type="date"
          value={fromDate}
          max={toDate || undefined}
          onChange={(event) => onFromDateChange(event.target.value)}
        />
      </div>

      <div className="filter-date">
        <label htmlFor="receipt-to-date">To date</label>

        <input
          id="receipt-to-date"
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(event) => onToDateChange(event.target.value)}
        />
      </div>

      <button
        type="button"
        className="filter-clear"
        onClick={onClear}
        disabled={!search && !category && !fromDate && !toDate}
      >
        Clear filters
      </button>
    </div>
  );
}
