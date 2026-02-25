-- 초기 매장 데이터
-- 비밀번호: admin123 (bcrypt hash)
INSERT INTO stores (name) VALUES ('테스트 매장');

INSERT INTO admin_users (store_id, username, password_hash) VALUES
  (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
