// Store types
export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  created_at: Date;
}

export interface CreateStoreInput {
  name: string;
  address: string;
  phone: string;
}
