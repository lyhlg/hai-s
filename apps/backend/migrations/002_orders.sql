-- Menu items (Unit 2 dependency - needed for order FK)
CREATE TABLE IF NOT EXISTS menu_items (
  id            VARCHAR(36) PRIMARY KEY,
  store_id      VARCHAR(36) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  description   TEXT NULL,
  price         INT NOT NULL,
  category      VARCHAR(50) NOT NULL,
  image_url     VARCHAR(500) NULL,
  is_available  BOOLEAN DEFAULT TRUE,
  is_popular    BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Orders
CREATE TABLE orders (
  id            VARCHAR(36) PRIMARY KEY,
  store_id      VARCHAR(36) NOT NULL,
  session_id    VARCHAR(36) NOT NULL,
  table_id      VARCHAR(36) NOT NULL,
  status        ENUM('pending','confirmed','preparing','ready','served','cancelled') DEFAULT 'pending',
  total_amount  INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (session_id) REFERENCES table_sessions(id),
  FOREIGN KEY (table_id) REFERENCES tables_(id),
  INDEX idx_session (session_id),
  INDEX idx_store_status (store_id, status)
);

-- Order items
CREATE TABLE order_items (
  id             VARCHAR(36) PRIMARY KEY,
  order_id       VARCHAR(36) NOT NULL,
  menu_item_id   VARCHAR(36) NOT NULL,
  menu_item_name VARCHAR(100) NOT NULL,
  quantity       INT NOT NULL,
  unit_price     INT NOT NULL,
  subtotal       INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
