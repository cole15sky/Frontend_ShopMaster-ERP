"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "@/apis/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const me = await getMe();
    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}