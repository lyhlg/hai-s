import { api } from './client';

export interface CreateTableRequest {
  tableNumber: string;
  password: string;
  capacity?: number;
}

// BE 응답은 camelCase로 변환되어 옴
export interface TableResponse {
  id: number;
  storeId: number;
  tableNumber: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
}

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
