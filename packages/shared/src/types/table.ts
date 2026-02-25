// Table types
export interface Table {
  id: number;
  store_id: number;
  table_number: string;
  capacity: number;
  is_active: boolean;
  created_at: Date;
}

// Internal use only - includes password_hash
export interface TableWithPassword extends Table {
  password_hash: string;
}

export interface CreateTableInput {
  store_id: number;
  table_number: string;
  capacity: number;
}

export interface UpdateTableInput {
  table_number?: string;
  capacity?: number;
  is_active?: boolean;
}
