import { User } from './auth';
import { Event } from './events';
import { Food } from './food';

// ============================================================================
// ENUMS
// ============================================================================

export enum FoodOrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}

// ============================================================================
// FOOD ORDER INTERFACES
// ============================================================================

export interface FoodOrderCreateInput {
  food_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface FoodOrder {
  order_id: string;
  user_id: string;
  food_id: string;
  event_id: string;
  order_status: FoodOrderStatus;
  quantity?: number;
  special_instructions?: string;
  Food?: Food;
  User?: User;
  Event?: Event;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodOrderCreateOutput {
  message: string;
  order: FoodOrder;
}

export interface FoodOrderListOutput {
  message: string;
  orders: FoodOrder[];
  count: number;
}

export interface FoodOrderHistoryOutput {
  message: string;
  orders: FoodOrder[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FoodOrderEventOutput {
  message: string;
  orders: FoodOrder[];
  page: number;
  limit: number;
  total: number;
  [key: string]: any;
}

// ============================================================================
// QUERY PARAMETERS INTERFACES
// ============================================================================

export interface FoodOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Legacy interfaces for backward compatibility
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