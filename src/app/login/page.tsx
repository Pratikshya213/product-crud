"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authenticate, ADMIN_EMAIL } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("registrationComplete")) {
      sessionStorage.removeItem("registrationComplete");
      setNotice("Registration complete. Sign in with your new account.");
    }
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const role = await authenticate(email, password);
      if (!role) {
        setError("Invalid email or password. Clients need to register first.");
        return;
      }

      localStorage.setItem("role", role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("email", email.trim().toLowerCase());
      router.push("/products");
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <p className="login-eyebrow">PRODUCT MANAGEMENT</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-description">Sign in to continue to your account.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {notice && <p className="login-notice" role="status">{notice}</p>}
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="login-links">
          New client? <a href="/register">Create an account</a>
        </p>
        <p className="login-helper">Administrator sign-in: <strong>{ADMIN_EMAIL}</strong></p>
      </section>
    </main>
  );
}
