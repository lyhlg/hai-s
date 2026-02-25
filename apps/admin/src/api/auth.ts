import { api } from './client';

export interface AdminLoginRequest {
  storeId: number;
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  expiresAt: string;
}

export const authApi = {
  login(data: AdminLoginRequest) {
    return api.post<AdminLoginResponse>('/auth/admin/login', data);
  },
};
