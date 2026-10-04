export const ADMIN_EMAIL = "admin@gmail.com";
export const CLIENT_EMAIL = "client@gmail.com";

const ADMIN_PASSWORD = "admin123";
const CLIENT_PASSWORD = "client123";

export function authenticate(email: string, password: string): "admin" | "client" | null {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) return "admin";
  if (normalizedEmail === CLIENT_EMAIL && password === CLIENT_PASSWORD) return "client";
  return null;
}
