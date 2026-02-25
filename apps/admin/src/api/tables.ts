import { api } from './client';
import type { Table } from '@hai-s/shared';

export interface CreateTableRequest {
  tableNumber: number;
  password: string;
}

// BE 응답 형태 (password_hash 제외)
export type TableResponse = Table;

export const tableApi = {
  getAll(storeId: number) {
    return api.get<TableResponse[]>(`/stores/${storeId}/tables`);
  },

  getOne(storeId: number, tableId: number) {
    return api.get<TableResponse>(`/stores/${storeId}/tables/${tableId}`);
  },

  create(storeId: number, data: CreateTableRequest) {
    return api.post<TableResponse>(`/stores/${storeId}/tables`, data);
  },
};
