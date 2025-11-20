import {
    FoodOrder,
    FoodOrderCreateInput,
    FoodOrderCreateOutput,
    FoodOrderEventOutput,
    FoodOrderHistoryOutput,
    FoodOrderListOutput,
    FoodOrderQueryParams,
} from '@/types/backend';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

export const OrderService = {
  create: (data: FoodOrderCreateInput): Promise<FoodOrderCreateOutput> =>
    client.post<FoodOrderCreateOutput>(API_ENDPOINTS.FOOD_ORDERS.CREATE, data),

  getMyOrders: (): Promise<FoodOrderListOutput> =>
    client.get<FoodOrderListOutput>(API_ENDPOINTS.FOOD_ORDERS.MY_ORDERS),

  getHistory: (params?: FoodOrderQueryParams): Promise<FoodOrderHistoryOutput> =>
    client.get<FoodOrderHistoryOutput>(API_ENDPOINTS.FOOD_ORDERS.HISTORY, params as Record<string, unknown>),

  getByEvent: (eventId: string, params?: FoodOrderQueryParams): Promise<FoodOrderEventOutput> =>
    client.get<FoodOrderEventOutput>(API_ENDPOINTS.FOOD_ORDERS.BY_EVENT(eventId), params as Record<string, unknown>),

  getById: (orderId: string): Promise<{ message: string; order: FoodOrder }> =>
    client.get<{ message: string; order: FoodOrder }>(API_ENDPOINTS.FOOD_ORDERS.BY_ID(orderId)),

  update: (orderId: string, data: Partial<FoodOrder>): Promise<{ message: string; order: FoodOrder }> =>
    client.put<{ message: string; order: FoodOrder }>(API_ENDPOINTS.FOOD_ORDERS.UPDATE(orderId), data),

  delete: (orderId: string): Promise<{ message: string }> =>
    client.delete<{ message: string }>(API_ENDPOINTS.FOOD_ORDERS.DELETE(orderId)),
};
