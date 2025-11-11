import apiClient from "./apiClient";
import { TOKEN_STORAGE_KEY } from "../config/constants";

const base64UrlDecode = (segment) => {
  try {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = atob(padded);
    return decodeURIComponent(
      decoded
        .split("")
        .map((char) => {
          const code = char.charCodeAt(0);
          return `%${code.toString(16).padStart(2, "0")}`;
        })
        .join("")
    );
  } catch (error) {
    console.error("Failed to decode token segment", error);
    return null;
  }
};

const parseToken = (token) => {
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const payload = base64UrlDecode(parts[1]);

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch (error) {
    console.error("Failed to parse token payload", error);
    return null;
  }
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post("/api/v1/auth/login", {
    email,
    password,
  });

  return response.data?.token ?? null;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const storeToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

export const clearStoredToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY);

export const extractUserFromToken = (token) => {
  const decoded = parseToken(token);

  if (!decoded) {
    return null;
  }

  const roles = decoded.roles
    ? decoded.roles
        .split(",")
        .map((role) => role.trim())
        .filter(Boolean)
    : [];

  return {
    email: decoded.sub ?? "",
    roles,
    exp: decoded.exp ?? 0,
  };
};

export const isTokenValid = (token) => {
  const user = extractUserFromToken(token);

  if (!user) {
    return false;
  }

  if (!user.exp) {
    return true;
  }

  const expiresAt = user.exp * 1000;
  return expiresAt > Date.now();
};

export default {
  login,
  getStoredToken,
  storeToken,
  clearStoredToken,
  extractUserFromToken,
  isTokenValid,
};
