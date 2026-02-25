import { useState } from "react";
import { api } from "../api/client";

export default function LoginPage({ onLogin }: { onLogin: (storeId: string) => void }) {
  const [storeId, setStoreId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.adminLogin(storeId, username, password);
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_storeId", storeId);
      onLogin(storeId);
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "40px auto" }}>
      <h1>관리자 로그인</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="storeId">매장 ID</label>
          <input id="storeId" value={storeId} onChange={(e) => setStoreId(e.target.value)} style={{ display: "block", width: "100%", padding: 10, fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username">사용자명</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ display: "block", width: "100%", padding: 10, fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">비밀번호</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", padding: 10, fontSize: 16 }} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 12, fontSize: 16, background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>로그인</button>
      </form>
    </div>
  );
}
