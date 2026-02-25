import { useCallback, useEffect, useState } from 'react';
import { tableApi, type CreateTableRequest, type TableResponse } from '../api/tables';
import { useAuth } from './useAuth';

export function useTables() {
  const { storeId } = useAuth();
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await tableApi.getAll(storeId);
      setTables(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '테이블 목록 조회 실패';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (data: CreateTableRequest) => {
    if (!storeId) return;
    const res = await tableApi.create(storeId, data);
    setTables((prev) => [...prev, res.data]);
    return res.data;
  }, [storeId]);

  return { tables, loading, error, refetch: fetch, create };
}
