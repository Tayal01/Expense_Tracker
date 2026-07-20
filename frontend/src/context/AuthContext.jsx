import React, { createContext, useContext, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

// "Remember me" picks the storage: localStorage survives closing the
// browser, sessionStorage does not. Only one of them holds the session.
function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem("token");
    storage.removeItem("user");
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // A corrupted value here would throw and white-screen the whole app,
    // so treat unparseable data as "not logged in".
    try {
      const saved =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      clearSession();
      return null;
    }
  });

  async function login(email, password, remember = true) {
    const { data } = await api.post("/auth/login", { email, password });
    clearSession();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(name, email, password) {
    await api.post("/auth/register", { name, email, password });
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
