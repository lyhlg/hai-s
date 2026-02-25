// SSE types
export type SSEEventType = 'order:created' | 'order:updated' | 'order:cancelled' | 'session:ended';

export interface SSEEvent<T = unknown> {
  type: SSEEventType;
  data: T;
  timestamp: string;
}

export interface OrderCreatedEvent {
  order_id: string;
  session_id: string;
  table_id: string;
  table_number: number;
  items: Array<{
    menu_item_name: string;
    quantity: number;
  }>;
  total_amount: number;
}

export interface OrderUpdatedEvent {
  order_id: string;
  status: string;
  updated_at: string;
}

export interface OrderCancelledEvent {
  order_id: string;
}
