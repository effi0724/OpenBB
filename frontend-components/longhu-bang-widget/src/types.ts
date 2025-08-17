// 龙虎榜数据类型定义
export interface LonghuBangItem {
  code?: string;
  name?: string;
  reason?: string;
  close_price?: number;
  change_percent?: number;
  amount?: number;
  buy_amount?: number;
  sell_amount?: number;
  net_amount?: number;
  date?: string;
  // 为了兼容可能的中文字段名
  [key: string]: any;
}

export interface ApiResponse {
  results: LonghuBangItem[];
  extra?: {
    error?: string;
  };
}
