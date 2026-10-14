import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { apiRequest } from "../utils/api";
import AuthLayout from "../components/AuthLayout";
import "./Login.css";

export default function Login({ onLogin, onShowSignup, message }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      onLogin({
        token: result.token,
        user: result.data,
      });

      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>ReceiptBox</h1>
        <p>Login to manage your receipts.</p>

        {message && (
          <p className="auth-notice" role="status">
            {message}
          </p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          required
        />

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={onShowSignup}
          disabled={loading}
        >
          New here? Create an account
        </button>
      </form>
    </AuthLayout>
  );
}
