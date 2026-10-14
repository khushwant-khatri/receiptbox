import { useCallback, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

const SESSION_KEY = "receiptbox-session";

function getSavedSession() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (typeof parsed?.token !== "string" || !parsed.token || !parsed.user) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default function App() {
  const [session, setSession] = useState(getSavedSession);

  const [authPage, setAuthPage] = useState("login");
  const [authMessage, setAuthMessage] = useState("");

  function handleLogin(loginData) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(loginData));
    } catch {
      // Storage unavailable ho toh current page par login chalega.
    }

    setSession(loginData);
  }

  const handleLogout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Storage unavailable hone par bhi React session clear karo.
    }

    setSession(null);
  }, []);

  const handleSessionExpired = useCallback(() => {
    handleLogout();
    setAuthPage("login");
    setAuthMessage("Session expired. Please login again.");
  }, [handleLogout]);

  if (!session) {
    if (authPage === "signup") {
      return (
        <Signup
          onBackToLogin={() => setAuthPage("login")}
          onCreated={() => {
            setAuthMessage("Account created! Please login.");
            setAuthPage("login");
          }}
        />
      );
    }

    return (
      <Login
        onLogin={(loginData) => {
          setAuthMessage("");
          handleLogin(loginData);
        }}
        onShowSignup={() => {
          setAuthMessage("");
          setAuthPage("signup");
        }}
        message={authMessage}
      />
    );
  }

  return (
    <Dashboard
      session={session}
      onLogout={handleLogout}
      onSessionExpired={handleSessionExpired}
    />
  );
}
