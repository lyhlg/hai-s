import axios from 'axios';

const TOKEN_KEY = 'admin_token';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRequest = err.config?.url?.startsWith('/auth/');
    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// API methods
export const apiMethods = {
  getTables: (storeId: string) => 
    api.get(`/stores/${storeId}/tables`).then(res => res.data),
  
  getOrders: (sessionId: number) => 
    api.get(`/orders?sessionId=${sessionId}`).then(res => res.data),
  
  updateOrderStatus: (orderId: string, status: string) => 
    api.put(`/orders/${orderId}/status`, { status }).then(res => res.data),
  
  deleteOrder: (orderId: string) => 
    api.delete(`/orders/${orderId}`).then(res => res.data),
  
  endSession: (storeId: string, tableId: string) => 
    api.post(`/stores/${storeId}/tables/${tableId}/end-session`).then(res => res.data),
};
