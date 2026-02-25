import { api } from './client';
import type { Table } from '@hai-s/shared';

export interface CreateTableRequest {
  tableNumber: number;
  password: string;
}

// BE 응답에서 password_hash 제외된 형태
export type TableResponse = Omit<Table, 'password_hash'>;

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
