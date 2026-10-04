"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const account =
      normalizedEmail === "admin@gmail.com" && password === "admin123"
        ? "admin"
        : normalizedEmail === "client@gmail.com" && password === "client123"
          ? "client"
          : null;

    if (!account) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("role", account);
    localStorage.setItem("isLoggedIn", "true");
    router.push("/products");
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
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
