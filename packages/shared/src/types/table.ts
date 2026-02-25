/**
 * Table types
 *
 * Table / TableWithPassword 분리 설계:
 * - Table: password_hash를 제외한 안전한 타입. Service/Route 레이어에서 사용.
 * - TableWithPassword: password_hash를 포함한 내부용 타입. Repository 레이어에서만 사용.
 */
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
