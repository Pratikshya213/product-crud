"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authenticate, ADMIN_EMAIL, CLIENT_EMAIL } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const role = await authenticate(email, password);
      if (!role) {
        setError("Invalid email or password. Check your sign-in details and try again.");
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

          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="login-helper">
          Admin: <strong>{ADMIN_EMAIL}</strong><br />Client: <strong>{CLIENT_EMAIL}</strong>
        </p>
      </section>
    </main>
  );
}
