import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";

interface AuthState {
  token: string | null;
  storeId: number | null;
  tableId: number | null;
  tableNumber: string | null;
  sessionId: number | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const STORAGE_KEYS = ["token", "storeId", "tableId", "tableNumber", "sessionId"] as const;

function loadFromStorage(): Omit<AuthState, "status"> {
  return {
    token: localStorage.getItem("token"),
    storeId: Number(localStorage.getItem("storeId")) || null,
    tableId: Number(localStorage.getItem("tableId")) || null,
    tableNumber: localStorage.getItem("tableNumber"),
    sessionId: Number(localStorage.getItem("sessionId")) || null,
  };
}

function saveToStorage(data: Record<string, string>) {
  Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
}

function clearStorage() {
  STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => ({
    ...loadFromStorage(),
    status: "loading",
  }));

  const login = useCallback(async (storeId: number, tableNumber: string, password: string) => {
    const res = await api.tableLogin(storeId, tableNumber, password);
    saveToStorage({
      token: res.token,
      storeId: String(res.storeId),
      tableId: String(res.tableId),
      tableNumber: res.tableNumber,
    });

    // 세션 시작
    let sessionId: number;
    try {
      const session = await api.getActiveSession(res.storeId, res.tableId);
      sessionId = session?.is_active ? session.id : (await api.startSession(res.storeId, res.tableId)).sessionId;
    } catch {
      sessionId = (await api.startSession(res.storeId, res.tableId)).sessionId;
    }
    localStorage.setItem("sessionId", String(sessionId));

    setAuth({
      token: res.token,
      storeId: res.storeId,
      tableId: res.tableId,
      tableNumber: res.tableNumber,
      sessionId,
      status: "authenticated",
    });
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setAuth({ token: null, storeId: null, tableId: null, tableNumber: null, sessionId: null, status: "unauthenticated" });
  }, []);

  // 자동 로그인: 저장된 토큰으로 세션 확인
  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored.token || !stored.storeId || !stored.tableId) {
      setAuth((prev) => ({ ...prev, status: "unauthenticated" }));
      return;
    }

    (async () => {
      try {
        const session = await api.getActiveSession(stored.storeId!, stored.tableId!);
        const sessionId = session?.is_active
          ? session.id
          : (await api.startSession(stored.storeId!, stored.tableId!)).sessionId;
        localStorage.setItem("sessionId", String(sessionId));
        setAuth({ ...stored, sessionId, status: "authenticated" });
      } catch {
        // 토큰 만료 등 → 로그아웃
        clearStorage();
        setAuth({ token: null, storeId: null, tableId: null, tableNumber: null, sessionId: null, status: "unauthenticated" });
      }
    })();
  }, []);

  return { ...auth, login, logout };
}
