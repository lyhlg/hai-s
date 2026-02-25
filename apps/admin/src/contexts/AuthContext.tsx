import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, type AdminLoginRequest } from '../api/auth';
import { getToken, setToken, clearToken } from '../api/client';

interface AuthState {
  token: string | null;
  storeId: number | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: AdminLoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function decodeBase64Url(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded);
}

function parseToken(token: string): { storeId: number; exp: number } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const parsed = parseToken(token);
  if (!parsed) return true;
  return parsed.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      const parsed = parseToken(token);
      return { token, storeId: parsed?.storeId ?? null, isAuthenticated: true };
    }
    clearToken();
    return { token: null, storeId: null, isAuthenticated: false };
  });

  // 만료 체크 타이머
  useEffect(() => {
    if (!state.token) return;
    const parsed = parseToken(state.token);
    if (!parsed) return;

    const msUntilExpiry = parsed.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      clearToken();
      setState({ token: null, storeId: null, isAuthenticated: false });
      return;
    }

    const timer = setTimeout(() => {
      clearToken();
      setState({ token: null, storeId: null, isAuthenticated: false });
    }, msUntilExpiry);

    return () => clearTimeout(timer);
  }, [state.token]);

  const login = useCallback(async (data: AdminLoginRequest) => {
    const res = await authApi.login(data);
    const { token } = res.data;
    setToken(token);
    const parsed = parseToken(token);
    setState({ token, storeId: parsed?.storeId ?? Number(data.storeId), isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState({ token: null, storeId: null, isAuthenticated: false });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, logout }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
