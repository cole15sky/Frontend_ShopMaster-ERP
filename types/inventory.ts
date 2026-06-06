export type Inventory = {
  id: number;
  variant: number;
  variant_name: string;
  product_name: string;
  quantity: number;
  low_stock_alert: number;
  updated_at: string;
};

export type Unit = "PCS" | "KG" | "G" | "L" | "BOX" | "PACK";

export type StockInPayload = {
  variant_id: number;
  quantity: number;
  unit: Unit;
  note?: string;
};

export type StockOutPayload = StockInPayload;

export type StockAdjustPayload = {
  variant_id: number;
  new_quantity: number;
  unit: Unit;
  note?: string;
};

export type LowStockItem = {
  variant_id: number;
  variant: string;
  stock: number;
  low_stock_alert: number;
};

export type StockHistoryEntry = Record<string, string>;

export type StockHistory = {
  variant_id: number;
  history: StockHistoryEntry[];
};
