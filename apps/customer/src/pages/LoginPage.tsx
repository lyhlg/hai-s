import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@hai-s/dd";
import { Button, Input, Field, Spinner, Alert, AlertDescription } from "@hai-s/dd";

export default function LoginPage() {
  const { login } = useAuth();
  const [storeId, setStoreId] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(Number(storeId), tableNumber, password);
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">테이블 초기 설정</CardTitle>
          <CardDescription>매장 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="매장 ID" required>
              <Input
                type="number"
                placeholder="매장 ID를 입력하세요"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
              />
            </Field>
            <Field label="테이블 번호" required>
              <Input
                placeholder="테이블 번호를 입력하세요"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
              />
            </Field>
            <Field label="비밀번호" required>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Spinner size="sm" variant="white" /> : "설정 완료"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
