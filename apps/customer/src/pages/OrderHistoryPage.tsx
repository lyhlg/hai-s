import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { useSSE } from "../hooks/useSSE";

const STATUS_LABEL: Record<string, string> = { pending: "대기중", confirmed: "접수", preparing: "준비중", ready: "완료", served: "서빙완료", cancelled: "취소" };
const STATUS_COLOR: Record<string, string> = { pending: "#ff9800", confirmed: "#2196f3", preparing: "#2196f3", ready: "#4caf50", served: "#9e9e9e", cancelled: "#f44336" };

export default function OrderHistoryPage({ sessionId }: { sessionId: string | null }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (sessionId) api.getOrders(sessionId).then(setOrders).catch(() => {});
  }, [sessionId]);

  const handleSSE = useCallback((event: any) => {
    if (event.type === "order:updated" || event.type === "order:cancelled") {
      setOrders((prev) => prev.map((o) => (o.id === event.data.order_id ? { ...o, status: event.data.status } : o)));
    }
  }, []);

  useSSE("/api/sse/table-orders", handleSSE);

  if (!sessionId) return <div style={{ padding: 24, textAlign: "center", color: "#999" }}>주문 내역이 없습니다</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>주문 내역</h2>
      {orders.length === 0 && <p style={{ color: "#999" }}>주문 내역이 없습니다</p>}
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "#666" }}>{new Date(order.created_at).toLocaleTimeString()}</span>
            <span style={{ padding: "2px 8px", borderRadius: 12, background: STATUS_COLOR[order.status] || "#999", color: "#fff", fontSize: 12 }}>
              {STATUS_LABEL[order.status] || order.status}
            </span>
          </div>
          {order.items?.map((item: any) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "2px 0" }}>
              <span>{item.menu_item_name} x {item.quantity}</span>
              <span>{item.subtotal?.toLocaleString()}원</span>
            </div>
          ))}
          <div style={{ textAlign: "right", fontWeight: "bold", marginTop: 8 }}>{order.total_amount?.toLocaleString()}원</div>
        </div>
      ))}
    </div>
  );
}
