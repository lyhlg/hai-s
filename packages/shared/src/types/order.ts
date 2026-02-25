// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface Order {
  id: string;
  store_id: string;
  session_id: string;
  table_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CreateOrderInput {
  items: {
    menu_item_id: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
