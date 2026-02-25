// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface Order {
  id: number;
  session_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_requests: string | null;
}

export interface CreateOrderInput {
  session_id: number;
  items: {
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    special_requests?: string;
  }[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
