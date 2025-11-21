export interface FoodOrder {
  order_id: string;
  food_id: string;
  event_id: string;
  quantity: number;
  special_instructions?: string;
  status: string;
  user_id: string;
}

export interface PaginatedOrders {
  message: string;
  orders: FoodOrder[];
  total: number;
  limit: number;
  offset: number;
}

export interface FoodItem {
  food_id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface OrderHistoryResponse {
  message: string;
  orders: FoodOrder[];
  totalPages: number;
  currentPage: number;
  totalOrders: number;
}