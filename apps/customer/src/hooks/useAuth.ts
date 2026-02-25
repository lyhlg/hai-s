import { useState, useEffect } from "react";
import { api } from "../api/client";

interface AuthState {
  token: string | null;
  storeId: string | null;
  tableId: string | null;
  tableNumber: number | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem("token"),
    storeId: localStorage.getItem("storeId"),
    tableId: localStorage.getItem("tableId"),
    tableNumber: Number(localStorage.getItem("tableNumber")) || null,
  }));

  const login = async (storeId: string, tableNumber: number, password: string) => {
    const res = await api.tableLogin(storeId, tableNumber, password);
    localStorage.setItem("token", res.token);
    localStorage.setItem("storeId", res.storeId);
    localStorage.setItem("tableId", res.tableId);
    localStorage.setItem("tableNumber", String(res.tableNumber));
    setAuth({ token: res.token, storeId: res.storeId, tableId: res.tableId, tableNumber: res.tableNumber });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("storeId");
    localStorage.removeItem("tableId");
    localStorage.removeItem("tableNumber");
    setAuth({ token: null, storeId: null, tableId: null, tableNumber: null });
  };

  const isLoggedIn = !!auth.token;

  // 자동 로그인 시도
  useEffect(() => {
    if (auth.token && auth.storeId && auth.tableNumber) {
      // 토큰이 있으면 이미 로그인 상태
    }
  }, [auth]);

  return { ...auth, isLoggedIn, login, logout };
}
