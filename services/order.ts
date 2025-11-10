import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { FoodOrder, OrderHistoryResponse } from '@/types/order';

type CreateOrderData = {
  food_id: string;
  quantity: number;
  special_instructions?: string;
};

type OrderParams = {
  status?: string;
  page?: number;
  limit?: number;
};

type HistoryParams = {
  page?: number;
  limit?: number;
};

export const OrderService = {
  create: (data: CreateOrderData) => 
    client.post<{ message: string; order: FoodOrder }>(API_ENDPOINTS.ORDERS.ALL, data),
  
  getMyOrders: () => 
    client.get<{ message: string; orders: FoodOrder[]; count: number }>(API_ENDPOINTS.ORDERS.MY_ORDERS),
  
  getHistory: (params?: HistoryParams) => 
    client.get<OrderHistoryResponse>(API_ENDPOINTS.ORDERS.HISTORY, params),
  
  getByEvent: (eventId: string, params?: OrderParams) => 
    client.get<{ orders: FoodOrder[]; total: number }>(API_ENDPOINTS.ORDERS.BY_EVENT(eventId), params),
  
  getById: (orderId: string) => 
    client.get<{ message: string; order: FoodOrder }>(API_ENDPOINTS.ORDERS.BY_ID(orderId))
};
