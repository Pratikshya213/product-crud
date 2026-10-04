// This file sets up ONE shared axios instance for the whole app.
// Every service (product, user, etc.) will import this instead of
// creating its own axios instance, so the base URL only lives in one place.

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export default api;
