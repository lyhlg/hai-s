import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function MenuManagement({ storeId }: { storeId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", imageUrl: "", isPopular: false });

  const load = () => api.getMenu(storeId).then(setItems).catch(() => {});
  useEffect(() => { load(); }, [storeId]);

  const resetForm = () => { setForm({ name: "", price: "", category: "", description: "", imageUrl: "", isPopular: false }); setEditItem(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, price: Number(form.price), category: form.category, description: form.description || undefined, imageUrl: form.imageUrl || undefined, isPopular: form.isPopular };
    try {
      if (editItem) {
        await api.updateMenuItem(storeId, editItem.id, data);
      } else {
        await api.createMenuItem(storeId, data);
      }
      resetForm();
      load();
    } catch (err: any) { alert(err.message); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ name: item.name, price: String(item.price), category: item.category, description: item.description || "", imageUrl: item.image_url || "", isPopular: item.is_popular });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 메뉴를 삭제하시겠습니까?")) return;
    try { await api.deleteMenuItem(storeId, id); load(); } catch (err: any) { alert(err.message); }
  };

  const handleToggleAvailable = async (item: any) => {
    try { await api.updateMenuItem(storeId, item.id, { isAvailable: !item.is_available }); load(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3>메뉴 관리</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>+ 메뉴 추가</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="메뉴명 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ padding: 8 }} />
            <input placeholder="가격 *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required style={{ padding: 8 }} />
            <input placeholder="카테고리 *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required style={{ padding: 8 }} />
            <input placeholder="이미지 URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} style={{ padding: 8 }} />
          </div>
          <input placeholder="설명" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: 8, width: "100%", marginTop: 12 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} /> 인기 메뉴
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" style={{ padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>{editItem ? "수정" : "등록"}</button>
            <button type="button" onClick={resetForm} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}>취소</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee" }}>
            <th style={{ textAlign: "left", padding: 8 }}>메뉴명</th>
            <th style={{ textAlign: "left", padding: 8 }}>카테고리</th>
            <th style={{ textAlign: "right", padding: 8 }}>가격</th>
            <th style={{ textAlign: "center", padding: 8 }}>상태</th>
            <th style={{ textAlign: "center", padding: 8 }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>
                {item.name}
                {item.is_popular && <span style={{ marginLeft: 4, background: "#ff9800", color: "#fff", padding: "1px 4px", borderRadius: 4, fontSize: 10 }}>인기</span>}
              </td>
              <td style={{ padding: 8 }}>{item.category}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{item.price?.toLocaleString()}원</td>
              <td style={{ padding: 8, textAlign: "center" }}>
                <button onClick={() => handleToggleAvailable(item)} style={{ padding: "4px 8px", background: item.is_available ? "#4caf50" : "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>
                  {item.is_available ? "판매중" : "품절"}
                </button>
              </td>
              <td style={{ padding: 8, textAlign: "center" }}>
                <button onClick={() => handleEdit(item)} style={{ marginRight: 4, padding: "4px 8px", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>수정</button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: "4px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
