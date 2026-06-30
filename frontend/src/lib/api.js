import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

const TOKEN_KEY = "skillsync_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const t = tokenStore.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
