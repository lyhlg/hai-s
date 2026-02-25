import { useState, type FormEvent } from 'react';
import { useTables } from '../../hooks/useTables';
import { AxiosError } from 'axios';

export function TablesPage() {
  const { tables, loading, error: fetchError, create } = useTables();
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const num = Number(tableNumber);
    if (!num || num <= 0 || !password) {
      setCreateError('테이블 번호(양수)와 비밀번호를 입력해주세요');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      await create({ tableNumber: num, password });
      setTableNumber('');
      setPassword('');
    } catch (err) {
      if (err instanceof AxiosError) {
        setCreateError(err.response?.data?.message ?? '테이블 생성 실패');
      } else {
        setCreateError('테이블 생성 실패');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1>테이블 관리</h1>

      <section>
        <h2>테이블 생성</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label htmlFor="tableNumber">테이블 번호</label>
            <input id="tableNumber" type="number" min="1" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tablePassword">비밀번호</label>
            <input id="tablePassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {createError && <p role="alert">{createError}</p>}
          <button type="submit" disabled={creating}>{creating ? '생성 중...' : '테이블 생성'}</button>
        </form>
      </section>

      <section>
        <h2>테이블 목록</h2>
        {loading && <p>로딩 중...</p>}
        {fetchError && <p role="alert">{fetchError}</p>}
        {!loading && tables.length === 0 && <p>등록된 테이블이 없습니다</p>}
        {tables.length > 0 && (
          <table>
            <thead>
              <tr><th>ID</th><th>테이블 번호</th><th>수용 인원</th><th>활성</th></tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.table_number}</td>
                  <td>{t.capacity}</td>
                  <td>{t.is_active ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
