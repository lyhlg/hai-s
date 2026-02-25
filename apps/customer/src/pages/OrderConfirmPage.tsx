import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { api } from "../api/client";

export default function OrderConfirmPage() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const storeId = Number(localStorage.getItem("storeId")) || 0;
  const tableId = Number(localStorage.getItem("tableId")) || 0;
  const sessionId = Number(localStorage.getItem("sessionId")) || 0;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      const order = await api.createOrder(
        storeId,
        tableId,
        sessionId,
        items.map((i) => ({ menuId: Number(i.menuItemId), quantity: i.quantity, unitPrice: i.price }))
      );
      setOrderId(order.id);
      clearCart();
      setTimeout(() => navigate("/"), 5000);
    } catch (err: any) {
      setError(err.message || "주문에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2>주문 완료!</h2>
        <p style={{ fontSize: 14, color: "#666", marginTop: 8 }}>주문번호: {String(orderId).slice(0, 8)}</p>
        <p style={{ color: "#999", marginTop: 16 }}>5초 후 메뉴 화면으로 이동합니다</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>주문 확인</h2>
      {items.map((item) => (
        <div key={item.menuItemId} style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #eee" }}>
          <span>{item.name} x {item.quantity}</span>
          <span>{(item.price * item.quantity).toLocaleString()}원</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", padding: 16, fontWeight: "bold", fontSize: 18 }}>
        <span>총 금액</span>
        <span>{totalAmount.toLocaleString()}원</span>
      </div>
      {error && <p style={{ color: "red", padding: "0 16px" }}>{error}</p>}
      <button disabled={submitting} onClick={handleConfirm} style={{ width: "100%", padding: 16, fontSize: 18, background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 16 }}>
        {submitting ? "주문 중..." : "주문 확정"}
      </button>
    </div>
  );
}
