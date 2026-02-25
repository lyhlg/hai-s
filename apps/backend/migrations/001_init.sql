CREATE TABLE stores (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  store_id      INT NOT NULL,
  username      VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  UNIQUE KEY uq_store_username (store_id, username)
);

CREATE TABLE tables_ (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  store_id      INT NOT NULL,
  table_number  VARCHAR(10) NOT NULL,
  capacity      INT NOT NULL DEFAULT 4,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  UNIQUE KEY uq_store_table (store_id, table_number)
);

CREATE TABLE table_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  store_id     INT NOT NULL,
  table_id     INT NOT NULL,
  started_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (table_id) REFERENCES tables_(id),
  INDEX idx_active_session (store_id, table_id, is_active)
);

CREATE TABLE login_attempts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  identifier   VARCHAR(255) NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success      BOOLEAN NOT NULL,
  INDEX idx_identifier_time (identifier, attempted_at)
);
