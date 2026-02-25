// Table types
export interface Table {
  id: string;
  store_id: string;
  table_number: number;
  password_hash?: undefined;
  created_at: Date;
}

// Internal use only - includes password_hash
export interface TableWithPassword {
  id: string;
  store_id: string;
  table_number: number;
  password_hash: string;
  created_at: Date;
}
