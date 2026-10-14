import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <main className="auth-layout">
      <aside className="auth-brand">
        <a className="auth-logo" href="#">
          <span aria-hidden="true">▤</span> ReceiptBox
        </a>

        <div className="auth-brand-content">
          <span className="auth-tag">LESS CLUTTER. MORE CLARITY.</span>

          <h1>
            Every receipt.
            <br />
            One organised place.
          </h1>

          <p className="auth-description">
            Keep track of everyday spending, find receipts quickly, and make
            room for what matters.
          </p>

          <div className="receipt-art" aria-hidden="true">
            <div className="art-note">A little more organised.</div>

            <div className="art-receipt">
              <div className="art-receipt-heading">
                <span>YOUR RECEIPTS</span>
                <span>✓</span>
              </div>

              <div className="art-line" />
              <div className="art-line short" />

              <div className="art-receipt-row">
                <span>Everyday essentials</span>
                <span>✓</span>
              </div>

              <div className="art-receipt-row">
                <span>Coffee & conversations</span>
                <span>✓</span>
              </div>

              <div className="art-receipt-bottom">Everything in its place.</div>
            </div>
          </div>

          <div className="auth-features">
            <span>✓ Track expenses</span>
            <span>✓ Find receipts</span>
            <span>✓ Export reports</span>
          </div>
        </div>

        <p className="auth-brand-footer">Small habits. A clearer picture.</p>
      </aside>

      <section className="auth-form-panel">{children}</section>
    </main>
  );
}
