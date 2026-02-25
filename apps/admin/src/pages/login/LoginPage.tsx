import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AxiosError } from 'axios';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeId || !username || !password) {
      setError('모든 필드를 입력해주세요');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login({ storeId, username, password });
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message ?? '로그인에 실패했습니다';
        setError(msg);
      } else {
        setError('로그인에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>관리자 로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="storeId">매장 ID</label>
          <input id="storeId" value={storeId} onChange={(e) => setStoreId(e.target.value)} />
        </div>
        <div>
          <label htmlFor="username">사용자명</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? '로그인 중...' : '로그인'}</button>
      </form>
    </div>
  );
}
