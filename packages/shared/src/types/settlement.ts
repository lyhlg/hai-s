// Settlement types
export interface DailySales {
  date: string;
  total_orders: number;
  total_amount: number;
}

export interface TableSales {
  table_id: string;
  table_number: number;
  total_orders: number;
  total_amount: number;
}

export interface DailySalesResponse {
  date: string;
  total_orders: number;
  total_amount: number;
  tables: TableSales[];
}
