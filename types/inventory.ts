export type Inventory = {
  id: number;
  variant: number;
  variant_name: string;
  product_name: string;
  quantity: number;
  low_stock_alert: number;
  updated_at: string;
};

export type StockHistoryEntry = Record<string, string>;

export type StockHistory = {
  variant_id: number;
  history: StockHistoryEntry[];
};
