"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerClient } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await registerClient(name, email, password);
      sessionStorage.setItem("registrationComplete", "true");
      router.push("/login");
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="register-title">
        <p className="login-eyebrow">CLIENT ACCOUNT</p>
        <h1 id="register-title">Create your account</h1>
        <p className="login-description">Register as a client, then sign in to view the catalog.</p>

        <form className="login-form" onSubmit={handleRegister}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="login-links">
          Already registered? <a href="/login">Sign in</a>
        </p>
      </section>
    </main>
  );
}
