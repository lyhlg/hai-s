// Auth types
export interface AdminUser {
  id: string;
  store_id: string;
  username: string;
  created_at: Date;
}

// Internal use only - includes password_hash
export interface AdminUserWithPassword extends AdminUser {
  password_hash: string;
}

export interface TableSession {
  id: string;
  store_id: string;
  table_id: string;
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
  userId?: string;
  tableId?: string;
  storeId: string;
  tableNumber?: number;
  role: UserRole;
}

export type UserRole = "admin" | "table";
