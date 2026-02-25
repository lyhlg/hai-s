// SSE types
export type SSEEventType = 'order:created' | 'order:updated' | 'order:cancelled' | 'session:ended';

export interface SSEEvent {
  type: SSEEventType;
  data: any;
  timestamp: Date;
}

export interface OrderCreatedEvent {
  order_id: number;
  session_id: number;
  table_number: string;
  items: Array<{
    menu_item_name: string;
    quantity: number;
  }>;
  total_amount: number;
}

export interface OrderUpdatedEvent {
  order_id: number;
  status: string;
  updated_at: Date;
}
