// Auth types
export interface AdminUser {
  id: number;
  store_id: number;
  username: string;
  role: 'owner' | 'manager' | 'staff';
  is_active: boolean;
  created_at: Date;
}

// Internal use only - includes password_hash
export interface AdminUserWithPassword extends AdminUser {
  password_hash: string;
}

export interface Session {
  id: number;
  table_id: number;
  customer_token: string;
  started_at: Date;
  ended_at: Date | null;
  is_active: boolean;
}

export type TableSession = Session; // Alias for backward compatibility

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface CustomerSessionResponse {
  session_id: number;
  table_number: string;
  store_name: string;
}

// JWT Claims
export interface UserClaims {
  userId: number;
  storeId: number;
  role: 'owner' | 'manager' | 'staff';
}

export type UserRole = 'owner' | 'manager' | 'staff' | 'admin' | 'table';
