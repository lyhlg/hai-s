import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function TableManagement({ storeId }: { storeId: string }) {
  const [tables, setTables] = useState<any[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [historyTable, setHistoryTable] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const load = () => api.getTables(storeId).then(setTables).catch(() => {});
  useEffect(() => { load(); }, [storeId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createTable(storeId, Number(tableNumber), password);
      setTableNumber("");
      setPassword("");
      load();
    } catch (err: any) { setError(err.message); }
  };

  const handleViewHistory = async (table: any) => {
    setHistoryTable(table);
    try {
      const orders = await api.getOrderHistory(storeId, table.id);
      setHistory(orders);
    } catch { setHistory([]); }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>테이블 관리</h3>
      <form onSubmit={handleCreate} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="테이블 번호" type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required style={{ padding: 8 }} />
        <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 8 }} />
        <button type="submit" style={{ padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap" }}>추가</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
        {tables.map((t) => (
          <div key={t.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ fontWeight: "bold", fontSize: 18 }}>{t.tableNumber}</div>
            <button onClick={() => handleViewHistory(t)} style={{ marginTop: 8, padding: "4px 8px", fontSize: 12, border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>과거 내역</button>
          </div>
        ))}
      </div>

      {historyTable && (
        <div style={{ marginTop: 24 }}>
          <h4>테이블 {historyTable.tableNumber} 과거 내역</h4>
          {history.length === 0 && <p style={{ color: "#999" }}>과거 주문 내역이 없습니다</p>}
          {history.map((order) => (
            <div key={order.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, marginBottom: 8, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{new Date(order.created_at).toLocaleString()}</span>
                <span style={{ fontWeight: "bold" }}>{order.total_amount?.toLocaleString()}원</span>
              </div>
              {order.items?.map((item: any) => (
                <div key={item.id} style={{ color: "#666", paddingLeft: 8 }}>{item.menu_item_name} x {item.quantity}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
