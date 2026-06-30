import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, tokenStore } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const t = tokenStore.get();
    if (!t) { setLoading(false); return; }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      tokenStore.clear();
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStore.set(data.token);
    setUser(data.user);
    return data.user;
  };
  const register = async (email, password, name) => {
    const { data } = await api.post("/auth/register", { email, password, name });
    tokenStore.set(data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = () => { tokenStore.clear(); setUser(null); };
  const refresh = fetchMe;
  const setUserDirect = setUser;

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, refresh, setUser: setUserDirect }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
