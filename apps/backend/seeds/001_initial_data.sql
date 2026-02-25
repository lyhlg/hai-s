-- Mock Data for hai-s 테이블 오더 시스템
-- Schema: stores/admin/tables/sessions = INT AUTO_INCREMENT
--         menu_items/orders/order_items = VARCHAR(36) UUID PK
-- 3개 매장: 이탈리안, 일식, 한식
-- 비밀번호: admin123 / table1234 (bcrypt hash)

-- 1. Stores
INSERT INTO stores (name) VALUES
  ('뚜또베네'),
  ('멘야하나비'),
  ('시골밥상');

-- 2. Admin Users (비밀번호: admin123)
INSERT INTO admin_users (store_id, username, password_hash) VALUES
  (1, 'tutto_admin',  '$2a$10$CAynLjyBG/neV.O9GGbN5eVp6oJfQN5yWR3euJgMzAGjfb9Gq9DdS'),
  (2, 'menya_admin',  '$2a$10$CAynLjyBG/neV.O9GGbN5eVp6oJfQN5yWR3euJgMzAGjfb9Gq9DdS'),
  (3, 'sigol_admin',  '$2a$10$CAynLjyBG/neV.O9GGbN5eVp6oJfQN5yWR3euJgMzAGjfb9Gq9DdS');

-- 3. Tables (비밀번호: table1234)
INSERT INTO tables_ (store_id, table_number, capacity, is_active, password_hash) VALUES
  (1, 'T1', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (1, 'T2', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (1, 'T3', 2, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (1, 'T4', 6, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (1, 'T5', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (2, 'T1', 2, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (2, 'T2', 2, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (2, 'T3', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (2, 'T4', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (3, 'T1', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (3, 'T2', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (3, 'T3', 6, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (3, 'T4', 4, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm'),
  (3, 'T5', 2, TRUE, '$2a$10$Vga/6n91u4dyggUUdL8.EOSKxPv6LT5t52tLVuQU2NUe50KwjENHm');

-- 4. Table Sessions
INSERT INTO table_sessions (store_id, table_id, started_at, is_active) VALUES
  (1, 1, '2026-02-25 12:00:00', TRUE),
  (1, 2, '2026-02-25 12:15:00', TRUE),
  (1, 3, '2026-02-25 11:30:00', TRUE),
  (2, 6, '2026-02-25 12:10:00', TRUE),
  (2, 7, '2026-02-25 12:30:00', TRUE),
  (3, 10, '2026-02-25 11:45:00', TRUE),
  (3, 11, '2026-02-25 12:20:00', TRUE),
  (3, 13, '2026-02-25 12:05:00', TRUE);
INSERT INTO table_sessions (store_id, table_id, started_at, completed_at, is_active) VALUES
  (1, 4, '2026-02-25 10:00:00', '2026-02-25 11:30:00', FALSE),
  (2, 8, '2026-02-25 10:30:00', '2026-02-25 11:45:00', FALSE),
  (3, 12, '2026-02-25 10:15:00', '2026-02-25 11:20:00', FALSE);

-- 5. Menu Items (UUID PK, INT store_id FK)

-- 뚜또베네 (이탈리안)
INSERT INTO menu_items (id, store_id, name, description, price, category, is_available, is_popular, display_order) VALUES
  ('mi-tutto-01', 1, '브루스케타',       '구운 바게트 위에 토마토, 바질, 올리브오일',     8000,  '에피타이저', TRUE, FALSE, 1),
  ('mi-tutto-02', 1, '카프레제 샐러드',   '모짜렐라, 토마토, 바질 페스토',               12000, '에피타이저', TRUE, FALSE, 2),
  ('mi-tutto-03', 1, '시저 샐러드',       '로메인, 파마산, 크루통, 시저 드레싱',         11000, '에피타이저', TRUE, FALSE, 3),
  ('mi-tutto-04', 1, '까르보나라',        '관찰레, 계란 노른자, 페코리노 치즈',          15000, '파스타',     TRUE, TRUE,  4),
  ('mi-tutto-05', 1, '봉골레 파스타',     '바지락, 화이트와인, 마늘, 올리브오일',        16000, '파스타',     TRUE, TRUE,  5),
  ('mi-tutto-06', 1, '감바스 파스타',     '새우, 마늘, 페페론치노, 올리브오일',          17000, '파스타',     TRUE, FALSE, 6),
  ('mi-tutto-07', 1, '뽀모도로',          '산마르자노 토마토, 바질, 마늘',               13000, '파스타',     TRUE, FALSE, 7),
  ('mi-tutto-08', 1, '마르게리타 피자',   '모짜렐라, 토마토소스, 바질',                  16000, '피자',       TRUE, TRUE,  8),
  ('mi-tutto-09', 1, '페퍼로니 피자',     '페퍼로니, 모짜렐라, 토마토소스',              18000, '피자',       TRUE, FALSE, 9),
  ('mi-tutto-10', 1, '고르곤졸라 피자',   '고르곤졸라, 모짜렐라, 꿀',                    19000, '피자',       TRUE, FALSE, 10),
  ('mi-tutto-11', 1, '해산물 리조또',     '새우, 홍합, 오징어, 사프란',                  18000, '리조또',     TRUE, FALSE, 11),
  ('mi-tutto-12', 1, '트러플 리조또',     '트러플오일, 파마산, 버섯',                    20000, '리조또',     TRUE, TRUE,  12),
  ('mi-tutto-13', 1, '탄산수',            '산펠레그리노 500ml',                           3000,  '음료',       TRUE, FALSE, 13),
  ('mi-tutto-14', 1, '콜라',              '코카콜라 355ml',                               2000,  '음료',       TRUE, FALSE, 14),
  ('mi-tutto-15', 1, '아이스티',          '복숭아 아이스티',                              3000,  '음료',       TRUE, FALSE, 15);

-- 멘야하나비 (일식)
INSERT INTO menu_items (id, store_id, name, description, price, category, is_available, is_popular, display_order) VALUES
  ('mi-menya-01', 2, '돈코츠 라멘',       '18시간 우린 돼지뼈 육수, 차슈, 반숙란',      10000, '라멘',       TRUE, TRUE,  1),
  ('mi-menya-02', 2, '쇼유 라멘',         '간장 베이스 맑은 육수, 차슈, 파',             9000,  '라멘',       TRUE, FALSE, 2),
  ('mi-menya-03', 2, '미소 라멘',         '된장 베이스 육수, 콘, 버터, 차슈',            10000, '라멘',       TRUE, FALSE, 3),
  ('mi-menya-04', 2, '매운 탄탄멘',       '참깨, 고추기름, 돼지고기 소보로',             11000, '라멘',       TRUE, TRUE,  4),
  ('mi-menya-05', 2, '츠케멘',            '진한 돈코츠 쯔유에 찍어먹는 면',              12000, '라멘',       TRUE, FALSE, 5),
  ('mi-menya-06', 2, '로스카츠',          '등심 돈까스 180g, 양배추, 소스',              13000, '돈까스',     TRUE, TRUE,  6),
  ('mi-menya-07', 2, '히레카츠',          '안심 돈까스 150g, 양배추, 소스',              14000, '돈까스',     TRUE, FALSE, 7),
  ('mi-menya-08', 2, '치즈카츠',          '모짜렐라 치즈 돈까스 180g',                   15000, '돈까스',     TRUE, FALSE, 8),
  ('mi-menya-09', 2, '카츠동',            '돈까스 계란 덮밥',                            12000, '돈까스',     TRUE, FALSE, 9),
  ('mi-menya-10', 2, '교자 (5개)',         '돼지고기 군만두',                              5000,  '사이드',     TRUE, FALSE, 10),
  ('mi-menya-11', 2, '에다마메',           '소금 삶은 풋콩',                               4000,  '사이드',     TRUE, FALSE, 11),
  ('mi-menya-12', 2, '추가 차슈 (3장)',    '저온 조리 차슈',                               3000,  '사이드',     TRUE, FALSE, 12),
  ('mi-menya-13', 2, '반숙란 추가',        '라멘용 반숙 양념란',                           1500,  '사이드',     TRUE, FALSE, 13),
  ('mi-menya-14', 2, '라무네',             '일본 탄산음료',                                3000,  '음료',       TRUE, FALSE, 14),
  ('mi-menya-15', 2, '콜라',               '코카콜라 355ml',                               2000,  '음료',       TRUE, FALSE, 15),
  ('mi-menya-16', 2, '우롱차',             '산토리 우롱차 500ml',                          2500,  '음료',       TRUE, FALSE, 16);

-- 시골밥상 (한식)
INSERT INTO menu_items (id, store_id, name, description, price, category, is_available, is_popular, display_order) VALUES
  ('mi-sigol-01', 3, '제육볶음',           '매콤 돼지고기 볶음, 공기밥 포함',             10000, '메인',       TRUE, TRUE,  1),
  ('mi-sigol-02', 3, '김치찌개',           '묵은지 돼지고기 김치찌개, 공기밥 포함',        8000,  '메인',       TRUE, TRUE,  2),
  ('mi-sigol-03', 3, '된장찌개',           '두부, 호박, 감자, 공기밥 포함',                8000,  '메인',       TRUE, FALSE, 3),
  ('mi-sigol-04', 3, '순두부찌개',         '순두부, 해물, 계란, 공기밥 포함',              9000,  '메인',       TRUE, FALSE, 4),
  ('mi-sigol-05', 3, '불고기',             '양념 소불고기, 공기밥 포함',                  12000, '메인',       TRUE, TRUE,  5),
  ('mi-sigol-06', 3, '비빔밥',             '각종 나물, 고추장, 계란 프라이',               9000,  '메인',       TRUE, FALSE, 6),
  ('mi-sigol-07', 3, '돌솥비빔밥',         '돌솥에 나오는 비빔밥, 누룽지',                11000, '메인',       TRUE, FALSE, 7),
  ('mi-sigol-08', 3, '부대찌개 (2인)',     '햄, 소시지, 라면사리, 떡',                    18000, '찌개/탕',    TRUE, FALSE, 8),
  ('mi-sigol-09', 3, '감자탕 (2인)',       '돼지 등뼈, 감자, 우거지',                     22000, '찌개/탕',    TRUE, FALSE, 9),
  ('mi-sigol-10', 3, '계란말이',           '부드러운 계란말이',                             5000,  '사이드',     TRUE, FALSE, 10),
  ('mi-sigol-11', 3, '김치전',             '바삭한 김치전',                                 7000,  '사이드',     TRUE, FALSE, 11),
  ('mi-sigol-12', 3, '공기밥 추가',        '흰쌀밥',                                       1000,  '사이드',     TRUE, FALSE, 12),
  ('mi-sigol-13', 3, '콜라',               '코카콜라 355ml',                                2000,  '음료',       TRUE, FALSE, 13),
  ('mi-sigol-14', 3, '사이다',             '칠성사이다 355ml',                              2000,  '음료',       TRUE, FALSE, 14),
  ('mi-sigol-15', 3, '식혜',               '전통 식혜 500ml',                               3000,  '음료',       TRUE, FALSE, 15);

-- 6. Orders & Order Items

-- === 뚜또베네 ===
INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-tutto-01', 1, 1, 1, 'served', 35000, '2026-02-25 12:05:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-tutto-01', 'ord-tutto-01', 'mi-tutto-04', '까르보나라',      1, 15000, 15000),
  ('oi-tutto-02', 'ord-tutto-01', 'mi-tutto-08', '마르게리타 피자', 1, 16000, 16000),
  ('oi-tutto-03', 'ord-tutto-01', 'mi-tutto-14', '콜라',            2, 2000,  4000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-tutto-02', 1, 2, 2, 'preparing', 51000, '2026-02-25 12:20:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-tutto-04', 'ord-tutto-02', 'mi-tutto-05', '봉골레 파스타',   1, 16000, 16000),
  ('oi-tutto-05', 'ord-tutto-02', 'mi-tutto-12', '트러플 리조또',   1, 20000, 20000),
  ('oi-tutto-06', 'ord-tutto-02', 'mi-tutto-02', '카프레제 샐러드', 1, 12000, 12000),
  ('oi-tutto-07', 'ord-tutto-02', 'mi-tutto-13', '탄산수',          1, 3000,  3000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-tutto-03', 1, 3, 3, 'confirmed', 59000, '2026-02-25 11:35:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-tutto-08', 'ord-tutto-03', 'mi-tutto-06', '감바스 파스타',   2, 17000, 34000),
  ('oi-tutto-09', 'ord-tutto-03', 'mi-tutto-10', '고르곤졸라 피자', 1, 19000, 19000),
  ('oi-tutto-10', 'ord-tutto-03', 'mi-tutto-15', '아이스티',        2, 3000,  6000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-tutto-04', 1, 9, 4, 'served', 26000, '2026-02-25 10:10:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-tutto-11', 'ord-tutto-04', 'mi-tutto-07', '뽀모도로',    1, 13000, 13000),
  ('oi-tutto-12', 'ord-tutto-04', 'mi-tutto-03', '시저 샐러드', 1, 11000, 11000),
  ('oi-tutto-13', 'ord-tutto-04', 'mi-tutto-14', '콜라',        1, 2000,  2000);

-- === 멘야하나비 ===
INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-menya-01', 2, 4, 6, 'served', 18000, '2026-02-25 12:15:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-menya-01', 'ord-menya-01', 'mi-menya-01', '돈코츠 라멘', 1, 10000, 10000),
  ('oi-menya-02', 'ord-menya-01', 'mi-menya-10', '교자 (5개)',  1, 5000,  5000),
  ('oi-menya-03', 'ord-menya-01', 'mi-menya-14', '라무네',      1, 3000,  3000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-menya-02', 2, 4, 6, 'pending', 4500, '2026-02-25 12:25:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-menya-04', 'ord-menya-02', 'mi-menya-12', '추가 차슈 (3장)', 1, 3000, 3000),
  ('oi-menya-05', 'ord-menya-02', 'mi-menya-13', '반숙란 추가',     1, 1500, 1500);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-menya-03', 2, 5, 7, 'preparing', 29000, '2026-02-25 12:35:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-menya-06', 'ord-menya-03', 'mi-menya-07', '히레카츠',  1, 14000, 14000),
  ('oi-menya-07', 'ord-menya-03', 'mi-menya-03', '미소 라멘', 1, 10000, 10000),
  ('oi-menya-08', 'ord-menya-03', 'mi-menya-16', '우롱차',    2, 2500,  5000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-menya-04', 2, 10, 8, 'served', 30000, '2026-02-25 10:40:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-menya-09', 'ord-menya-04', 'mi-menya-06', '로스카츠',   1, 13000, 13000),
  ('oi-menya-10', 'ord-menya-04', 'mi-menya-02', '쇼유 라멘',  1, 9000,  9000),
  ('oi-menya-11', 'ord-menya-04', 'mi-menya-11', '에다마메',   1, 4000,  4000),
  ('oi-menya-12', 'ord-menya-04', 'mi-menya-15', '콜라',       2, 2000,  4000);

-- === 시골밥상 ===
INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-sigol-01', 3, 6, 10, 'served', 29000, '2026-02-25 11:50:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-sigol-01', 'ord-sigol-01', 'mi-sigol-01', '제육볶음',  2, 10000, 20000),
  ('oi-sigol-02', 'ord-sigol-01', 'mi-sigol-10', '계란말이',  1, 5000,  5000),
  ('oi-sigol-03', 'ord-sigol-01', 'mi-sigol-13', '콜라',      2, 2000,  4000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-sigol-02', 3, 6, 10, 'pending', 8000, '2026-02-25 12:10:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-sigol-04', 'ord-sigol-02', 'mi-sigol-11', '김치전',      1, 7000, 7000),
  ('oi-sigol-05', 'ord-sigol-02', 'mi-sigol-12', '공기밥 추가', 1, 1000, 1000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-sigol-03', 3, 7, 11, 'confirmed', 23000, '2026-02-25 12:25:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-sigol-06', 'ord-sigol-03', 'mi-sigol-08', '부대찌개 (2인)', 1, 18000, 18000),
  ('oi-sigol-07', 'ord-sigol-03', 'mi-sigol-12', '공기밥 추가',    1, 1000,  1000),
  ('oi-sigol-08', 'ord-sigol-03', 'mi-sigol-14', '사이다',         2, 2000,  4000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-sigol-04', 3, 8, 13, 'preparing', 23000, '2026-02-25 12:10:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-sigol-09', 'ord-sigol-04', 'mi-sigol-03', '된장찌개', 1, 8000,  8000),
  ('oi-sigol-10', 'ord-sigol-04', 'mi-sigol-06', '비빔밥',   1, 9000,  9000),
  ('oi-sigol-11', 'ord-sigol-04', 'mi-sigol-15', '식혜',     2, 3000,  6000);

INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at) VALUES
  ('ord-sigol-05', 3, 11, 12, 'served', 34000, '2026-02-25 10:25:00');
INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
  ('oi-sigol-12', 'ord-sigol-05', 'mi-sigol-05', '불고기',      1, 12000, 12000),
  ('oi-sigol-13', 'ord-sigol-05', 'mi-sigol-07', '돌솥비빔밥',  1, 11000, 11000),
  ('oi-sigol-14', 'ord-sigol-05', 'mi-sigol-11', '김치전',      1, 7000,  7000),
  ('oi-sigol-15', 'ord-sigol-05', 'mi-sigol-13', '콜라',        2, 2000,  4000);
