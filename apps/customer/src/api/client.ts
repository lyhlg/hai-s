const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `요청 실패 (${res.status})`);
  }
  return res.json();
}

export const api = {
  tableLogin: (storeId: number, tableNumber: string, password: string) =>
    request<{ token: string; storeId: number; tableId: number; tableNumber: string }>("/auth/table/login", {
      method: "POST",
      body: JSON.stringify({ storeId, tableNumber, password }),
    }),

  startSession: (storeId: number, tableId: number) =>
    request<{ sessionId: number }>(
      `/stores/${storeId}/tables/${tableId}/start-session`,
      { method: "POST" }
    ),

  getActiveSession: (storeId: number, tableId: number) =>
    request<{ id: number; table_id: number; started_at: string; is_active: boolean } | null>(
      `/stores/${storeId}/tables/${tableId}/session`
    ),

  getMenu: (storeId: number) =>
    request<any[]>(`/stores/${storeId}/menu`),

  createOrder: (storeId: number, tableId: number, sessionId: number, items: { menuId: number; quantity: number; unitPrice: number }[]) =>
    request<any>(`/stores/${storeId}/orders`, {
      method: "POST",
      body: JSON.stringify({ tableId, sessionId, items }),
    }),

  getOrders: (storeId: number, sessionId: number) =>
    request<any[]>(`/stores/${storeId}/orders?sessionId=${sessionId}`),
};
