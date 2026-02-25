import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription } from '@hai-s/dd';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeId || !username || !password) {
      setError('모든 필드를 입력해주세요');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login({ storeId: Number(storeId), username, password });
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? '로그인에 실패했습니다');
      } else {
        setError('로그인에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">관리자 로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="storeId">매장 ID</Label>
              <Input id="storeId" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="매장 ID 입력" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">사용자명</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="사용자명 입력" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
