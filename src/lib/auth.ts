const CLIENTS_KEY = "productCrudClients";
export const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";
const PASSWORD_ITERATIONS = 120_000;

type ClientAccount = {
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
};

function readClients(): ClientAccount[] {
  try {
    const stored = localStorage.getItem(CLIENTS_KEY);
    const clients: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(clients) ? clients : [];
  } catch {
    return [];
  }
}

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function hashPassword(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PASSWORD_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return toHex(derived);
}

export async function registerClient(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === ADMIN_EMAIL) {
    throw new Error("That email is reserved for the administrator.");
  }

  const clients = readClients();
  if (clients.some((client) => client.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account: ClientAccount = {
    name: name.trim(),
    email: normalizedEmail,
    salt: toHex(salt.buffer),
    passwordHash: await hashPassword(password, salt),
  };

  localStorage.setItem(CLIENTS_KEY, JSON.stringify([...clients, account]));
}

export async function authenticate(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === ADMIN_EMAIL) {
    return password === ADMIN_PASSWORD ? "admin" : null;
  }

  const account = readClients().find((client) => client.email === normalizedEmail);
  if (!account) return null;

  const salt = new Uint8Array(
    account.salt.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []
  );
  const passwordHash = await hashPassword(password, salt);
  return passwordHash === account.passwordHash ? "client" : null;
}
