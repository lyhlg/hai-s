import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [storeId, setStoreId] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(storeId, Number(tableNumber), password);
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h1>테이블 초기 설정</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="storeId">매장 ID</label>
          <input id="storeId" value={storeId} onChange={(e) => setStoreId(e.target.value)} style={{ display: "block", width: "100%", padding: 12, fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="tableNumber">테이블 번호</label>
          <input id="tableNumber" type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} style={{ display: "block", width: "100%", padding: 12, fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">비밀번호</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", padding: 12, fontSize: 16 }} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 14, fontSize: 18, background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          설정 완료
        </button>
      </form>
    </div>
  );
}
