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
  // Auth
  tableLogin: (storeId: string, tableNumber: number, password: string) =>
    request<{ token: string; storeId: string; tableId: string; tableNumber: number }>("/auth/table/login", {
      method: "POST",
      body: JSON.stringify({ storeId, tableNumber, password }),
    }),

  // Menu
  getMenu: (storeId: string) => request<any[]>(`/stores/${storeId}/menu`),

  // Orders
  createOrder: (items: { menuItemId: string; quantity: number }[]) =>
    request<any>("/orders", { method: "POST", body: JSON.stringify({ items }) }),

  getOrders: (sessionId: string) => request<any[]>(`/orders?sessionId=${sessionId}`),
};
