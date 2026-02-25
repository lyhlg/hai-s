# Component Methods

> 메서드 시그니처 및 입출력 정의. 상세 비즈니스 로직은 Functional Design에서 정의.

---

## Auth Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `LoginAdmin` | `{storeId, username, password}` | `{token, expiresAt}` | 관리자 로그인, JWT 발급 |
| `LoginTable` | `{storeId, tableNumber, password}` | `{token, storeId, tableId}` | 테이블 태블릿 로그인 |
| `ValidateToken` | `{token}` | `{valid, claims}` | JWT 토큰 검증 |
| `CheckLoginAttempts` | `{identifier}` | `{allowed, remainingAttempts}` | 로그인 시도 제한 확인 |

---

## Store Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `GetStore` | `{storeId}` | `{store}` | 매장 정보 조회 |
| `ValidateStore` | `{storeId}` | `{valid}` | 매장 존재 여부 확인 |

---

## Table Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `CreateTable` | `{storeId, tableNumber, password}` | `{table}` | 테이블 생성 |
| `GetTable` | `{storeId, tableId}` | `{table}` | 테이블 조회 |
| `GetTables` | `{storeId}` | `{tables[]}` | 매장 전체 테이블 목록 |
| `StartSession` | `{storeId, tableId}` | `{sessionId}` | 테이블 세션 시작 |
| `EndSession` | `{storeId, tableId}` | `{completedAt}` | 테이블 세션 종료 (이용 완료) |
| `GetActiveSession` | `{storeId, tableId}` | `{session \| null}` | 현재 활성 세션 조회 |

---

## Menu Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `CreateMenu` | `{storeId, name, price, description, categoryId, imageUrl, isPopular, isSoldOut}` | `{menu}` | 메뉴 등록 |
| `UpdateMenu` | `{menuId, ...fields}` | `{menu}` | 메뉴 수정 (품절 여부 포함) |
| `DeleteMenu` | `{menuId}` | `{success}` | 메뉴 삭제 |
| `GetMenus` | `{storeId}` | `{menus[]}` | 매장 메뉴 목록 (카테고리별) |
| `GetMenu` | `{menuId}` | `{menu}` | 메뉴 상세 조회 |
| `UpdateMenuOrder` | `{storeId, menuOrders[]}` | `{success}` | 메뉴 노출 순서 변경 |
| `GetCategories` | `{storeId}` | `{categories[]}` | 카테고리 목록 |

---

## Order Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `CreateOrder` | `{storeId, tableId, sessionId, items[{menuId, quantity, unitPrice}]}` | `{order}` | 주문 생성 |
| `GetOrder` | `{orderId}` | `{order}` | 주문 상세 조회 |
| `GetOrdersBySession` | `{sessionId}` | `{orders[]}` | 세션별 주문 목록 |
| `GetOrdersByTable` | `{storeId, tableId}` | `{orders[]}` | 테이블 현재 주문 목록 |
| `UpdateOrderStatus` | `{orderId, status}` | `{order}` | 주문 상태 변경 |
| `DeleteOrder` | `{orderId}` | `{success}` | 주문 삭제 |
| `GetOrderHistory` | `{storeId, tableId, dateFrom?, dateTo?}` | `{orders[]}` | 과거 주문 내역 |
| `GetTableTotal` | `{storeId, tableId}` | `{totalAmount}` | 테이블 총 주문액 |

---

## Settlement Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `GetDailySales` | `{storeId, date}` | `{totalAmount, tableBreakdown[]}` | 일매출 조회 |

---

## SSE Component

| Method | Input | Output | 설명 |
|--------|-------|--------|------|
| `Subscribe` | `{storeId, clientType, tableId?}` | `SSE Stream` | SSE 연결 구독 |
| `PublishOrderEvent` | `{storeId, eventType, order}` | - | 주문 이벤트 발행 |
