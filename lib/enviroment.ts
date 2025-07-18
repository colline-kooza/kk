export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.API_URL
    : "http://127.0.0.1:8787";
