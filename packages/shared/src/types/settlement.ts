// Settlement types
export interface DailySales {
  date: string;
  total_orders: number;
  total_amount: number;
  total_customers: number;
}

export interface SessionSettlement {
  session_id: number;
  table_number: string;
  start_time: Date;
  end_time: Date;
  total_orders: number;
  total_amount: number;
}
