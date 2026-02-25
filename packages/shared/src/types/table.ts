/**
 * Table types
 *
 * Table / TableWithPassword 분리 설계:
 * - Table: password_hash를 제외한 안전한 타입. Service/Route 레이어에서 사용.
 *   API 응답에 password_hash가 실수로 노출되는 것을 타입 레벨에서 방지.
 * - TableWithPassword: password_hash를 포함한 내부용 타입. Repository 레이어에서만 사용.
 *   로그인 시 bcrypt 비교 등 비밀번호 접근이 필요한 경우에만 사용.
 *
 * DB 스키마(tables_)에는 password_hash가 NOT NULL로 항상 존재하지만,
 * 타입 분리를 통해 비밀번호가 외부로 전파되지 않도록 보장한다.
 */
export interface Table {
  id: string;
  store_id: string;
  table_number: number;
  capacity: number;
  is_active: boolean;
  created_at: Date;
}

// Internal use only - includes password_hash
export interface TableWithPassword extends Table {
  password_hash: string;
}
