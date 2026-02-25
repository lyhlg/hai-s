import { useState, useEffect } from "react";
import { apiMethods } from "../api/client";

const STATUS_LABEL: Record<string, string> = { pending: "대기중", confirmed: "접수", preparing: "준비중", ready: "완료", served: "서빙완료", cancelled: "취소" };
const STATUS_COLOR: Record<string, string> = { pending: "#ff9800", confirmed: "#2196f3", preparing: "#2196f3", ready: "#4caf50", served: "#9e9e9e", cancelled: "#f44336" };
const NEXT_STATUS: Record<string, string> = { pending: "confirmed", confirmed: "preparing", preparing: "ready", ready: "served" };

export default function OrderDashboard({ storeId }: { storeId: string }) {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    apiMethods.getTables(storeId).then(setTables).catch(() => {});
  }, [storeId]);

  // SSE 연결
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    const es = new EventSource(`/api/sse/orders?token=${token}`);
    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === "order:created" || event.type === "order:updated" || event.type === "order:cancelled") {
          // 선택된 테이블의 주문 새로고침
          if (selectedTable) {
            apiMethods.getTables(storeId).then(setTables).catch(() => {});
          }
        }
      } catch { /* ignore */ }
    };
    es.onerror = () => { es.close(); setTimeout(() => {}, 3000); };
    return () => es.close();
  }, [storeId, selectedTable]);

  const loadOrders = async (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    setSelectedTable(table);
    // 활성 세션의 주문을 가져오기 위해 세션 조회
    try {
      const session = await fetch(`/api/stores/${storeId}/tables/${tableId}/session`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      }).then((r) => r.json());
      if (session?.id) {
        const orders = await apiMethods.getOrders(session.id);
        setOrders(orders);
      } else {
        setOrders([]);
      }
    } catch { setOrders([]); }
  };

  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    try {
      await apiMethods.updateOrderStatus(orderId, next);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: next } : o)));
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("이 주문을 삭제하시겠습니까?")) return;
    try {
      await apiMethods.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) { alert(err.message); }
  };

  const handleEndSession = async (tableId: string) => {
    if (!confirm("정말 이용 완료 처리하시겠습니까?")) return;
    try {
      await apiMethods.endSession(storeId, tableId);
      setOrders([]);
      setSelectedTable(null);
      alert("이용 완료 처리되었습니다");
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 50px)" }}>
      {/* 테이블 그리드 */}
      <div style={{ width: 300, borderRight: "1px solid #eee", padding: 12, overflowY: "auto" }}>
        <h3>테이블</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {tables.map((t) => (
            <button key={t.id} onClick={() => loadOrders(t.id)} style={{ padding: 16, border: selectedTable?.id === t.id ? "2px solid #1976d2" : "1px solid #eee", borderRadius: 8, background: selectedTable?.id === t.id ? "#e3f2fd" : "#fff", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontWeight: "bold" }}>{t.tableNumber}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 주문 상세 */}
      <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
        {selectedTable ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3>테이블 {selectedTable.tableNumber} 주문</h3>
              <button 
                onClick={() => handleEndSession(selectedTable.id)} 
                disabled={orders.length === 0}
                style={{ 
                  padding: "8px 16px", 
                  background: orders.length === 0 ? "#ccc" : "#f44336", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 8, 
                  cursor: orders.length === 0 ? "not-allowed" : "pointer" 
                }}
              >
                이용 완료
              </button>
            </div>
            {orders.length === 0 && <p style={{ color: "#999" }}>주문이 없습니다</p>}
            {orders.map((order) => (
              <div key={order.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#666" }}>{new Date(order.created_at).toLocaleTimeString()}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 12, background: STATUS_COLOR[order.status], color: "#fff", fontSize: 12 }}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>
                {order.items?.map((item: any) => (
                  <div key={item.id} style={{ fontSize: 14, padding: "2px 0" }}>{item.menu_item_name} x {item.quantity}</div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: "bold" }}>{order.total_amount?.toLocaleString()}원</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {NEXT_STATUS[order.status] && (
                      <button onClick={() => handleStatusChange(order.id, order.status)} style={{ padding: "6px 12px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                        → {STATUS_LABEL[NEXT_STATUS[order.status]]}
                      </button>
                    )}
                    <button onClick={() => handleDelete(order.id)} style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p style={{ color: "#999", textAlign: "center", marginTop: 40 }}>테이블을 선택하세요</p>
        )}
      </div>
    </div>
  );
}
