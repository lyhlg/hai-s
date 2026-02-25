import { useState } from "react";
import { api } from "../api/client";

export default function SettlementPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const result = await api.getDailySales(date);
      setData(result);
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>일매출 정산</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: 8 }} />
        <button onClick={load} style={{ padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>조회</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <>
          <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: "#666" }}>{data.date} 매출</div>
            <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 4 }}>{data.total_amount?.toLocaleString()}원</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>주문 {data.total_orders}건</div>
          </div>
          {data.tables?.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: 8 }}>테이블</th>
                  <th style={{ textAlign: "right", padding: 8 }}>주문 수</th>
                  <th style={{ textAlign: "right", padding: 8 }}>매출</th>
                </tr>
              </thead>
              <tbody>
                {data.tables.map((t: any) => (
                  <tr key={t.table_id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 8 }}>T{t.table_number}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{t.total_orders}건</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{t.total_amount?.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {data.tables?.length === 0 && <p style={{ color: "#999" }}>매출 내역이 없습니다</p>}
        </>
      )}
    </div>
  );
}
