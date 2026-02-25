# Unit 1: Core - Data Models

> Store, Table, Auth 컴포넌트의 데이터 모델 정의

---

## 1. Store (매장)

```sql
CREATE TABLE stores (
  id         VARCHAR(36) PRIMARY KEY,          -- UUID
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | 매장 고유 ID (UUID) |
| name | VARCHAR(100) | NOT NULL | 매장명 |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |

---

## 2. Admin User (관리자 계정)

```sql
CREATE TABLE admin_users (
  id            VARCHAR(36) PRIMARY KEY,
  store_id      VARCHAR(36) NOT NULL,
  username      VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  UNIQUE KEY uq_store_username (store_id, username)
);
```

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | 관리자 고유 ID |
| store_id | VARCHAR(36) | FK → stores | 소속 매장 |
| username | VARCHAR(50) | NOT NULL, UNIQUE(store_id) | 사용자명 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |

---

## 3. Table (테이블)

```sql
CREATE TABLE tables (
  id            VARCHAR(36) PRIMARY KEY,
  store_id      VARCHAR(36) NOT NULL,
  table_number  INT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  UNIQUE KEY uq_store_table (store_id, table_number)
);
```

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | 테이블 고유 ID |
| store_id | VARCHAR(36) | FK → stores | 소속 매장 |
| table_number | INT | NOT NULL, UNIQUE(store_id) | 테이블 번호 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |

---

## 4. Table Session (테이블 세션)

```sql
CREATE TABLE table_sessions (
  id           VARCHAR(36) PRIMARY KEY,
  store_id     VARCHAR(36) NOT NULL,
  table_id     VARCHAR(36) NOT NULL,
  started_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  INDEX idx_active_session (store_id, table_id, is_active)
);
```

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | 세션 고유 ID |
| store_id | VARCHAR(36) | FK → stores | 매장 ID |
| table_id | VARCHAR(36) | FK → tables | 테이블 ID |
| started_at | TIMESTAMP | DEFAULT NOW | 세션 시작 시각 |
| completed_at | TIMESTAMP | NULL | 세션 종료 시각 (이용 완료) |
| is_active | BOOLEAN | DEFAULT TRUE | 활성 세션 여부 |

---

## 5. Login Attempt (로그인 시도 추적)

```sql
CREATE TABLE login_attempts (
  id         VARCHAR(36) PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,       -- "store:{storeId}:admin:{username}" 또는 "store:{storeId}:table:{tableNumber}"
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success    BOOLEAN NOT NULL,
  INDEX idx_identifier_time (identifier, attempted_at)
);
```

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | 시도 고유 ID |
| identifier | VARCHAR(255) | NOT NULL | 로그인 대상 식별자 |
| attempted_at | TIMESTAMP | DEFAULT NOW | 시도 시각 |
| success | BOOLEAN | NOT NULL | 성공 여부 |

---

## Entity Relationship

```
stores 1──N admin_users
stores 1──N tables
stores 1──N table_sessions
tables 1──N table_sessions
```
