import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useCart } from "../hooks/useCart";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
}

export default function MenuPage({ storeId }: { storeId: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState("");
  const { addItem, totalAmount, totalCount } = useCart();

  useEffect(() => {
    api.getMenu(storeId).then(setItems).catch((e) => setError(e.message));
  }, [storeId]);

  const categories = [...new Set(items.map((i) => i.category))];
  const filtered = selectedCategory ? items.filter((i) => i.category === selectedCategory) : items;

  return (
    <div style={{ paddingBottom: 80 }}>
      {error && <p style={{ color: "red", padding: 16 }}>{error}</p>}

      {/* 카테고리 탭 */}
      <div style={{ display: "flex", gap: 8, padding: 12, overflowX: "auto", borderBottom: "1px solid #eee" }}>
        <button onClick={() => setSelectedCategory("")} style={{ padding: "8px 16px", borderRadius: 20, border: !selectedCategory ? "2px solid #1976d2" : "1px solid #ccc", background: !selectedCategory ? "#e3f2fd" : "#fff", whiteSpace: "nowrap" }}>
          전체
        </button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "8px 16px", borderRadius: 20, border: selectedCategory === cat ? "2px solid #1976d2" : "1px solid #ccc", background: selectedCategory === cat ? "#e3f2fd" : "#fff", whiteSpace: "nowrap" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* 메뉴 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, padding: 12 }}>
        {filtered.map((item) => (
          <div key={item.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, opacity: item.is_available ? 1 : 0.5 }}>
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
            ) : (
              <div style={{ width: "100%", height: 120, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>이미지 없음</div>
            )}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.name}
                {item.is_popular && <span style={{ marginLeft: 4, background: "#ff9800", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>인기</span>}
                {!item.is_available && <span style={{ marginLeft: 4, background: "#f44336", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>품절</span>}
              </div>
              <div style={{ fontSize: 18, fontWeight: "bold", marginTop: 4 }}>{item.price.toLocaleString()}원</div>
            </div>
            <button
              disabled={!item.is_available}
              onClick={() => addItem(item.id, item.name, item.price)}
              style={{ width: "100%", marginTop: 8, padding: 10, fontSize: 16, background: item.is_available ? "#1976d2" : "#ccc", color: "#fff", border: "none", borderRadius: 8, cursor: item.is_available ? "pointer" : "default", minHeight: 44 }}
            >
              담기
            </button>
          </div>
        ))}
      </div>

      {/* 하단 장바구니 바 */}
      {totalCount > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1976d2", color: "#fff", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>장바구니 {totalCount}개</span>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>{totalAmount.toLocaleString()}원</span>
        </div>
      )}
    </div>
  );
}
