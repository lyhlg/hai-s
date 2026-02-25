// Auth types
export interface AdminUser {
  id: number;
  store_id: number;
  username: string;
  created_at: Date;
}

// Internal use only - includes password_hash
export interface AdminUserWithPassword extends AdminUser {
  password_hash: string;
}

export interface TableSession {
  id: number;
  store_id: number;
  table_id: number;
  started_at: Date;
  completed_at: Date | null;
  is_active: boolean;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

// JWT Claims
export interface UserClaims {
  userId?: number;
  tableId?: number;
  storeId: number;
  tableNumber?: string;
  role: UserRole;
}

export type UserRole = "admin" | "table";
