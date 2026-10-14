import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import AuthLayout from "../components/AuthLayout";
import { apiRequest } from "../utils/api";
import "./Login.css";

export default function Signup({ onBackToLogin, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (form.password.length < 12) {
      setError("Password must contain at least 12 characters.");
      return;
    }

    if (new TextEncoder().encode(form.password).length > 72) {
      setError("Password must not exceed 72 bytes.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest("/auth/signup", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        },
      });

      onCreated();

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create your account.");
      }

      onCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="auth-eyebrow">RECEIPTBOX</span>
        <h1>Create account</h1>
        <p>Keep your receipts and expenses organised.</p>

        <fieldset className="auth-fields" disabled={loading}>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={handleChange}
            maxLength={254}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <PasswordInput
            id="signup-password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            minLength={12}
            aria-describedby="password-help"
            disabled={loading}
            required
          />

          <p className="auth-help" id="password-help">
            Use at least 12 characters.
          </p>

          <label htmlFor="confirm-password">Confirm password</label>
          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            toggleLabel="confirm password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">
            {loading ? "Creating account..." : "Create account"}
          </button>

          <button type="button" className="auth-switch" onClick={onBackToLogin}>
            Already have an account? Login
          </button>
        </fieldset>
      </form>
    </AuthLayout>
  );
}
