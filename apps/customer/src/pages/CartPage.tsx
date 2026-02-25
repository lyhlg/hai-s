import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: 18, color: "#999" }}>장바구니가 비어있습니다</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "12px 24px", fontSize: 16, background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          메뉴 보기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      <h2 style={{ marginBottom: 16 }}>장바구니</h2>
      {items.map((item) => (
        <div key={item.menuItemId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottom: "1px solid #eee" }}>
          <div>
            <div style={{ fontWeight: "bold" }}>{item.name}</div>
            <div style={{ color: "#666" }}>{item.price.toLocaleString()}원</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} style={{ width: 36, height: 36, fontSize: 20, border: "1px solid #ccc", borderRadius: 8, background: "#fff", cursor: "pointer" }}>-</button>
            <span style={{ fontSize: 18, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} style={{ width: 36, height: 36, fontSize: 20, border: "1px solid #ccc", borderRadius: 8, background: "#fff", cursor: "pointer" }}>+</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <button onClick={clearCart} style={{ padding: "8px 16px", fontSize: 14, background: "#fff", border: "1px solid #ccc", borderRadius: 8, cursor: "pointer", marginRight: 8 }}>
          장바구니 비우기
        </button>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eee", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>총 금액</span>
          <span style={{ fontSize: 20, fontWeight: "bold" }}>{totalAmount.toLocaleString()}원</span>
        </div>
        <button onClick={() => navigate("/order-confirm")} style={{ width: "100%", padding: 16, fontSize: 18, background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          주문하기
        </button>
      </div>
    </div>
  );
}
