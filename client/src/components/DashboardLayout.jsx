import "./DashboardLayout.css";

export default function DashboardLayout({ children, user, onLogout }) {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <a href="#overview" className="sidebar-brand">
          <span aria-hidden="true">▤</span>
          ReceiptBox
        </a>

        <p className="sidebar-label">WORKSPACE</p>

        <nav aria-label="Dashboard sections">
          <a href="#overview">Overview</a>
          <a href="#receipts">Receipts & exports</a>
        </nav>

        <div className="sidebar-tip">
          <span aria-hidden="true">✦</span>
          <h3>A clearer picture</h3>
          <p>Add everyday expenses to understand where your money goes.</p>
        </div>

        <div className="sidebar-account">
          <span className="account-avatar" aria-hidden="true">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </span>

          <div className="account-details">
            <strong>{user?.name || "User"}</strong>
            <span>Your workspace</span>
          </div>

          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-content">{children}</div>
    </div>
  );
}
